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
import { fetchFunds, fundWallet, approvePulling } from "store/slices/account.slice";
import { useToasts } from "react-toast-notifications";
const Funds = () => {
  const [balanceInput, setBalanceInput] = useState("");
  const { walletID, loading, balance, locked_balance, isTokenContractApprove } =
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
        <p className="font-montserratmedium dark:text-white">Funds</p>
        <h3 className="font-montserratbold tracking-[0.1rem] text-[1.5rem] dark:text-white">
          {balance ? parseFloat(balance.toString()) / 10 ** 6 : 0} USDC
        </h3>
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
          <p className="font-montserratbold tracking-[0.1rem] text-[1rem] text-center hidden read-more dark:text-white">
            To read more about locked funds, click here
          </p>
        </div>
      ) : (
        <></>
      )}

      {!isTokenContractApprove && (
        <div>
          <p className="font-montserratmedium mt-[24px] dark:text-white">
          In order to create a stream, our contract must be approved to interact with your USDC
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
            {loading ? (
              <div className="basic" />
            ) : (
              <>Approve contract</>
            )}
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
      </>)}

    </div>
  );
};

export default Funds;
