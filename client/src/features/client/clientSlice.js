import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clientServices from "./clientService";

const initialState = {
  clients: null,
  isErrorClient: false,
  isSuccessClient: false,
  isLoadingClient: false,
  messageClient: "",
};

export const get_allClients = createAsyncThunk(
  "clients/all",
  async (data, thunkAPI) => {
    try {
      return await clientServices.call_allClients(data);
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

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    reset: (state) => {
      state.isErrorClient = false;
      state.isSuccessClient = false;
      state.isLoadingClient = false;
      state.messageClient = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_allClients.pending, (state) => {
        state.isLoadingClient = true;
      })
      .addCase(get_allClients.fulfilled, (state, action) => {
        state.isLoadingClient = false;
        state.isSuccessClient = true;
        state.clients = action.payload;
      })
      .addCase(get_allClients.rejected, (state, action) => {
        state.isLoadingClient = true;
        state.isErrorClient = true;
        state.messageClient = action.payload;
        state.clients = null;
      });
  },
});

export const { reset } = clientSlice.actions;
export default clientSlice.reducer;
