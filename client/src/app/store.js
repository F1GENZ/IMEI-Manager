import { configureStore } from "@reduxjs/toolkit";
import clientSlice from "../features/clientSlice";
import productSlice from "../features/productSlice";
import notifySlice from "../features/notifySlice";

export const store = configureStore({
  reducer: {
    product: productSlice,
    client: clientSlice,
    notify: notifySlice,
  },
});
