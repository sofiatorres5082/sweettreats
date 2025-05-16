import { createContext, useReducer, useContext, useEffect } from "react";

const initialState = { items: [] };

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : initialState;
  } catch (e) {
    console.error("Error leyendo el carrito del localStorage", e);
    return initialState;
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        const nuevaCant = Math.min(existing.cantidad + 1, existing.stock);
        if (nuevaCant === existing.cantidad) {
          // opcional: toast.error("No hay más stock disponible");
        }
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, cantidad: nuevaCant } : i
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    }

    case "INCREMENT_QUANTITY":
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload
            ? { ...i, cantidad: Math.min(i.cantidad + 1, i.stock) }
            : i
        )
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
          .filter(i => i.cantidad > 0)
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload)
      };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialCart());

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ cart: state.items, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
