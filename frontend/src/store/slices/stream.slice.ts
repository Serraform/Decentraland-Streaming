import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchStreamsService } from "store/services/stream.service";
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
  streams: [
    {
      status: true,
      type: "VOD",
      videoLink: "https://example.com",
      name: "Example stream",
      startDate: new Date("2020-01-01T00:00:00Z"),
      endDate: new Date("2020-01-01T00:00:00Z"),
      attendees: "0",
    },
    {
      status: true,
      type: "VOD",
      videoLink: "https://example.com",
      name: "Example stream",
      startDate: new Date("2020-01-01T00:00:00Z"),
      endDate: new Date("2020-01-01T00:00:00Z"),
      attendees: "0",
    },
  ],
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

export const fetchStreams = createAsyncThunk(
  "products/fetchProducts",
  async (walletID: string) => {
    // const response = await fetchStreamsService(walletID);
    return {streams: initialState.streams};
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
    builder.addCase(fetchStreams.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchStreams.fulfilled, (state, action) => {
      state.loading = false;
      state.streams = action.payload.streams;
    });
    builder.addCase(fetchStreams.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
    });
  },
});

export const { selectStream } = streamSlice.actions;

export default streamSlice.reducer;
