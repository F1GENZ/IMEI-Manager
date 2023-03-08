import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productServices from "./productService";

const initialState = {
  products: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
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

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_allProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_allProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(get_allProducts.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = true;
        state.message = action.payload;
        state.products = null;
      }).addCase(get_singleProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_singleProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(get_singleProduct.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = true;
        state.message = action.payload;
        state.products = null;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
