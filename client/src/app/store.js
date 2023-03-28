import { configureStore } from "@reduxjs/toolkit";
import clientSlice from "../features/client/clientSlice";
import productSlice from "../features/products/productSlice";

export const store = configureStore({
  reducer: {
    product: productSlice,
    client: clientSlice,
  },
});
