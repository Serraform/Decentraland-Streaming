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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { fetchFunds } from "store/slices/account.slice";
const Funds = () => {
  const { walletID } = useSelector((state: RootState) => state.accountData);
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
        <p className="font-montserratmedium">Total Balance</p>
        <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem]">
          0 USDT
        </h3>
      </div>
      <p className="font-montserratmedium mt-[24px]">
        In order to upload your video, you must fund your account
      </p>
      <div className={bottomFormStyle}>
        <p className={`${labelStyle} font-montserratbold tracking-[0.1rem] `}>
          Fund Account
        </p>
        <input
          placeholder="amount"
          className={`text-primary ${inputStyle} rounded rounded-b-none`}
        />
        <button className={`${buttonStyle} bg-primary rounded rounded-t-none`}>
          Send transaction
        </button>
        {/* <button className="btn-third" style={{ paddingLeft: 0}} onClick={async () => {
         const { ethereum } = window as any;
         if (!ethereum) {
           return;
         }
     
         const accounts = await ethereum.request({
           method: "eth_requestAccounts",
         });
      }}>Log out</button> */}
      </div>
    </div>
  );
};

export default Funds;
