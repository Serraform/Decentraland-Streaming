import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { fetchCostService } from "store/services/transaction.service";
import smartcontractV2ABI from "utils/abi/smartContractV3Abi.json";
const smartcontractABI = smartcontractV2ABI.output.abi;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
type InitialState = {
  loading: boolean;
  cost: number;
  error: string;
  receipt: any;
  vaultContractId: number;
  transactionType: "lock" | "cancel" | "edit" | "";
};

const initialState: InitialState = {
  cost: 0,
  loading: false,
  error: "",
  receipt: null,
  transactionType: "",
  vaultContractId: 0,
};

export const estimateCost = createAsyncThunk(
  "transaction/estimateCost",
  async (streamValues: any) => {
    if (streamValues.streamID) {
      const response = await fetchCostService(
        new Date(streamValues.streamStartDate).toISOString(),
        new Date(streamValues.streamEndDate).toISOString()
      );
      return {
        cost: parseInt(response.data.cost) as unknown as number,
        vaultContractId: streamValues.vaultContractId,
      };
    }
    const response = await fetchCostService(
      streamValues.streamStartDate.toISOString(),
      streamValues.streamEndDate.toISOString()
    );
    return {
      cost: parseInt(response.data.cost) as unknown as number,
      vaultContractId: parseInt(response.data.vaultContractId),
    };
  }
);

export const lockFunds = createAsyncThunk(
  "transaction/lockFunds",
  async (props: any) => {
    const {
      addToast,
      duration,
      amountToBeLock,
      vaultContractId,
      durationUntilStart,
    } = props;
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
      const deposit = ethers.utils.parseUnits("" + amountToBeLock, "6");
      const tx = await contract.lock_funds(
        "" + vaultContractId,
        durationUntilStart,
        duration,
        deposit
      );
      addToast("Waiting for transaction approval", {
        autoDismiss: true,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        addToast("Funds locked, starting to schedule your stream", {
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

export const unLockAllFunds = createAsyncThunk(
  "transaction/unLockAllFunds",
  async (props: any) => {
    const { vaultContractId, addToast } = props;
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

      const tx = await contract.cancel_stream(vaultContractId);
      addToast("Waiting for transaction approval", {
        autoDismiss: true,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        addToast("Funds unlocked, stream canceled", {
          appearance: "success",
          autoDismiss: true,
        });
        return receipt;
      } else {
        throw new Error();
      }
    } catch (e) {
      addToast("We couldn't unlocked your funds", {
        appearance: "error",
        autoDismiss: true,
      });
      throw new Error();
    }
  }
);

export const editVault = createAsyncThunk(
  "transaction/editVault",
  async (props: any) => {
    const {
      vaultContractId,
      amountToBeUnlock,
      addToast,
      durationUntilStart,
      duration,
    } = props;
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
      
      const amountToEdit = ethers.utils.parseUnits("" + amountToBeUnlock, "6");
      const tx = await contract.edit_vault(
        vaultContractId,
        amountToEdit,
        duration,
        durationUntilStart
      );

      addToast("Waiting for transaction approval", {
        autoDismiss: true,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        addToast("Vault Updated", {
          appearance: "success",
          autoDismiss: true,
        });
        return receipt;
      } else {
        throw new Error();
      }
    } catch (e) {
      addToast("We couldn't update your funds", {
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
        cost: 0,
        loading: false,
        error: "",
        receipt: null,
        transactionType: "",
        vaultContractId: 0,
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
      state.transactionType = "lock";
    });
    builder.addCase(lockFunds.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
      state.cost = 0;
    });
    builder.addCase(unLockAllFunds.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(unLockAllFunds.fulfilled, (state, action) => {
      state.loading = false;
      state.receipt = action.payload;
      state.transactionType = "cancel";
    });
    builder.addCase(unLockAllFunds.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
      state.cost = 0;
    });
    builder.addCase(editVault.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editVault.fulfilled, (state, action) => {
      state.loading = false;
      state.receipt = action.payload;
      state.transactionType = "edit";
    });
    builder.addCase(editVault.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
      state.cost = 0;
    });
    builder.addCase(estimateCost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(estimateCost.fulfilled, (state, action) => {
      state.loading = false;
      state.cost = action.payload.cost;
      state.vaultContractId = action.payload.vaultContractId;
    });
    builder.addCase(estimateCost.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
    });
  },
});

export const { finishTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
