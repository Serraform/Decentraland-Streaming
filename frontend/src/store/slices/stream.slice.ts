import { createSlice } from "@reduxjs/toolkit";
import { IStreamVOD, ILiveStream } from "components/stream/definitions";

type InitialState = {
  streams: (IStreamVOD | ILiveStream)[];
  selectedStream: IStreamVOD | ILiveStream;
  searchText: string;
  message: string;
  openModal: boolean;
  isNewStream: boolean;
};

const initialState: InitialState = {
  // streams: [],
  streams: [
    {
      name:"Testing Live stream2",
      status:false,
      attendees:"12",
      startDate:new Date("2022-12-29T03:00:00.000Z"),
      endDate:new Date("2022-12-31T03:00:00.000Z"),
      type:"live-stream",
      video:"",
      videoSize:"",
      videoLenght:"",
      createdAt:1672330083298,
      id:"e5ffacff-2f64-4f29-b5d8-3f46c163edd0",
      playbackId:"e5fflg5ysneh7t4w",
      playbackUrl:"https://livepeercdn.com/hls/e5fflg5ysneh7t4w/index.m3u8",
      rtmpIngestUrl:"rtmp://rtmp.livepeer.com/live/e5ff-cz4e-tg49-1q9f",
      streamKey:"e5ff-cz4e-tg49-1q9f"
    },
  ],
  selectedStream: {
    name: "",
    status: false,
    attendees: "",
    startDate: undefined,
    endDate: undefined,
    type: "",
    video: "",
    videoSize: "",
    videoLenght: "",
    createdAt: 0,
    id: "",
    playbackId: "",
    playbackUrl: "",
  },
  isNewStream: true,
  openModal: false,
  searchText: "",
  message: "",
};

const insert = (arr: Array<any>, index: number, newItem: any) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index),
];

const streamSlice = createSlice({
  name: "streamSlice",
  initialState,
  reducers: {
    selectStream(state: any, payload) {
      return {
        ...initialState,
        selectedStream: {
          ...payload.payload.setSelectedStream,
          index: payload.payload.index,
        },
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
    editStream(state: any, payload) {
      const streamToAdd = { ...payload.payload };
      let newData = initialState.streams.map((item) => Object.assign({}, item));
      newData.splice(payload.payload.index, 1);
      newData = insert(newData, payload.payload.index, streamToAdd);
      return {
        ...initialState,
        openModal: false,
        streams: newData,
      };
    },
  },
});

export const {
  selectStream,
  handleOpenModal,
  handleCloseModal,
  uploadStream,
  editStream,
} = streamSlice.actions;

export default streamSlice.reducer;
