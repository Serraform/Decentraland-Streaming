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
import smartcontractABI from "utils/abi/smartcontractABI.json";
import {ethers} from 'ethers'
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const Funds = () => {
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (walletID !== "") {
    // dispatch(fetchFunds(walletID));
    }
  }, [walletID]);
  const fetchFun = async () => {
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
    debugger;
    const accountInfo = await contract.view_sub_info(walletID);
    debugger;
  }
  
  return (
    <div className={container}>
      <button onClick={() => fetchFun()}>fetch</button>
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
