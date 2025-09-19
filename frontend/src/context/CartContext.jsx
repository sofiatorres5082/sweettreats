// context/CartContext.jsx
import { createContext, useReducer, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext"; // 👈 para sacar el user

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // ej: { id, email, role }
  const userId = user?.id || "guest"; // fallback si no está logueado
  const storageKey = `cart_${userId}`;

  const getInitialCart = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : { items: [] };
    } catch (e) {
      console.error("Error leyendo el carrito", e);
      return { items: [] };
    }
  };

  const cartReducer = (state, action) => {
    switch (action.type) {
      case "ADD_ITEM": {
        const existing = state.items.find(i => i.id === action.payload.id);
        if (existing) {
          const nuevaCant = Math.min(existing.cantidad + 1, existing.stock);
          return {
            ...state,
            items: state.items.map(i =>
              i.id === action.payload.id ? { ...i, cantidad: nuevaCant } : i
            ),
          };
        }
        return { ...state, items: [...state.items, action.payload] };
      }
      case "INCREMENT_QUANTITY":
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload
              ? { ...i, cantidad: Math.min(i.cantidad + 1, i.stock) }
              : i
          ),
        };
      case "DECREMENT_QUANTITY":
        return {
          ...state,
          items: state.items
            .map(i =>
              i.id === action.payload
                ? { ...i, cantidad: i.cantidad - 1 }
                : i
            )
            .filter(i => i.cantidad > 0),
        };
      case "REMOVE_ITEM":
        return { ...state, items: state.items.filter(i => i.id !== action.payload) };
      case "CLEAR_CART":
        return { items: [] };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialCart);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  useEffect(() => {
    if (!user) {
      dispatch({ type: "CLEAR_CART" });
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cart: state.items, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
