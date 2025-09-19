import { createContext, useReducer, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { 
  getCartRequest, 
  addCartItemRequest, 
  updateCartItemRequest, 
  removeCartItemRequest, 
  clearCartRequest 
} from "../api/cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const cartReducer = (state, action) => {
    switch (action.type) {
      case "SET_CART":
        return { items: action.payload };
      case "ADD_ITEM_OPTIMISTIC": {
        const existing = state.items.find(i => i.productId === action.payload.productId);
        if (existing) {
          return {
            ...state,
            items: state.items.map(i =>
              i.productId === action.payload.productId 
                ? { ...i, cantidad: Math.min(i.cantidad + action.payload.cantidad, i.stock || 999) }
                : i
            ),
          };
        }
        return { 
          ...state, 
          items: [...state.items, {
            productId: action.payload.productId,
            nombre: action.payload.nombre,
            imagen: action.payload.imagen,
            cantidad: action.payload.cantidad,
            precioUnitario: action.payload.precioUnitario,
            stock: action.payload.stock
          }] 
        };
      }
      case "UPDATE_ITEM_OPTIMISTIC":
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, cantidad: action.payload.cantidad }
              : i
          ).filter(i => i.cantidad > 0),
        };
      case "REMOVE_ITEM_OPTIMISTIC":
        return { 
          ...state, 
          items: state.items.filter(i => i.productId !== action.payload) 
        };
      case "CLEAR_CART_OPTIMISTIC":
        return { items: [] };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Función para extraer mensaje de error detallado
  const getErrorMessage = (error) => {
    // Extraer mensaje del backend
    const backendMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message;
    
    // Si contiene información de stock, personalizar el mensaje
    if (backendMessage && backendMessage.toLowerCase().includes('stock insuficiente')) {
      // Extraer números del mensaje si los hay
      const stockMatch = backendMessage.match(/disponible:\s*(\d+)/i);
      const requestedMatch = backendMessage.match(/solicitado:\s*(\d+)/i);
      
      if (stockMatch) {
        const availableStock = stockMatch[1];
        return `Stock insuficiente. Solo quedan ${availableStock} unidades disponibles.`;
      }
      
      return "Stock insuficiente. No hay suficientes unidades disponibles.";
    }
    
    if (backendMessage && backendMessage.toLowerCase().includes('sin stock')) {
      return "Este producto está agotado en este momento.";
    }
    
    // Otros mensajes específicos
    if (backendMessage && backendMessage.toLowerCase().includes('producto no encontrado')) {
      return "El producto ya no está disponible.";
    }
    
    // Si no hay mensaje específico, usar uno genérico
    return backendMessage || "Error al procesar la solicitud";
  };

  // Cargar carrito desde el backend cuando el usuario se loguea
  const loadCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await getCartRequest();
      const API_URL = import.meta.env.VITE_API_URL || "";
      
      // Procesar las imágenes para agregar la URL completa
      const cartItems = (response.data || []).map(item => ({
        ...item,
        imagen: item.imagen && !item.imagen.startsWith('http') 
          ? `${API_URL}${item.imagen}` 
          : item.imagen || "/placeholder.png"
      }));
      
      dispatch({ type: "SET_CART", payload: cartItems });
    } catch (error) {
      console.error("Error cargando carrito:", error);
      toast.error("Error al cargar el carrito");
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Cargar carrito al montar el componente o cuando cambie el usuario
  useEffect(() => {
    if (user && !initialized) {
      loadCart();
    } else if (!user) {
      dispatch({ type: "CLEAR_CART_OPTIMISTIC" });
      setInitialized(false);
    }
  }, [user]);

  // Función para agregar item
  const addItem = async (product) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || "";
    const cartItem = {
      productId: product.id,
      nombre: product.nombre,
      imagen: product.imagen && !product.imagen.startsWith('http') 
        ? `${API_URL}${product.imagen}` 
        : product.imagen || "/placeholder.png",
      cantidad: 1,
      precioUnitario: product.precio,
      stock: product.stock
    };

    // Verificar stock antes de la actualización optimista
    const existingItem = state.items.find(i => i.productId === product.id);
    const currentQuantity = existingItem ? existingItem.cantidad : 0;
    const newQuantity = currentQuantity + 1;

    if (newQuantity > (product.stock || 0)) {
      if (product.stock === 0) {
        toast.error(`${product.nombre} está agotado`);
      } else {
        toast.error(`Solo puedes agregar ${product.stock} unidades de ${product.nombre}. Ya tienes ${currentQuantity} en tu carrito.`);
      }
      return;
    }

    // Actualización optimista
    dispatch({ type: "ADD_ITEM_OPTIMISTIC", payload: cartItem });
    
    toast.success("Agregado al carrito", {
      description: `${product.nombre} está esperando por ti`,
    });

    try {
      await addCartItemRequest({ productId: product.id, cantidad: 1 });
      // Recargar carrito para sincronizar con el backend
      loadCart();
    } catch (error) {
      console.error("Error agregando al carrito:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      // Revertir cambio optimista
      loadCart();
    }
  };

  // Función para incrementar cantidad
  const incrementQuantity = async (productId) => {
    if (!user) return;

    const item = state.items.find(i => i.productId === productId);
    if (!item) return;

    const newQuantity = item.cantidad + 1;
    if (newQuantity > (item.stock || 999)) {
      if (item.stock === item.cantidad) {
        toast.error(`Ya tienes todo el stock disponible de ${item.nombre} (${item.stock} unidades)`);
      } else {
        toast.error(`Solo quedan ${item.stock} unidades de ${item.nombre}`);
      }
      return;
    }

    // Actualización optimista
    dispatch({ 
      type: "UPDATE_ITEM_OPTIMISTIC", 
      payload: { productId, cantidad: newQuantity } 
    });

    try {
      await updateCartItemRequest({ productId, cantidad: newQuantity });
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      loadCart();
    }
  };

  // Función para decrementar cantidad
  const decrementQuantity = async (productId) => {
    if (!user) return;

    const item = state.items.find(i => i.productId === productId);
    if (!item) return;

    const newQuantity = item.cantidad - 1;

    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    // Actualización optimista
    dispatch({ 
      type: "UPDATE_ITEM_OPTIMISTIC", 
      payload: { productId, cantidad: newQuantity } 
    });

    try {
      await updateCartItemRequest({ productId, cantidad: newQuantity });
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      loadCart();
    }
  };

  // Función para remover item
  const removeItem = async (productId) => {
    if (!user) return;

    // Actualización optimista
    dispatch({ type: "REMOVE_ITEM_OPTIMISTIC", payload: productId });
    
    toast.success("Producto eliminado del carrito");

    try {
      await removeCartItemRequest(productId);
    } catch (error) {
      console.error("Error removiendo del carrito:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      loadCart();
    }
  };

  // Función para limpiar carrito
  const clearCart = async () => {
    if (!user) return;

    // Actualización optimista
    dispatch({ type: "CLEAR_CART_OPTIMISTIC" });
    
    toast.success("Carrito vaciado");

    try {
      await clearCartRequest();
    } catch (error) {
      console.error("Error vaciando carrito:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      loadCart();
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart: state.items, 
      loading,
      addItem,
      incrementQuantity,
      decrementQuantity,
      removeItem,
      clearCart,
      refreshCart: loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};