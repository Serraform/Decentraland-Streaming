/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import {
  IStreamCreation,
  ILiveStream,
  IStreamVOD,
} from "components/stream/definitions";
import StreamVOD from "components/stream/stream-forms/VOD";
import LiveStream from "components/stream/stream-forms/live-stream";
import { estimateCost, lockFunds } from "store/slices/transaction.slice";
import { uploadStream } from "store/slices/stream.slice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { useToasts } from "react-toast-notifications";
import { RootState } from "store/configStore";
import { useCreateLiveStreamMutation } from "store/api/streams.api";
import { differenceInHours } from 'date-fns'

const StreamInfo: React.FC<IStreamCreation> = ({
  streamType,
  selectedStream,
  close,
}) => {
  const [streamValues, setStreamValues] = useState<ILiveStream | IStreamVOD>();
  const { cost, loading: isTransactionLoading, receipt } = useSelector(
    (state: RootState) => state.transactionData
  );
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const [createLiveStream, { isLoading, isSuccess }] =
    useCreateLiveStreamMutation();
  const { addToast } = useToasts();

  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isSuccess) {
      const newStream = {
        ...streamValues,
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
      addToast("Stream created", {
        appearance: "success",
        autoDismiss: true,
      });
    }
  }, [streamValues, isSuccess]);

  useEffect(() => {
    if(receipt&& receipt.status === 1){
      createLiveStream({ walletID: walletID, streamValues: streamValues });
    }
  }, [receipt])

  const handleSave = useCallback((values: any) => {
    const duration = differenceInHours(values.streamEndDate, Date.now())
    if (values.streamType === "live-stream") {
      dispatch(
        lockFunds({
          addToast,
          duration: duration,
          amountToBeLock: cost,
        })
      );
    }
    setStreamValues(values);
  }, [cost]);
  const handleEstimateCost = (values: any) => {
    dispatch(estimateCost(values));
  };
  const renderStreamForm = () => {
    switch (streamType) {
      case "vod":
        return (
          <StreamVOD
            handleSave={handleSave}
            selectedStream={selectedStream as IStreamVOD}
            isNewStream={true}
            handleEstimateCost={handleEstimateCost}
            close={close}
            isLoading={isLoading}
          />
        );
      case "live-stream":
        return (
          <LiveStream
            isLoading={isLoading || isTransactionLoading}
            handleSave={handleSave}
            selectedStream={selectedStream as ILiveStream}
            isNewStream={true}
            handleEstimateCost={handleEstimateCost}
            close={close}
            cost={cost}
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
