import { createContext, useReducer, useContext } from "react";

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, cantidad: 1 }],
        };
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "INCREMENT_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ),
      };

    case "DECREMENT_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? { ...item, cantidad: item.cantidad - 1 }
              : item
          )
          .filter((item) => item.cantidad > 0),
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ cart: state.items, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
