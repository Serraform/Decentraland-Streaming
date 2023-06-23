/* eslint-disable react-hooks/exhaustive-deps */
import {
  balanceStyle,
  bottomFormStyle,
  inputStyle,
  buttonStyle,
  labelStyle,
  container,
} from "./styles";
import TransferTreasury from "components/funds/transfer-treasury";
import TransferAvailableFunds from "components/funds/transfer-available-funds";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
import {  useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import {
  fundWallet,
  approvePulling,
} from "store/slices/account.slice";
import { transferTreasuryToWallet, transferAvailableFundsToWallet } from "store/slices/transaction.slice";

import { useToasts } from "react-toast-notifications";
const Funds = () => {
  const [balanceInput, setBalanceInput] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openAvailableFundsModal, setOpenAvailableFundsModal] = useState(false);
  const {
    loading,
    balance,
    locked_balance,
    isPremium,
    discount,
    isTokenContractApprove,
    treasuryFunds,
  } = useSelector((state: RootState) => state.accountData);
  const { addToast } = useToasts();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  

  const handleTransferTreasury = (address: string, amount: any) => {
    dispatch(
      transferTreasuryToWallet({ walletAddress: address, amount, addToast })
    );
  };

  const handleTransferAvailableFunds = (amount: any) => {
    dispatch(
      transferAvailableFundsToWallet({ amount, addToast })
    );
  };


  return (
    <div className={container}>
      <TransferTreasury
        openModal={openModal}
        closeModal={setOpenModal}
        handleTransferTreasury={handleTransferTreasury}
      />
      <TransferAvailableFunds 
       openModal={openAvailableFundsModal}
       closeModal={setOpenAvailableFundsModal}
       handleTransferAvailableFunds={handleTransferAvailableFunds}
      />
      {isPremium && (
        <span className="flex flex-row justify-between items-center pb-[20px] text-[#fdba74]">
          You have a premium account with a {discount}% discount on all stream types.
        </span>
      )}
      <div className={`${balanceStyle} rounded  `}>
        <div className="text-center locked-funds">
          <p className="font-montserratmedium dark:text-white">
            Available Funds
          </p>
          <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem] dark:text-white">
            {balance ? parseFloat(balance.toString()) / 10 ** 6 : 0} USDC
          </h3>
        </div>
        <button
            onClick={() => setOpenAvailableFundsModal(true)}
            className="font-montserratbold tracking-[0.1rem] text-[0.8rem] text-center hidden read-more dark:text-white pr-1 pl-1"
          >
            Click here to withdraw available funds back to your wallet.
          </button>
      </div>

      {locked_balance && locked_balance !== 0 ? (
        <div
          className={`${balanceStyle} rounded mt-5 bg-slate-100 dark:bg-[#151719]`}
        >
          <div className="text-center locked-funds">
            <p className="font-montserratmedium dark:text-white">
              Locked Funds
            </p>
            <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem] dark:text-white">
              {parseFloat(locked_balance.toString()) / 10 ** 6} USDC
            </h3>
          </div>
          <a
            href="https://serraform.gitbook.io/streaming-docs/guides/deposit-withdraw-funds#available-funds"
            target="_blank"
            className="font-montserratbold tracking-[0.1rem] text-[0.8rem] text-center hidden read-more dark:text-white pr-1 pl-1"
            rel="noreferrer"
          >
            Click here for more info on available and locked funds.
          </a>
        </div>
      ) : (
        <></>
      )}
      {treasuryFunds && treasuryFunds !== 0 ? (
        <div
          className={`${balanceStyle} rounded mt-5 bg-slate-100 dark:bg-[#151719]`}
        >
          <div className="text-center locked-funds">
            <p className="font-montserratmedium dark:text-white">
              Treasury Funds
            </p>
            <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem] dark:text-white">
              {parseFloat(treasuryFunds.toString()) / 10 ** 6} USDC
            </h3>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="font-montserratbold tracking-[0.1rem] text-[0.8rem] text-center hidden read-more dark:text-white pr-1 pl-1"
          >
            Click here to withdraw treasury funds to a wallet.
          </button>
        </div>
      ) : (
        <></>
      )}
      {!isTokenContractApprove && (
        <div>
          <p className="font-montserratmedium mt-[24px] dark:text-white">
            In order to create a stream the payment contract must be approved to
            interact with your USDC.
          </p>{" "}
          <button
            onClick={(e) =>
              dispatch(
                approvePulling({
                  addToast: addToast,
                })
              )
            }
            className={`${buttonStyle} bg-primary rounded flex justify-center dark:hover:bg-transparent dark:border-primary dark:border mt-[24px]`}
          >
            {loading ? <div className="basic" /> : <>Approve Contract</>}
          </button>
        </div>
      )}
      {isTokenContractApprove && (
        <>
          <p className="font-montserratmedium mt-[24px] dark:text-white">
            {!balance
              ? "In order to create a stream you must fund your account with USDC"
              : ""}
          </p>
          <div className={bottomFormStyle}>
            <p
              className={`${labelStyle} font-montserratbold tracking-[0.1rem] dark:text-white`}
            >
              Deposit Funds to Account
            </p>
            <input
              placeholder="amount to deposit"
              onChange={(e) => setBalanceInput(e.target.value)}
              className={`text-primary ${inputStyle} rounded rounded-b-none  dark:border-primary dark:border  dark:text-white `}
            />
            <button
              onClick={(e) =>
                dispatch(
                  fundWallet({
                    amountToFund: balanceInput,
                    addToast: addToast,
                  })
                )
              }
              className={`${buttonStyle} bg-primary rounded rounded-t-none flex justify-center dark:hover:bg-transparent dark:border-primary dark:border`}
            >
              {loading ? <div className="basic" /> : <>Deposit Funds</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Funds;
