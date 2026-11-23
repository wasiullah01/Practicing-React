export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.find((item) => item.id === action.product.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case "remove":
      return state.filter((item) => item.id !== action.id);
    case "set-quantity":
      if (!Number.isInteger(action.quantity) || action.quantity < 0) {
        throw new RangeError("Cart quantity must be a non-negative integer");
      }
      return state
        .map((item) =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item,
        )
        .filter((item) => item.quantity > 0);
    case "clear":
      return [];
    default:
      throw new Error(`Unknown cart action: ${action.type}`);
  }
}
