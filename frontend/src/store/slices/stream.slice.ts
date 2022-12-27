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
  streams: [],
  // streams: [
  //   {
  //     status: true,
  //     type: "vod",
  //     playbackUrl: "https://example.com",
  //     name: "Example stream",
  //     startDate: new Date("2023-12-21T00:00:00Z"),
  //     endDate: new Date("2023-12-24T00:00:00Z"),
  //     attendees: "0",
  //     video: "https://example.com",
  //     videoSize: "2312312313",
  //     videoLenght: "1200",
  //     createdAt: 
  //   },
  //   {
  //     status: true,
  //     playbackUrl: "https://example.com",
  //     name: "Example live stream",
  //     startDate: new Date("2023-11-01T12:00:00Z"),
  //     endDate: new Date("2023-12-01T15:00:00Z"),
  //     attendees: "0",
  //     type: "live-stream",
  //     rtmpIngestUrl: "",
  //     streamKey: "",
  //   },
  // ],
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
