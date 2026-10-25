import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type CartItem = { _id: string; name: string; price: number; image: string; unit: string; qty: number };
type CartState = { items: CartItem[] };
const initialState: CartState = { items: [] };
const cartSlice = createSlice({
  name: "cart", initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, "qty">>) {
      const found = state.items.find(item => item._id === action.payload._id);
      if (found) found.qty += 1;
      else state.items.push({ ...action.payload, qty: 1 });
    },
    removeFromCart(state, action: PayloadAction<string>) { state.items = state.items.filter(item => item._id !== action.payload); },
    changeQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const item = state.items.find(p => p._id === action.payload.id);
      if (item) item.qty = Math.max(1, action.payload.qty);
    },
    clearCart(state) { state.items = []; }
  }
});
export const { addToCart, removeFromCart, changeQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
