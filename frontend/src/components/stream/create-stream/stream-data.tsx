/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useReducer } from "react";
import {
  IStreamCreation,
  ILiveStream,
  IStreamVOD,
  deepEqual,
} from "components/stream/definitions";
import StreamVOD from "components/stream/stream-forms/VOD";
import LiveStream from "components/stream/stream-forms/live-stream";
import {
  estimateCost,
  finishTransaction,
  lockFunds,
} from "store/slices/transaction.slice";
import { uploadStream } from "store/slices/stream.slice";
import { fetchFunds } from "store/slices/account.slice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { useToasts } from "react-toast-notifications";
import { RootState } from "store/configStore";
import { useCreateLiveStreamMutation } from "store/api/streams.api";
import { differenceInMinutes } from "date-fns";

import { useNavigate } from "react-router-dom";
const StreamInfo: React.FC<IStreamCreation> = ({
  streamType,
  selectedStream,
}) => {
  const [streamValues, setStreamValues] = useReducer(
    (prev: any, next: any) => {
      const newEvent = { ...prev, ...next, streamType };
      return newEvent;
    },
    {
      streamType: streamType,
      name: "",
      status: false,
      attendees: "",
      streamStartDate: Date.now(),
      streamEndDate: Date.now(),
    }
  );

  const {
    cost,
    loading: isTransactionLoading,
    receipt,
    vaultContractId,
    transactionType
  } = useSelector((state: RootState) => state.transactionData);
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const [createLiveStream, { isLoading, isSuccess }] =
    useCreateLiveStreamMutation();
  const { addToast } = useToasts();

  const navigate = useNavigate();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSuccess) {
      const newStream = {
        ...streamValues,
        cost: ""+cost,
        vaultContractId: ""+vaultContractId,
        streamInfo: JSON.stringify({
          Name: streamValues?.name,
          CreatedAt: 0,
          Id: "",
          IsActive: false,
          PlayBackId: "",
          Profiles: [],
          Record: false,
          StreamKey: "",
          Suspended: false,
          playbackUrl: "",
          rtmpIngestUrl: "",
        }),
      };
      dispatch(uploadStream(newStream));
      addToast("Stream successfully scheduled", {
        appearance: "success",
        autoDismiss: true,
      });
      dispatch(finishTransaction());
      dispatch(fetchFunds(walletID));
      navigate("/");
    }
  }, [streamValues, isSuccess]);

  useEffect(() => {
    if (receipt && receipt.status === 1 && transactionType === "lock") {
      createLiveStream({ walletID: walletID, streamValues: {...streamValues, cost, vaultContractId} });
    }
  }, [receipt, cost, transactionType]);

  const handleSave = useCallback(
    (values: any) => {
      if (!deepEqual(values, streamValues)) {
        dispatch(finishTransaction());
        addToast("You have updated your inputs, please recalculate cost", {
          appearance: "warning",
          autoDismiss: true,
        });
      } else {
        const duration = differenceInMinutes(values.streamEndDate, Date.now());
        const durationUntilStart = differenceInMinutes(values.streamStartDate, Date.now());
        if (values.streamType === "live-stream") {
          dispatch(
            lockFunds({
              addToast,
              duration: duration,
              durationUntilStart:durationUntilStart,
              amountToBeLock: cost,
              vaultContractId: vaultContractId
            })
          );
        }
        setStreamValues(values);
      }
    },
    [cost]
  );

  const handleEstimateCost = (values: any) => {
    setStreamValues(values);
    dispatch(estimateCost(values));
  };
  const renderStreamForm = () => {
    switch (streamType) {
      case "vod":
        return (
          <StreamVOD
            handleSave={handleSave}
            selectedStream={selectedStream as IStreamVOD}
            formMode={"create"}
            handleEstimateCost={handleEstimateCost}
            isLoading={isLoading}
            handleDelete={() => null}
          />
        );
      case "live-stream":
        return (
          <LiveStream
            isLoading={isLoading || isTransactionLoading}
            handleSave={handleSave}
            selectedStream={selectedStream as ILiveStream}
            formMode={"create"}
            handleEstimateCost={handleEstimateCost}
            cost={cost}
            handleDelete={() => null}
          />
        );
      default:
        <></>;
    }
  };
  return (
    <div className="px-[5rem] pt-[20px] pb-[5rem]">
      <div className="flex flex-row flex-wrap justify-evenly items-baseline pt-[20px]">
        {renderStreamForm()}
      </div>
    </div>
  );
};

export default StreamInfo;
