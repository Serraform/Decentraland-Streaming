import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { fetchCostService } from 'store/services/transaction.service';
import smartcontractV2ABI from "utils/abi/smartcontractV2ABI.json";
const smartcontractABI = smartcontractV2ABI.output.abi;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
type InitialState = {
  loading: boolean;
  cost: number;
  error: string;
  receipt: any;
};

const initialState: InitialState = {
  cost: 0,
  loading: false,
  error: "",
  receipt: null
};

export const estimateCost = createAsyncThunk(
  "transaction/estimateCost",
  async (streamValues: any) => {
    const response = await fetchCostService(streamValues.streamStartDate.toUTCString(), streamValues.streamEndDate.toUTCString());
    return { cost: parseInt(response.data.cost) as unknown  as number};
  }
);

export const lockFunds = createAsyncThunk(
  "transaction/lockFunds",
  async (props: any) => {
    const { addToast, duration, amountToBeLock } = props;
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        return;
      }
      
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletId = accounts[0];
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS as string,
        smartcontractABI,
        signer
      );
      const deposit = ethers.utils.parseUnits(""+amountToBeLock, "6");
      const tx = await contract.lock_funds(walletId, duration, deposit);
      addToast("Waiting for transaction approval", {
        autoDismiss: true,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        addToast("Funds locked, starting upload of stream", {
          appearance: "success",
          autoDismiss: true,
        });
        return receipt;
      } else {
        throw new Error();
      }
    } catch (e) {
      addToast("We couldn't locked your funds", {
        appearance: "error",
        autoDismiss: true,
      });
      throw new Error();
    }
  }
);

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState,
  reducers: {
    finishTransaction(state: any) {
      return {
        ...initialState,
        cost: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(lockFunds.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(lockFunds.fulfilled, (state, action) => {
      state.loading = false;
      state.receipt = action.payload;
    });
    builder.addCase(lockFunds.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
    });
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

export const { finishTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
