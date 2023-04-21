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

export const update_singleClient = createAsyncThunk(
  "clients/update",
  async (data, thunkAPI) => {
    try {
      return await clientServices.call_updateClient(data);
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

export const delete_singleClients = createAsyncThunk(
  "clients/delete",
  async (data, thunkAPI) => {
    try {
      return await clientServices.call_deleteClient(data);
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

export const active_allAgency = createAsyncThunk(
  "clients/activess",
  async (data, thunkAPI) => {
    try {
      return await clientServices.call_activeAllAgency(data);
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
    resetClient: (state) => {
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
        state.clients = action.payload;
      })
      .addCase(get_allClients.rejected, (state, action) => {
        state.isLoadingClient = true;
        state.isErrorClient = true;
        state.messageClient = action.payload;
        state.clients = null;
      })
      .addCase(delete_singleClients.pending, (state) => {
        state.isLoadingClient = true;
      })
      .addCase(delete_singleClients.fulfilled, (state, action) => {
        state.isLoadingClient = false;
        state.isSuccessClient = true;
        state.messageClient = action.payload;
      })
      .addCase(delete_singleClients.rejected, (state, action) => {
        state.isLoadingClient = true;
        state.messageClient = action.payload;
      })
      .addCase(update_singleClient.pending, (state) => {
        state.isLoadingClient = true;
      })
      .addCase(update_singleClient.fulfilled, (state, action) => {
        state.isLoadingClient = false;
        state.isSuccessClient = true;
        state.messageClient = action.payload;
      })
      .addCase(update_singleClient.rejected, (state, action) => {
        state.isLoadingClient = true;
        state.messageClient = action.payload;
      })
      .addCase(active_allAgency.pending, (state) => {
        state.isLoadingClient = true;
      })
      .addCase(active_allAgency.fulfilled, (state, action) => {
        state.isLoadingClient = false;
        state.isSuccessClient = true;
        state.messageClient = action.payload;
      })
      .addCase(active_allAgency.rejected, (state, action) => {
        state.isLoadingClient = true;
        state.messageClient = action.payload;
      });
  },
});

export const { resetClient } = clientSlice.actions;
export default clientSlice.reducer;
