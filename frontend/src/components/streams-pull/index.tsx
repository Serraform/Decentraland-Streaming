/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useReducer, useCallback, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { columnsDefinition } from "components/streams-pull/definitions/columns";
import { IStream } from "components/stream/definitions";
import { updateStreams } from "store/slices/stream.slice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { RootState } from "store/configStore";
import StreamTable from "components/streams-pull/stream-table";
import { useFetchAllEndedStreamsQuery } from "store/api/streams.api";
import { useNavigate } from "react-router-dom";
import ReviewVaults from "components/streams-pull/review-vaults";
import { useToasts } from "react-toast-notifications";
import { withdrawToTreasury } from "store/slices/transaction.slice";
import { ethers } from "ethers";
const StreamsPull = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const { addToast } = useToasts();

  const { loading: loadingTransaction, receipt } = useSelector(
    (state: RootState) => state.transactionData
  );
  const { walletID, role } = useSelector((state: RootState) => state.accountData);
  const navigate = useNavigate();

  useEffect(() => {
    if(role!=="admin"){
      navigate("/")
    }
  }, [role])


  const [transferFundsToTreasurySlice, setTransferFundsToTreasuryState] =
    useReducer(
      (prev: any, next: any) => {
        if (next.vaultsId.length !== next.vaultsFunds.length) {
          return { ...prev };
        }
        return { ...prev, ...next };
      },
      {
        vaultsId: [],
        vaultsFunds: [],
        openModal: false,
        vaultsName: [],
        streamIds: [],
      }
    );
  const {
    data,
    error,
    isSuccess,
    isLoading: loading,
    isFetching,
    refetch
  } = useFetchAllEndedStreamsQuery({
    skip: walletID === "",
    refetchOnMountOrArgChange: true || (receipt && receipt.status === 1),
  });

  useEffect(() => {
    if (!isFetching && isSuccess) {
      dispatch(updateStreams(data));
    }
  }, [isSuccess]);

  const columnHelper = createColumnHelper<IStream>();

  const handleSelectStream = useCallback(
    (selectedStreams: [IStream], index: number) => {
      const mappedVaults = selectedStreams.reduce((map, obj: IStream) => {
        const key = obj.vaultContractId;
        const value = ethers.utils.parseUnits(obj.cost, "6");
        map.set(key, value);
        return map;
      }, new Map());
      const mappedNameVaults = selectedStreams.reduce((map, obj: IStream) => {
        const key = obj.name;
        const value = obj.cost;
        map.set(key, value);
        return map;
      }, new Map());
      const vaultsId = Array.from(mappedVaults.keys());
      const vaultsFunds = Array.from(mappedVaults.values());
      const streamIds = selectedStreams.map((stream) => stream.streamID);
      setTransferFundsToTreasuryState({
        vaultsName: mappedNameVaults,
        vaultsId,
        vaultsFunds,
        streamIds,
        openModal: true,
      });
    },
    [dispatch, navigate]
  );

  const handleTransfering = () => {
    const { vaultsId, vaultsFunds } = transferFundsToTreasurySlice;
    dispatch(withdrawToTreasury({ vaultsId, vaultsFunds, addToast }));
  };
  const columns = useMemo(
    () => columnsDefinition(columnHelper),
    [columnHelper]
  );
  if ((loading || !data) && !error)
    return (
      <>
        <div className="container flex flex-col justify-center items-center pt-10">
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
      <ReviewVaults
        openModal={transferFundsToTreasurySlice.openModal}
        vaultsId={transferFundsToTreasurySlice.vaultsId}
        vaultsFunds={transferFundsToTreasurySlice.vaultsFunds}
        streamIds={transferFundsToTreasurySlice.streamIds}
        vaultsName={transferFundsToTreasurySlice.vaultsName}
        setState={setTransferFundsToTreasuryState}
        handleTransfering={handleTransfering}
        loading={loadingTransaction}
        receipt={receipt}
      />
      <StreamTable
        columns={columns}
        streams={
          data
            ?.map((stream: any) => ({
              ...stream,
              streamInfo: JSON.parse(stream.streamInfo),
            }))
            .filter((stream: any) => !stream.pulled)
            .sort(
              (a: any, b: any) =>
                (new Date(b.streamStartDate) as any) -
                (new Date(a.streamStartDate) as any)
            ) as any
        }
        refetch={refetch}
        handleSelectStream={handleSelectStream}
      />
    </>
  );
};

export default StreamsPull;
