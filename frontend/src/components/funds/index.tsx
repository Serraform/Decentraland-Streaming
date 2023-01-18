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
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { fetchFunds, fundWallet } from "store/slices/account.slice";
import { useToasts } from "react-toast-notifications";
const Funds = () => {
  const [balanceInput, setBalanceInput] = useState("");
  const { walletID, loading, balance, isSubscribed, locked_balance } =
    useSelector((state: RootState) => state.accountData);
  const { addToast } = useToasts();
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
        <p className="font-montserratmedium">Funds</p>
        <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem]">
          {balance ? parseFloat(balance.toString()) / 1e18 : 0} USDC
        </h3>
      </div>
      {locked_balance && locked_balance !== 0 && (
        <div className={`${balanceStyle} rounded mt-5 bg-slate-100`}>
          <div className="text-center locked-funds">
            <p className="font-montserratmedium">Locked Funds</p>
            <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem]">
              {parseFloat(locked_balance.toString()) / 1e18} USDC
            </h3>
          </div>
          <p className="font-montserratbold tracking-[0.1rem] text-[1rem] text-center hidden read-more">
            To read more about locked funds, click here
          </p>
        </div>
      )}
      <p className="font-montserratmedium mt-[24px]">
        In order to upload your video, you must fund your account
      </p>
      <div className={bottomFormStyle}>
        <p className={`${labelStyle} font-montserratbold tracking-[0.1rem] `}>
          Fund Account
        </p>
        <input
          placeholder="amount"
          onChange={(e) => setBalanceInput(e.target.value)}
          className={`text-primary ${inputStyle} rounded rounded-b-none`}
        />
        <button
          onClick={(e) =>
            dispatch(
              fundWallet({
                amountToFund: balanceInput,
                addToast: addToast,
                isSubscribed: isSubscribed,
              })
            )
          }
          className={`${buttonStyle} bg-primary rounded rounded-t-none flex justify-center`}
        >
          {loading ? <div className="basic" /> : <>Send transaction</>}
        </button>
      </div>
    </div>
  );
};

export default Funds;
