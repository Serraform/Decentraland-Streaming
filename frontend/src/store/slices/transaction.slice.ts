import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type InitialState = {
  loading: boolean;
  cost:number;
  error: string;
};

const initialState: InitialState = {
  cost: 0,
  loading: false,
  error: "",
};

export const estimateCost = createAsyncThunk(
  "transaction/estimateCost",
  async (streamValues: any) => {
    return { cost: 1.15 };
  }
);

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState,
  reducers: {
    finishTransaction(state: any) {
      return {
        ...initialState,
        cost: 0
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(estimateCost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(estimateCost.fulfilled, (state, action) => {
      state.loading = false;
      state.cost = action.payload.cost;
    });
    builder.addCase(estimateCost.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
    });
  },
});

export const { finishTransaction } =
transactionSlice.actions;

export default transactionSlice.reducer;
