import React, { useEffect, useState, useCallback } from "react";
import {
  IStreamCreation,
  ILiveStream,
  IStreamVOD,
} from "components/stream/definitions";
import StreamVOD from "components/stream/stream-forms/VOD";
import LiveStream from "components/stream/stream-forms/live-stream";
import {
  estimateCost,
} from "store/slices/transaction.slice";
import { uploadStream } from "store/slices/stream.slice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { useToasts } from "react-toast-notifications";
import  useUploadStream  from "hooks/useCreateStream";
const StreamInfo: React.FC<IStreamCreation> = ({
  streamType,
  selectedStream,
  close,
}) => {
  const [streamNameForLivepeer, setStreamNameLivepeer] = useState<string>("");
  const [streamValues, setStreamValues] = useState<ILiveStream | IStreamVOD>();
  
  const { stream, isLoading } = useUploadStream(streamNameForLivepeer, null);
  const { addToast } = useToasts();

  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (stream) {
      const {
        createdAt,
        id,
        playbackId,
        playbackUrl,
        rtmpIngestUrl,
        streamKey,
      } = stream;
      console.log(stream);
      const newStream = {
        ...streamValues,
        status: stream.isActive,
        createdAt,
        id,
        playbackId,
        playbackUrl,
        rtmpIngestUrl,
        streamKey,
      }
      dispatch(uploadStream(newStream));
      addToast("Stream created", {
        appearance: "success",
        autoDismiss: true,
      });
    }
  }, [stream, streamValues]);

  const handleSave = useCallback((values: any) => {
    if (values.type === "live-stream") {
      setStreamNameLivepeer(values.name);
    }
    setStreamValues(values);
  }, []);
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
          isLoading={isLoading}
            handleSave={handleSave}
            selectedStream={selectedStream as ILiveStream}
            isNewStream={true}
            handleEstimateCost={handleEstimateCost}
            close={close}
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
