import { useMemo, useState, useCallback } from "react";
import {
  createColumnHelper,
} from "@tanstack/react-table";
import { columnsDefinition } from "components/streams/definitions/columns";
import { IStream } from "components/stream/definitions";
import { selectStream } from "store/slices/stream.slice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { RootState } from "store/configStore";
import StreamTable from "components/streams/stream-table";

import { useFetchStreamsByWalletIdQuery } from "store/api/streams.api";

const Streams = () => {
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const {
    data: streams,
    error,
    isLoading: loading,
  } = useFetchStreamsByWalletIdQuery(walletID, { skip: walletID === "" });
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const [copySuccess, setCopy] = useState(false);

  const columnHelper = createColumnHelper<IStream>();

  const handleSelectStream = useCallback(
    (selectedStream: IStream, index: number) => {
      const setSelectedStream = { ...selectedStream } as any;
      dispatch(selectStream({ setSelectedStream, index }));
    },
    [dispatch]
  );
  const columns = useMemo(
    () =>
      columnsDefinition(columnHelper, setCopy, copySuccess, handleSelectStream),
    [columnHelper, copySuccess, handleSelectStream]
  );
  if (loading)
    return (
      <div className="container pt-10">
        <div className="preloader">
          {" "}
          <span></span>
          <span></span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="container pt-10">
        <h1 className="font-montserratbold text-primary text-center pt-20 pb-20 border-third border-r-0 border-t-0">
          It seems to be an issue loading your streams <br />
          Please try later
        </h1>
      </div>
    );
  if (!streams) return <></>;
  return <StreamTable columns={columns} streams={streams as any} />;
};

export default Streams;
