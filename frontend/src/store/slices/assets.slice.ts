import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  title: string;
  isUploading: boolean;
  percentage: number;
  assetId: string;
};

const initialState: InitialState = {
  title: "",
  assetId: "",
  isUploading: false,
  percentage: 0,
};

const assetSlice = createSlice({
  name: "assetSlice",
  initialState,
  reducers: {
    startUploadAsset(state: any, payload) {
      const { title, assetId } = payload.payload;
      return {
        ...state,
        assetId,
        title,
        isUploading: true,
      };
    },
    selectAsset(state: any, payload) {
      return {
        ...state,
        assetId: payload.payload,
        percentage: "100.00",
      };
    },
    stopUploadAsset(state: any) {
      return {
        ...state,
        title: "",
        assetId: "",
        percentage: "",
        isUploading: false,
      };
    },
    updatePercentage(state: any, payload) {
      const { percentage } = payload.payload;
      return {
        ...state,
        percentage: percentage,
      };
    },
  },
});

export const { startUploadAsset, stopUploadAsset, updatePercentage, selectAsset } =
  assetSlice.actions;

export default assetSlice.reducer;
