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
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import {
  fetchFunds,
  fundWallet,
  approvePulling,
} from "store/slices/account.slice";
import { transferTreasuryToWallet } from "store/slices/transaction.slice";

import { useToasts } from "react-toast-notifications";
const Funds = () => {
  const [balanceInput, setBalanceInput] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const {
    walletID,
    loading,
    balance,
    locked_balance,
    isTokenContractApprove,
    treasuryFunds,
  } = useSelector((state: RootState) => state.accountData);
  const { addToast } = useToasts();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (walletID !== "") {
      dispatch(fetchFunds(walletID));
    }
  }, [walletID]);

  const handleTransferTreasury = (address: string, amount: any) => {
    dispatch(
      transferTreasuryToWallet({ walletAddress: address, amount, addToast })
    );
  };

  return (
    <div className={container}>
      <TransferTreasury
        openModal={openModal}
        closeModal={setOpenModal}
        handleTransferTreasury={handleTransferTreasury}
      />
      <div className={`${balanceStyle} rounded  `}>
        <div className="text-center locked-funds">
          <p className="font-montserratmedium dark:text-white">
            Available Funds
          </p>
          <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem] dark:text-white">
            {balance ? parseFloat(balance.toString()) / 10 ** 6 : 0} USDC
          </h3>
        </div>
        <a
          href="https://docs.google.com/document/d/1Dz-a3iqXRFiSoAd4owAYohmHywOJKQIx/edit"
          target="_blank"
          className="font-montserratbold tracking-[0.1rem] text-[0.8rem] text-center hidden read-more dark:text-white pr-1 pl-1"
          rel="noreferrer"
        >
          For more info on Available Funds and Locked Funds, click here.
        </a>
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
            href="https://docs.google.com/document/d/1Dz-a3iqXRFiSoAd4owAYohmHywOJKQIx/edit"
            target="_blank"
            className="font-montserratbold tracking-[0.1rem] text-[0.8rem] text-center hidden read-more dark:text-white pr-1 pl-1"
            rel="noreferrer"
          >
            For more info on Available Funds and Locked Funds, click here.
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
              Treasury funds
            </p>
            <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem] dark:text-white">
              {parseFloat(treasuryFunds.toString()) / 10 ** 6} USDC
            </h3>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="font-montserratbold tracking-[0.1rem] text-[0.8rem] text-center hidden read-more dark:text-white pr-1 pl-1"
          >
            This funds are ready to be transfer to a wallet, click here to start
            transfering.
          </button>
        </div>
      ) : (
        <></>
      )}
      {!isTokenContractApprove && (
        <div>
          <p className="font-montserratmedium mt-[24px] dark:text-white">
            In order to create a stream, our contract must be approved to
            interact with your USDC
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
            {loading ? <div className="basic" /> : <>Approve contract</>}
          </button>
        </div>
      )}
      {isTokenContractApprove && (
        <>
          <p className="font-montserratmedium mt-[24px] dark:text-white">
            In order to create a stream, you must fund your account with USDC
          </p>
          <div className={bottomFormStyle}>
            <p
              className={`${labelStyle} font-montserratbold tracking-[0.1rem] dark:text-white`}
            >
              Fund Account
            </p>
            <input
              placeholder="amount"
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
              {loading ? <div className="basic" /> : <>Send transaction</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Funds;
