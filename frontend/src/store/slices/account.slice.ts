import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAccount } from "store/services/account.service";
import jazzicon from "jazzicon-ts";
import { ethers } from "ethers";
import smartcontractABI from "utils/abi/smartcontractABI.json";
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const initialState = {
  walletID: "",
  avatar: undefined,
  balance: 0,
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
      const identicon = jazzicon(40, parseInt(addr, 20));
      return { walletID: accounts[0], avatar: identicon, balance: 0 };
    } catch (e) {
      return { walletID: "", avatar: "" };
    }
  }
);

export const fetchFunds = createAsyncThunk(
  "fetch-funds",
  async (walletID: string) => {
    try {
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
      const accountInfo = await contract.sub_info(walletID);
      return { balance: Number(accountInfo.balance._hex) as any };
    } catch (e) {
      console.log(e);
    }
  }
);

export const fundWallet = createAsyncThunk(
  "fund-wallet",
  async (props: any) => {
    const { amountToFund, addToast} = props;
    try {
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
      const deposit = ethers.utils.parseEther(amountToFund)
      const tx = await contract.createSubscription(deposit);
      addToast("Waiting for Metamask confirmation", {
        appearance: "pending",
        autoDismiss: true,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        addToast("Balance Updated", {
          appearance: "success",
          autoDismiss: true,
        });
        return { balance: amountToFund as any };
      }
    } catch (e) {
       addToast("We couldn't update your balance", {
          appearance: "error",
          autoDismiss: true,
        });
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
    builder.addCase(fetchFunds.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchFunds.fulfilled, (state, action) => {
      state.loading = false;
      state.balance = action.payload?.balance;
    });
    builder.addCase(fetchFunds.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(fundWallet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fundWallet.fulfilled, (state, action) => {
      state.loading = false;
      state.balance = action.payload?.balance;
    });
    builder.addCase(fundWallet.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default accountSlice.reducer;
