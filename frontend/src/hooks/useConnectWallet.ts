import { useEffect } from "react";
import { requestConnectWallet } from "store/slices/account.slice";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { RootState } from "store/configStore";
const useConnectWallet = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const { walletID, loading, error } = useSelector(
    (state: RootState) => state.accountData
  );
  useEffect(() => {
    try {
      dispatch(requestConnectWallet());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (error !== null) {
      console.log(error);
    }
  }, [error]);

  const connectWallet = () => dispatch(requestConnectWallet());
  return { walletID, loading, connectWallet };
};

export default useConnectWallet;