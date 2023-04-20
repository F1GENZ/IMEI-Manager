import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productServices from "./productService";

const initialState = {
  products: null,
  isErrorProduct: false,
  isSuccessProduct: false,
  isLoadingProduct: false,
  messageProduct: "",
};

export const get_allProducts = createAsyncThunk(
  "products/all",
  async (data, thunkAPI) => {
    try {
      return await productServices.call_allProducts(data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const get_singleProduct = createAsyncThunk(
  "products/single",
  async (data, thunkAPI) => {
    try {
      return await productServices.call_singleProduct(data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const update_singleProduct = createAsyncThunk(
  "products/update",
  async (data, thunkAPI) => {
    try {
      return await productServices.update_singleProduct(data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProduct: (state) => {
      state.isErrorProduct = false;
      state.isSuccessProduct = false;
      state.isLoadingProduct = false;
      state.messageProduct = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_allProducts.pending, (state) => {
        state.isLoadingProduct = true;
      })
      .addCase(get_allProducts.fulfilled, (state, action) => {
        state.isLoadingProduct = false;
        state.products = action.payload;
      })
      .addCase(get_allProducts.rejected, (state, action) => {
        state.isLoadingProduct = true;
        state.isErrorProduct = true;
        state.messageProduct = action.payload;
      })
      .addCase(update_singleProduct.pending, (state) => {
        state.isLoadingProduct = true;
      })
      .addCase(update_singleProduct.fulfilled, (state, action) => {
        state.isLoadingProduct = false;
        state.isSuccessProduct = true;
        state.messageProduct = action.payload;
      })
      .addCase(update_singleProduct.rejected, (state, action) => {
        state.isLoadingProduct = true;
        state.isErrorProduct = true;
        state.messageProduct = action.payload;
      });
  },
});

export const { resetProduct } = productSlice.actions;
export default productSlice.reducer;
