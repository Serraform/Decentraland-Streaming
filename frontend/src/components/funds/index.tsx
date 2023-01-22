/* eslint-disable react-hooks/exhaustive-deps */
import {
  balanceStyle,
  bottomFormStyle,
  inputStyle,
  buttonStyle,
  labelStyle,
  container,
} from "./styles";

import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
import { useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { fetchFunds, fundWallet } from "store/slices/account.slice";
import { useToasts } from "react-toast-notifications";
const Funds = () => {
  const [balanceInput, setBalanceInput] = useState("")
  const { walletID, loading, balance , isSubscribed} = useSelector(
    (state: RootState) => state.accountData
  );
  const {addToast} = useToasts();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (walletID !== "") {
      dispatch(fetchFunds(walletID));
    }
  }, [walletID]);

  return (
    <div className={container}>
      <div className={`${balanceStyle} rounded`}>
        <p className="font-montserratmedium dark:text-white">Total Balance</p>
        <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem] dark:text-white">
        {parseFloat(balance.toString()) / 1e18} USDC
        </h3>
      </div>
      <p className="font-montserratmedium mt-[24px] dark:text-white">
        In order to upload your video, you must fund your account
      </p>
      <div className={bottomFormStyle}>
        <p className={`${labelStyle} font-montserratbold tracking-[0.1rem] dark:text-white`}>
          Fund Account
        </p>
        <input
          placeholder="amount"
          onChange={(e) => setBalanceInput(e.target.value)}
          className={`text-primary ${inputStyle} rounded rounded-b-none  dark:border-primary dark:border  dark:text-white`}
        />
        <button
          onClick={(e) =>
            dispatch(
              fundWallet({
                amountToFund: balanceInput,
                addToast: addToast,
                isSubscribed: isSubscribed
              })
            )
          }
          className={`${buttonStyle} bg-primary rounded rounded-t-none flex justify-center`}
        >
           {loading ?  <div className="basic"/> :  <>Send transaction</>}
         
        </button>
      </div>
    </div>
  );
};

export default Funds;
