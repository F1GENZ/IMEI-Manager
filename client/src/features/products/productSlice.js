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

export const remove_singleUser = createAsyncThunk(
  "products/remove_user",
  async (data, thunkAPI) => {
    try {
      return await productServices.delete_singleUser(data);
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
    reset: (state) => {
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
        state.isSuccessProduct = true;
        state.products = action.payload;
      })
      .addCase(get_allProducts.rejected, (state, action) => {
        state.isLoadingProduct = true;
        state.isErrorProduct = true;
        state.messageProduct = action.payload;
        state.products = null;
      })
      .addCase(get_singleProduct.pending, (state) => {
        state.isLoadingProduct = true;
      })
      .addCase(get_singleProduct.fulfilled, (state, action) => {
        state.isLoadingProduct = false;
        state.isSuccessProduct = true;
        state.products = action.payload;
      })
      .addCase(get_singleProduct.rejected, (state, action) => {
        state.isLoadingProduct = true;
        state.isErrorProduct = true;
        state.messageProduct = action.payload;
        state.products = null;
      })
      .addCase(remove_singleUser.pending, (state) => {
        state.isLoadingProduct = true;
      })
      .addCase(remove_singleUser.fulfilled, (state, action) => {
        state.isLoadingProduct = false;
        state.isSuccessProduct = true;
        state.products = action.payload;
      })
      .addCase(remove_singleUser.rejected, (state, action) => {
        state.isLoadingProduct = true;
        state.isErrorProduct = true;
        state.messageProduct = action.payload;
        state.products = null;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
