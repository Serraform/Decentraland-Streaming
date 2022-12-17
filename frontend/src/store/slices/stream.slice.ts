import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStreamsService } from "store/services/stream.service";
import { IStream } from "components/stream/definitions";

type InitialState = {
  loading: boolean;
  streams: IStream[];
  error: string;
  selectedStream: IStream;
  searchText: string;
  message: string;
};

const initialState: InitialState = {
  loading: false,
  streams: [],
  error: "",
  selectedStream: {
    name: "",
    status: false,
    attendees: "",
    startDate: new Date(),
    endDate: new Date(),
    type: "",
    videoLink: "",
  },
  searchText: "",
  message: "",
};

export const fetchStream = createAsyncThunk(
  "products/fetchProducts",
  async (walletID: string) => {
    const response = await fetchStreamsService(walletID);
    return response.data;
  }
);

const streamSlice = createSlice({
  name: "streamSlice",
  initialState,
  reducers: {
    selectStream(state) {
      return { ...initialState, selectedStream: state.selectedStream };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStream.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchStream.fulfilled, (state, action) => {
      state.loading = false;
      state.streams = action.payload.streams;
    });
    builder.addCase(fetchStream.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
    });
  },
});

export const { selectStream } = streamSlice.actions;

export default streamSlice.reducer;
