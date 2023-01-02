import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createAccount,
} from "store/services/account.service";
import jazzicon from "jazzicon-ts";
import { ethers } from "ethers";
import smartcontractABI from "utils/abi/smartcontractABI.json";
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
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

export const fetchFunds = createAsyncThunk(
  "fetch-funds",
  async (walletID: string) => {
    try{
    const { ethereum } = window as any;
    if (!ethereum) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS as string,
      smartcontractABI,
      signer
    );
    debugger;
    const accountInfo = await contract.sub_info(walletID);
    }catch(e){
      debugger;
      console.log(e);
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
