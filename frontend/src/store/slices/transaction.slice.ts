import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { fetchCostService } from "store/services/transaction.service";
const smartcontractABI = process.env.REACT_APP_CONTRACT_ABI === "POLYGON"  ? require("utils/abi/smartcontractpolygon_abi.json") : require("utils/abi/smartcontractgoerli_abi.json");
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
type InitialState = {
  loading: boolean;
  cost: number;
  error: string;
  receipt: any;
  vaultContractId: number;
  transactionType: "lock" | "cancel" | "edit" | "";
  discountCost: number;
  hasDiscountCost: boolean;
};

const initialState: InitialState = {
  cost: 0,
  loading: false,
  error: "",
  receipt: null,
  transactionType: "",
  vaultContractId: 0,
  discountCost: 0,
  hasDiscountCost: false
};

export const estimateCost = createAsyncThunk(
  "transaction/estimateCost",
  async (props: any) => {
    const {streamValues, discount, isPremium} = props;
    if (streamValues.streamID) {
      const response = await fetchCostService(
        new Date(streamValues.streamStartDate).toISOString(),
        new Date(streamValues.streamEndDate).toISOString()
      );
      if(isPremium){
        const discountToMultiply = (100 - parseFloat(discount)) / 100;
        return {
          discountCost:(parseInt(response.data.cost) as unknown as number) * discountToMultiply,
          cost: (parseInt(response.data.cost) as unknown as number),
          hasDiscountCost: true,
          vaultContractId: streamValues.vaultContractId,
        };
      }
      return {
        cost: parseInt(response.data.cost) as unknown as number,
        vaultContractId: streamValues.vaultContractId,
        hasDiscountCost: false,
      };
    }
    const response = await fetchCostService(
      streamValues.streamStartDate.toISOString(),
      streamValues.streamEndDate.toISOString()
    );
   
    if(isPremium){
      const discountToMultiply = (100 - parseFloat(discount)) / 100;
      return {
        discountCost:(parseInt(response.data.cost) as unknown as number) * discountToMultiply,
        cost: (parseInt(response.data.cost) as unknown as number),
        hasDiscountCost: true,
        vaultContractId: parseInt(response.data.vaultContractId),
      };
    }
    return {
      cost: parseInt(response.data.cost) as unknown as number,
      vaultContractId: parseInt(response.data.vaultContractId),
      hasDiscountCost: false,
    };
  }
);

const getCurrentBlockchainTimestamp = async (provider: any) => {
  try{

    const blockNumber = provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    return block.timestamp;
  }
  catch(e){
    throw new Error();
  }
}

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
      const blockchainTimestamp = await getCurrentBlockchainTimestamp(provider);
      const deposit = ethers.utils.parseUnits("" + amountToBeLock, "6");
      const exactStartTime = blockchainTimestamp+durationUntilStart;
      const tx = await contract.lock_funds(
        "" + vaultContractId,
        exactStartTime,
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

export const withdrawToTreasury = createAsyncThunk(
  "transaction/withdrawToTreasury",
  async (props: any) => {
    // multiWithdraw
    const { vaultsId, vaultsFunds, addToast } = props;
    
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
      
      const tx = await contract.multiWithdraw(vaultsId, vaultsFunds);
      addToast("Waiting for transaction approval", {
        autoDismiss: true,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        addToast("Vaults withdrawn succesfully, please reload the page", {
          appearance: "success",
          autoDismiss: true,
        });
        return receipt;
      } else {
        throw new Error();
      }
    } catch (e) {
      
      addToast("We couldn't withdrawn funds", {
        appearance: "error",
        autoDismiss: true,
      });
      throw new Error();
    }
  }
);




export const transferAvailableFundsToWallet = createAsyncThunk(
  "transaction/availableFundsToWallet",
  async (props: any) => {
    // multiWithdraw
    const { amount, addToast } = props;
    const amountToTransfer = ethers.utils.parseUnits("" + amount, "6");
    
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
      const tx = await contract.withdraw(amountToTransfer);
      addToast("Waiting for transaction approval", {
        autoDismiss: true,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        addToast("Transfer to wallet succesfully", {
          appearance: "success",
          autoDismiss: true,
        });
        return receipt;
      } else {
        throw new Error();
      }
    } catch (e) {
      
      addToast("We couldn't transfer funds", {
        appearance: "error",
        autoDismiss: true,
      });
      throw new Error();
    }
  }
);

export const transferTreasuryToWallet = createAsyncThunk(
  "transaction/treasuryToWallet",
  async (props: any) => {
    // multiWithdraw
    const { walletAddress, amount, addToast } = props;
    const amountToTransfer = ethers.utils.parseUnits("" + amount, "6");
    
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
      const tx = await contract.treasuryWithdraw(walletAddress, amountToTransfer);
      addToast("Waiting for transaction approval", {
        autoDismiss: true,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        addToast("Transfer to treasury succesfully", {
          appearance: "success",
          autoDismiss: true,
        });
        return receipt;
      } else {
        throw new Error();
      }
    } catch (e) {
      
      addToast("We couldn't transfer funds", {
        appearance: "error",
        autoDismiss: true,
      });
      throw new Error();
    }
  }
);

export const viewVault = createAsyncThunk(
  "transaction/viewVault",
  async (props: any) => {
    // multiWithdraw
    const { vaultsId } = props;
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
      const tx = await contract.view_vault(vaultsId[0]);
      console.log(tx)
    } catch (e) {
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
        discountCost: 0,
        hasDiscountCost: false,
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
      state.discountCost=0;
      state.hasDiscountCost=false;
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

      state.hasDiscountCost=false;
      state.discountCost=0;
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
      state.hasDiscountCost=false;
      state.discountCost=0;
    });
    builder.addCase(withdrawToTreasury.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(withdrawToTreasury.fulfilled, (state, action) => {
      state.loading = false;
      state.receipt = action.payload;
    });
    builder.addCase(withdrawToTreasury.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
      state.cost = 0;
      state.hasDiscountCost=false;
      state.discountCost=0;
    });
    builder.addCase(transferTreasuryToWallet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(transferTreasuryToWallet.fulfilled, (state, action) => {
      state.loading = false;
      state.receipt = action.payload;
    });
    builder.addCase(transferTreasuryToWallet.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
      state.cost = 0;
      state.hasDiscountCost=false;
      state.discountCost=0;
    });
    builder.addCase(transferAvailableFundsToWallet.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(transferAvailableFundsToWallet.fulfilled, (state, action) => {
      state.loading = false;
      state.receipt = action.payload;
    });
    builder.addCase(transferAvailableFundsToWallet.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
      state.cost = 0;
      state.hasDiscountCost=false;
      state.discountCost=0;
    });
    builder.addCase(estimateCost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(estimateCost.fulfilled, (state, action) => {
      state.loading = false;
      state.cost = action.payload.cost;
      state.vaultContractId = action.payload.vaultContractId;
      state.discountCost = action.payload.discountCost as number;
      state.hasDiscountCost = action.payload.hasDiscountCost as boolean;
    });
    builder.addCase(estimateCost.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.error as any).message;
    });
  },
});

export const { finishTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
