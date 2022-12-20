import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchStreamsService } from "store/services/stream.service";
import { IStreamVOD, ILiveStream } from "components/stream/definitions";

type InitialState = {
  loading: boolean;
  streams: (IStreamVOD | ILiveStream)[];
  error: string;
  selectedStream: IStreamVOD | ILiveStream;
  searchText: string;
  message: string;
  openModal: boolean;
  isNewStream: boolean;
};

const initialState: InitialState = {
  loading: false,
  streams: [
    {
      status: true,
      type: "vod",
      videoLink: "https://example.com",
      name: "Example stream",
      startDate: new Date("2022-12-21T00:00:00Z"),
      endDate: new Date("2022-12-24T00:00:00Z"),
      attendees: "0",
      video: "https://example.com",
      videoSize: "2312312313",
      videoLenght: "1200",
    },
    {
      status: true,
      videoLink: "https://example.com",
      name: "Example live stream",
      startDate: new Date("2022-11-01T00:00:00Z"),
      endDate: new Date("2022-12-01T00:00:00Z"),
      attendees: "0",
      type: "live-stream",
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
    video: "",
    videoSize: "",
    videoLenght: "",
  },
  isNewStream: true,
  openModal: false,
  searchText: "",
  message: "",
};

export const fetchStreams = createAsyncThunk(
  "streams/fetchStreams",
  async (walletID: string) => {
    if (walletID) {
      // const response = await fetchStreamsService(walletID);
      // return {streams: response.data};
      return initialState;
    }
    return { streams: [] };
  }
);

const streamSlice = createSlice({
  name: "streamSlice",
  initialState,
  reducers: {
    selectStream(state: any, payload) {
      return {
        ...initialState,
        selectedStream: { ...payload.payload },
        openModal: true,
        isNewStream: false,
      };
    },
    handleOpenModal() {
      return { ...initialState, openModal: true };
    },
    handleCloseModal() {
      return { ...initialState, openModal: false };
    },
    uploadStream(state: any, payload) {
      const streamToAdd = { ...payload.payload };
      let newData = initialState.streams.map((item) => Object.assign({}, item));
      newData.push(streamToAdd);
      return {
        ...initialState,
        openModal: false,
        streams: newData,
      };
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

export const { selectStream, handleOpenModal, handleCloseModal, uploadStream } =
  streamSlice.actions;

export default streamSlice.reducer;
