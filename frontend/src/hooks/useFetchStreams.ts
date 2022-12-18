import { useEffect } from "react";
import { fetchStreams } from "store/slices/stream.slice";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { RootState } from "store/configStore";
const useFetchStreams = () => {
    const useAppDispatch = () => useDispatch<AppDispatch>();
    const dispatch = useAppDispatch();
    const { streams, loading, error } = useSelector(
      (state: RootState) => state.streamData
    );
    const { walletID } = useSelector((state: RootState) => state.accountData);
    useEffect(() => {
      dispatch(fetchStreams(walletID));
    }, [walletID, dispatch]);
  return { streams, loading, error };
};

export default useFetchStreams;
