import { configureStore } from "@reduxjs/toolkit";
import clientSlice from "../features/client/clientSlice";
import productSlice from "../features/products/productSlice";
import notifySlice from "../features/notify/notifySlice";

export const store = configureStore({
  reducer: {
    product: productSlice,
    client: clientSlice,
    notify: notifySlice,
  },
});
