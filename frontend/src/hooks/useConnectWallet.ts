import { useCallback, useEffect } from "react";
import {
  requestConnectWallet,
  fetchFunds,
  fetchUserRole,
  checkTokenAllowance,
  fetchTreasuryFunds,
} from "store/slices/account.slice";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { RootState } from "store/configStore";
const useConnectWallet = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const { walletID, loading, error, role } = useSelector(
    (state: RootState) => state.accountData
  );

  useEffect(() => {
    if (error !== null) {
      console.log(error);
    }
  }, [error]);

  useEffect(() => {
    const { ethereum } = window as any;
    if (ethereum) {
      ethereum.enable().then(function (accounts: any) {
        ethereum.on("accountsChanged", (accounts: any) => {
          if (accounts.length > 0) {
            window.location.reload();
          } else {
            // setWallet("");
            // setStatus("🦊 Connect to Metamask using the top right button.");
          }
        });
      });
    }
  }, [dispatch]);

  const fetchAccountData = useCallback(() => {
    if (walletID) {
      dispatch(checkTokenAllowance(walletID));
      dispatch(fetchFunds(walletID));
      dispatch(fetchUserRole(walletID));
    }
  }, [dispatch, walletID]);

  const fetchTreasuryData = useCallback(() => {
    if (walletID !== "" && role === "admin") {
      dispatch(fetchTreasuryFunds());
    }
  }, [dispatch, walletID, role]);

  const connectWallet = useCallback(
    () => dispatch(requestConnectWallet()),
    [dispatch]
  ) as any;
  return {
    walletID,
    loading,
    connectWallet,
    role,
    fetchAccountData,
    fetchTreasuryData,
  };
};

export default useConnectWallet;
