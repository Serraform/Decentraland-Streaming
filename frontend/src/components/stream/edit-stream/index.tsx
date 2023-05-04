/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useReducer } from "react";
import {
  IStreamVOD,
  ILiveStream,
  IRelayService,
  checkDateRangeChange,
} from "components/stream/definitions";
import StreamVOD from "components/stream/stream-forms/VOD";
import LiveStream from "components/stream/stream-forms/live-stream";

import RelayStream from "components/stream/stream-forms/relay-service";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import {
  estimateCost,
  finishTransaction,
  unLockAllFunds,
  editVault,
} from "store/slices/transaction.slice";
import { fetchFunds } from "store/slices/account.slice";
import FileCopyIcon from "assets/icons/FileCopy";
import {
  deleteStreamFromTable,
  editStreamFromTable,
} from "store/slices/stream.slice";
import {
  useEditStreamMutation,
  useDeleteStreamMutation,
} from "store/api/streams.api";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
import { useNavigate } from "react-router-dom";
import { differenceInMinutes } from "date-fns";
type Props = {
  selectedStream: IStreamVOD | ILiveStream | IRelayService;
};
const EditStream: React.FC<Props> = ({ selectedStream }) => {
  const [streamValues, setStreamValues] = useReducer(
    (prev: any, next: any) => {
      const newEvent = { ...prev, ...next };
      
      return newEvent;
    },
    {
      ...selectedStream,
    }
  );

  const {
    cost,
    receipt,
    loading: isTransactionLoading,
    transactionType,
  } = useSelector((state: RootState) => state.transactionData);
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const [
    deleteStream,
    { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess },
  ] = useDeleteStreamMutation();
  const [editStream, { isLoading: isEditLoading, isSuccess: isEditSuccess }] =
    useEditStreamMutation();

  useEffect(() => {
    if (isDeleteSuccess) {
      dispatch(deleteStreamFromTable(selectedStream.streamID));
      addToast("Stream deleted", {
        appearance: "success",
        autoDismiss: true,
      });
    }
    if (isEditSuccess) {
      dispatch(editStreamFromTable(streamValues));
      addToast("Stream edited", {
        appearance: "success",
        autoDismiss: true,
      });
    }
    dispatch(fetchFunds(walletID));
    dispatch(finishTransaction());
    navigate("/");
  }, [isDeleteSuccess, isEditSuccess]);
  const returnAsDate = (date: any) => {
    if (typeof date === "string") {
      return new Date(date);
    }
    return date;
  };

  useEffect(() => {
    if (receipt && receipt.status === 1 && transactionType === "cancel") {
      deleteStream({ streamId: selectedStream.streamInfo?.Id });
    }
    if (receipt && receipt.status === 1 && transactionType === "edit") {
      
      if(cost===0){
        editStream({
          streamValues: {
            ...streamValues,
          },
        });
      }else{
        editStream({
          streamValues: {
            ...streamValues,
            cost: "" + cost,
          },
        });
      }
    }
  }, [streamValues, receipt, cost, transactionType]);

  const isLoading = isTransactionLoading || isDeleteLoading || isEditLoading;

  const navigate = useNavigate();
  const { addToast } = useToasts();

  const handleSave = useCallback(
    (values: any) => {
      let costDifference = 0;
      let durationUntilStart = 0;
      let duration = 0;
      duration = differenceInMinutes(
        returnAsDate(values.streamEndDate),
        Date.now()
      );
      durationUntilStart = differenceInMinutes(
        returnAsDate(values.streamStartDate),
        Date.now()
      );
      switch (
        checkDateRangeChange(
          returnAsDate(selectedStream.streamStartDate),
          returnAsDate(selectedStream.streamEndDate),
          returnAsDate(values.streamStartDate),
          returnAsDate(values.streamEndDate)
        )
      ) {
        case 0:
          costDifference = streamValues.cost - cost;
          dispatch(
            editVault({
              vaultContractId: streamValues.vaultContractId,
              amountToBeUnlock: -1 * costDifference,
              addToast,
              duration,
              durationUntilStart,
            })
          );

          setStreamValues({ ...values, cost: cost });
          // The date range has been shortened
          break;
        case 1:
          costDifference = cost - streamValues.cost;
          dispatch(
            editVault({
              vaultContractId: streamValues.vaultContractId,
              amountToBeUnlock: costDifference,
              addToast,
              duration,
              durationUntilStart,
            })
          );
          setStreamValues({ ...values, cost: cost  });
          // the date range has been extended
          break;
        case -1:
          
          // the date range didn't change
          dispatch(
            editVault({
              vaultContractId: streamValues.vaultContractId,
              amountToBeUnlock: 0,
              addToast,
              duration,
              durationUntilStart,
            })
          );
          setStreamValues({  ...values  });

          break;
      }
    },
    [cost]
  );

  useEffect(() => {
    if (selectedStream.name === "") {
      navigate("/");
    }
  }, [selectedStream]);

  const handleEstimateCost = (values: any) => {
    dispatch(estimateCost(values));
    setStreamValues(values);
  };

  const handleDelete = useCallback(() => {
    dispatch(
      unLockAllFunds({
        vaultContractId: selectedStream.vaultContractId,
        addToast,
      })
    );
  }, [dispatch]);

  const renderStreamForm = () => {
    switch (selectedStream.streamType) {
      case "vod":
        return (
          <StreamVOD
            handleSave={handleSave}
            selectedStream={{
              ...(selectedStream as IStreamVOD),
            }}
            formMode={"edit"}
            handleEstimateCost={handleEstimateCost}
            isLoading={isLoading}
            cost={cost}
            handleDelete={handleDelete}
          />
        );
      case "liveStream":
        return (
          <LiveStream
            handleSave={handleSave}
            selectedStream={{
              ...(selectedStream as ILiveStream),
            }}
            formMode={"edit"}
            handleEstimateCost={handleEstimateCost}
            isLoading={isLoading}
            cost={cost}
            handleDelete={handleDelete}
          />
        );
      case "relayService":
        return (
          <RelayStream
            isLoading={isLoading}
            handleSave={handleSave}
            selectedStream={{
              ...(selectedStream as IRelayService),
            }}
            formMode={"edit"}
            handleEstimateCost={handleEstimateCost}
            cost={cost}
            handleDelete={handleDelete}
          />
        );
      default:
        <></>;
    }
  };
  const renderDetail = (title: string, hasCopy: boolean, value: any) => {
    return (
      <div className="my-2 flex flex-row">
        <h5 className="font-montserratbold mr-2 text-[14px] dark:text-white">
          {title}
        </h5>
        {hasCopy ? (
          <span
            className="font-montserratlight text-[13px] flex flex-row items-center hover:bg-[#f7f9fa] hover:cursor-pointer dark:text-white dark:hover:bg-[#1a1d1e]"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(value);
            }}
          >
            {value}{" "}
            <div className="ml-1">
              <FileCopyIcon />
            </div>
          </span>
        ) : (
          <span className="font-montserratlight text-[13px] dark:text-white">
            {value}{" "}
          </span>
        )}
      </div>
    );
  };
  return (
    <div className="container pt-[20px] pb-[5rem]">
      <div className="flex flex-col">
        <div className="flex flex-row flex-wrap justify-evenly items-baseline pt-[20px]">
          {renderStreamForm()}
        </div>
        <div className=" mt-[40px]">
          <h3 className="font-montserratbold dark:text-white">Details</h3>
          <div className="flex flex-col justify-between border-t-third border mt-1 border-l-0 border-r-0 border-b-0 dark:border-t-[#323739]">
            {renderDetail("Playback URL", true, selectedStream.playBackUrl)}
            {selectedStream.streamType === "liveStream" && (
              <>
                {renderDetail(
                  "Stream Key",
                  true,
                  selectedStream?.streamInfo?.StreamKey
                )}
                {renderDetail(
                  "RTMP ingest URL",
                  true,
                  "rtmp://rtmp.serraform.com/live"
                )}
                {renderDetail(
                  "Created at",
                  false,
                  new Date(selectedStream?.streamInfo?.CreatedAt)
                    .toLocaleString()
                    .split(",")[0]
                )}
                {renderDetail(
                  "Stream ID",
                  true,
                  selectedStream?.streamInfo?.Id
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStream;
