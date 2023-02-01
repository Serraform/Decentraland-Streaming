import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createAccount,
  getSignatureChallenge,
  verifySignature,
} from "store/services/account.service";
import jazzicon from "jazzicon-ts";
import { ethers } from "ethers";
import smartcontractV2ABI from "utils/abi/smartcontractV2ABI.json";
import usdcABI from "utils/abi/usdcAbi.json";
const smartcontractABI = smartcontractV2ABI.output.abi;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const USDC_CONTRACT_ADDRESS = process.env.REACT_APP_USDC_CONTRACT_ADDRESS;
const initialState = {
  walletID: "",
  avatar: undefined,
  balance: 0,
  loading: false,
  error: null,
  locked_balance: 0
};

const targetNetworkId = "0x5";

const switchNetwork = async () => {
  const { ethereum } = window as any;
  const currentChainId = await ethereum.request({
    method: "eth_chainId",
  });

  // return true if network id is the same
  if (currentChainId !== targetNetworkId) {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetNetworkId }],
    });
    // refresh
    window.location.reload();
  }
};

const approvePulling = async (
  signer: any,
  funds: any,
  provider: any,
  account: string,
  addToast: any
) => {
  const USDCContract = new ethers.Contract(
    USDC_CONTRACT_ADDRESS as string,
    usdcABI,
    provider
  );
  const pullFundsApproval = await USDCContract.connect(signer).approve(
    CONTRACT_ADDRESS,
    funds
  );

  addToast("Waiting for pulling approval", {
    autoDismiss: true,
  });
  const pullFundsApprovalReceipt = await pullFundsApproval.wait();
  return pullFundsApprovalReceipt.status === 1;
};

export const requestConnectWallet = createAsyncThunk(
  "connect-wallet",
  async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];
      const chainId = await ethereum.request({ method: "eth_chainId" });
      const network = await ethereum.request({ method: "net_version" });
      const signatureChallenge = await getSignatureChallenge(
        walletAddress,
        network,
        chainId[2]
      );
      const params = [(signatureChallenge as any).data.message, walletAddress];
      const sign = await ethereum.request({
        method: "personal_sign",
        params: params,
      });
      const verifyData = {
        message: (signatureChallenge as any).data.message,
        signature: sign,
      };
      const signatureVerified = await verifySignature(
        JSON.stringify(verifyData)
      );
      localStorage.setItem("token", signatureVerified.data as string);
      await createAccount(accounts[0], signatureVerified.data);
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
      await switchNetwork();
      const accountInfo = await contract.view_sub_info(walletID);
      return {
        balance: Number(accountInfo.balance._hex) as any,
        locked_balance: Number(accountInfo.lockedBalance._hex) as any
      };
    } catch (e) {
      return {
        balance: 0,
        locked_balance: 0
      };
    }
  }
);

export const fundWallet = createAsyncThunk(
  "fund-wallet",
  async (props: any) => {
    const { amountToFund, addToast } = props;
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
      const account = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const deposit = ethers.utils.parseEther(amountToFund);
      const isApprovedToPull = await approvePulling(
        signer,
        deposit,
        provider,
        account[0],
        addToast
      );
      if (isApprovedToPull) {
        let tx = null;
        tx = await contract.deposit(deposit);
        addToast("Waiting for funding approval", {
          autoDismiss: true,
        });
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          addToast("Balance Updated", {
            appearance: "success",
            autoDismiss: true,
          });
          const accountInfo = await contract.view_sub_info(account[0]);
          return {
            balance: Number(accountInfo.balance._hex) as any,
          };
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      addToast("We couldn't update your balance", {
        appearance: "error",
        autoDismiss: true,
      });
      throw new Error();
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
      state.locked_balance = action.payload?.locked_balance;
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
