import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createAccount,
  getAccountDetailsByWalletId,
} from "store/services/account.service";
const initialState = { walletID: "", loading: false, error: null };

export const requestConnectWallet = createAsyncThunk(
  "connect-wallet",
  async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      return;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    try {
      
      await createAccount(accounts[0]);
      return accounts[0];
    } catch (e) {
      return accounts[0];
    }
  }
);

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(requestConnectWallet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(requestConnectWallet.fulfilled, (state, action) => {
      state.loading = false;
      state.walletID = action.payload;
    });
    builder.addCase(requestConnectWallet.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default accountSlice.reducer;
