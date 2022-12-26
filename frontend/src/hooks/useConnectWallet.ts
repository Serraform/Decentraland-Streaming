import { useCallback, useEffect } from "react";
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
    if (error !== null) {
      console.log(error);
    }
  }, [error]);

  const connectWallet = useCallback(() => dispatch(requestConnectWallet()), []) as any;
  return { walletID, loading, connectWallet };
};

export default useConnectWallet;
