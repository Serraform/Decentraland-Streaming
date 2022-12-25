import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createAccount,
} from "store/services/account.service";
import jazzicon from "jazzicon-ts";

const initialState = {
  walletID: "",
  avatar: undefined,
  loading: false,
  error: null,
};

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
      const addr = accounts[0].slice(2, 10);
      const identicon = jazzicon(40, parseInt(addr, 10));
      return { walletID: accounts[0], avatar: identicon };
    } catch (e) {
      return { walletID: "", avatar: "" };
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
      state.walletID = action.payload?.walletID;
      state.avatar = action.payload?.avatar as any;
    });
    builder.addCase(requestConnectWallet.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default accountSlice.reducer;
