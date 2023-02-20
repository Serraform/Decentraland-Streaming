import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  title: string;
  isUploading: boolean;
  percentage: number;
};

const initialState: InitialState = {
  title: "",
  isUploading: false,
  percentage: 0,
};

const assetSlice = createSlice({
  name: "assetSlice",
  initialState,
  reducers: {
    startUploadAsset(state: any, payload) {
      const { title } = payload.payload;
      return {
        ...state,
        title,
        isUploading: true,
      };
    },
    stopUploadAsset(state: any) {
      return {
        ...state,
        title: "",
        percentange: "",
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

export const { startUploadAsset, stopUploadAsset, updatePercentage } =
  assetSlice.actions;

export default assetSlice.reducer;
