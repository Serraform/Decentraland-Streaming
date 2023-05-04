/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState, useCallback, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { columnsDefinition } from "components/streams/definitions/columns";
import { IStream } from "components/stream/definitions";
import { selectStream, updateStreams } from "store/slices/stream.slice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { RootState } from "store/configStore";
import StreamTable from "components/streams/stream-table";
import AddIcon from "assets/icons/Add";
import { useFetchStreamsByWalletIdQuery } from "store/api/streams.api";
import { useNavigate } from "react-router-dom";
import { clearSelectStream } from "store/slices/stream.slice";

const Streams = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const navigate = useNavigate();
  const {
    data,
    error,
    isSuccess,
    isLoading: loading,
    isFetching,
  } = useFetchStreamsByWalletIdQuery(walletID, {
    skip: walletID === "",
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isFetching && isSuccess) {
      dispatch(updateStreams(data));
    }
  }, [isSuccess]);

  const [copySuccess, setCopy] = useState(false);

  const columnHelper = createColumnHelper<IStream>();

  const handleSelectStream = useCallback(
    (selectedStream: IStream, index: number) => {
      const setSelectedStream = { ...selectedStream } as any;
      const navigateTo = `/stream/${setSelectedStream.streamID}`;
      navigate(navigateTo);
      dispatch(selectStream({ setSelectedStream, index }));
    },
    [dispatch, navigate]
  );
  const columns = useMemo(
    () =>
      columnsDefinition(columnHelper, setCopy, copySuccess, handleSelectStream),
    [columnHelper, copySuccess, handleSelectStream]
  );
  const handleOpenNewStream = () => {
    dispatch(clearSelectStream());
    navigate("/stream/new");
  };

  if ((loading || !data) && !error)
    return (
      <>
        <div className="container pt-10">
          {walletID === "" && (
            <h1 className="dark:text-primary text-center font-montserratbold">
              Please connect your wallet
            </h1>
          )}
          <div className="preloader">
            {" "}
            <span></span>
            <span></span>
          </div>
        </div>
      </>
    );
  if (error)
    return (
      <div className="container pt-10">
        <h1 className="font-montserratbold text-primary text-center pt-20 pb-20 border-third border-r-0 border-t-0">
          Your session has expired, please refresh your browser to see your streams.
        </h1>
      </div>
    );
  return (
    <>
      <div className="container flex flex-row justify-between items-center pt-10">
        <h1  className="font-montserratbold tracking-[0rem] text-primary dark:text-white text-xl">Streams</h1>
        <button
          className="btn-third flex flex-row items-center !pr-0"
          onClick={() => handleOpenNewStream()}
          disabled={walletID === ""}
        >
          <AddIcon />{" "}
          <span className="dark:text-white ml-2">Add new stream</span>
        </button>
      </div>
      <StreamTable
        columns={columns}
        streams={
          data
            ?.map((stream: any) => ({
              ...stream,
              streamInfo: JSON.parse(stream.streamInfo),
            }))
            .sort(
              (a, b) =>
                (new Date(b.streamStartDate) as any) -
                (new Date(a.streamStartDate) as any)
            ) as any
        }
        handleSelectStream={handleSelectStream}
      />
    </>
  );
};

export default Streams;
