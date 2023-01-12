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
  selectedStream: {
    name: "",
    status: false,
    attendees: "",
    streamType:"",
    video: "",
    videoSize: "",
    videoLenght: "",
    streamStartDate: undefined,
    streamEndDate: undefined,
    streamInfo: {
      Name: "",
      CreatedAt: 0,
      Id: "",
      IsActive: false,
      PlayBackId: "",
      Profiles: [],
      Record: false,
      StreamKey: "",
      Suspended: false,
      playbackUrl: "",
      rtmpIngestUrl: "",
    },
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
        ...state,
        selectedStream: {
          ...payload.payload.setSelectedStream,
          index: payload.payload.index,
        },
        openModal: true,
        isNewStream: false,
      };
    },
    handleOpenModal(state) {
      return { ...state, openModal: true };
    },
    handleCloseModal(state) {
      return { ...state, openModal: false };
    },
    uploadStream(state: any, payload) {
      const streamToAdd = { ...payload.payload };
      let newData = state.streams.map((item: any) => Object.assign({}, item));
      newData.push(streamToAdd);
      return {
        ...state,
        openModal: false,
        streams: newData,
      };
    },
    updateStreams(state: any, payload) {
      const streamsToAdd = payload.payload as any;

      return {
        ...state,
        openModal: false,
        streams: streamsToAdd.map((stream: any) => ({ ...stream, streamInfo: JSON.parse(stream.streamInfo)})),
      };
    },
    editStream(state: any, payload) {
      const streamToAdd = { ...payload.payload };
      let newData = state.streams.map((item: any) => Object.assign({}, item));
      newData.splice(payload.payload.index, 1);
      newData = insert(newData, payload.payload.index, streamToAdd);
      return {
        ...state,
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
  updateStreams
} = streamSlice.actions;

export default streamSlice.reducer;
