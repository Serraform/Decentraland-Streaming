import { createSlice } from "@reduxjs/toolkit";
import { IStreamVOD, ILiveStream, IRelayService } from "components/stream/definitions";

type InitialState = {
  streams: (IStreamVOD | ILiveStream  | IRelayService)[];
  selectedStream: IStreamVOD | ILiveStream | IRelayService;
  searchText: string;
  message: string;
};

const initialState: InitialState = {
  streams: [],
  selectedStream: {
    name: "",
    status: false,
    streamType: "",
    pulled:false,
    streamID: "",
    playBackUrl: "",
    asset: null,
    VId: "",
    cost: "",
    relayUrl:"",
    vaultContractId: "",
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
      playBackUrl: "",
      rtmpIngestUrl: "",
    },
  },
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
      };
    },
    clearSelectStream(state: any) {
      return {
        ...state,
        selectedStream: initialState.selectedStream,
      };
    },

    uploadStream(state: any, payload) {
      const streamToAdd = { ...payload.payload };

      let newData = state.streams.map((item: any) => Object.assign({}, item));
      newData.push(streamToAdd);
      return {
        ...state,
        streams: newData,
      };
    },
    deleteStreamFromTable(state: any, payload) {
      const streamToDelete = payload.payload;
      let newData = state.streams.filter((item: any) => item.Id === streamToDelete);
      
      return {
        ...state,
        streams: newData,
      };
    },
    updateStreams(state: any, payload) {
      const streamsToAdd = payload.payload as any;

      return {
        ...state,
        streams: streamsToAdd.map((stream: any) => ({
          ...stream,
          streamInfo: JSON.parse(stream.streamInfo),
        })),
      };
    },
    editStreamFromTable(state: any, payload) {
      const streamToAdd = { ...payload.payload };
      let newData = state.streams.map((item: any) => Object.assign({}, item));
      newData.splice(payload.payload.index, 1);
      newData = insert(newData, payload.payload.index, streamToAdd);
      return {
        ...state,
        streams: newData,
      };
    },
  },
});

export const {
  selectStream,
  uploadStream,
  editStreamFromTable,
  updateStreams,
  deleteStreamFromTable,
  clearSelectStream,
} = streamSlice.actions;

export default streamSlice.reducer;
