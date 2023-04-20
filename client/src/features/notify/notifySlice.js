import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notifyServices from "./notifyServices";

const initialState = {
  notify: null,
  isErrorNotify: false,
  isSuccessNotify: false,
  isLoadingNotify: false,
  messageNotify: "",
};

export const get_allNotify = createAsyncThunk(
  "notify/all",
  async (data, thunkAPI) => {
    try {
      return await notifyServices.call_allNotify();
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

export const delete_singleNotify = createAsyncThunk(
  "notify/delete",
  async (data, thunkAPI) => {
    try {
      return await notifyServices.call_deleteNotify(data);
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

export const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    resetNotify: (state) => {
      state.isErrorNotify = false;
      state.isSuccessNotify = false;
      state.isLoadingNotify = false;
      state.messageNotify = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_allNotify.pending, (state) => {
        state.isLoadingNotify = true;
      })
      .addCase(get_allNotify.fulfilled, (state, action) => {
        state.isLoadingNotify = false;
        state.notify = action.payload;
      })
      .addCase(get_allNotify.rejected, (state, action) => {
        state.isLoadingNotify = true;
        state.isErrorNotify = true;
        state.messageNotify = action.payload;
        state.notify = null;
      })
      .addCase(delete_singleNotify.pending, (state) => {
        state.isLoadingNotify = true;
      })
      .addCase(delete_singleNotify.fulfilled, (state, action) => {
        state.isLoadingNotify = false;
        state.isSuccessNotify = true;
        state.messageNotify = action.payload;
      })
      .addCase(delete_singleNotify.rejected, (state, action) => {
        state.isLoadingNotify = true;
        state.isErrorNotify = true;
        state.messageNotify = action.payload;
      });
  },
});

export const { resetNotify } = notifySlice.actions;
export default notifySlice.reducer;
