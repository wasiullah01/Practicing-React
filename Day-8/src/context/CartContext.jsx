import { useEffect, useReducer } from "react";
import { cartReducer } from "./cartReducer.js";
import { CartContext } from "./cartContext.js";

const STORAGE_KEY = "everyday-store-cart";

function getSavedItems() {
  try {
    const savedItems = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedItems) ? savedItems : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, getSavedItems);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const value = {
    items,
    itemCount,
    subtotal,
    addItem: (product) => dispatch({ type: "add", product }),
    removeItem: (id) => dispatch({ type: "remove", id }),
    setQuantity: (id, quantity) =>
      dispatch({ type: "set-quantity", id, quantity }),
    clearCart: () => dispatch({ type: "clear" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
