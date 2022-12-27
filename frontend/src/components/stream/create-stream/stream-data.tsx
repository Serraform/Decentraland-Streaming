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
  finishTransaction,
} from "store/slices/transaction.slice";
import { uploadStream } from "store/slices/stream.slice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { useToasts } from "react-toast-notifications";
import { Player, useCreateStream } from "@livepeer/react";
const StreamInfo: React.FC<IStreamCreation> = ({
  streamType,
  selectedStream,
  close,
}) => {
  const [streamNameForLivepeer, setStreamNameLivepeer] = useState<string>("");
  const {
    mutate: createLiveStream,
    data: stream,
    status,
  } = useCreateStream(
    streamNameForLivepeer ? { name: streamNameForLivepeer } : null
  );
  const { addToast } = useToasts();

  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (stream) {
      const { createdAt, id, playbackId, playbackUrl, rtmpIngestUrl, streamKey } = stream;
      debugger;
      console.log(stream);
    }
  }, [stream]);

  useEffect(() => {
    if (streamNameForLivepeer) {
      createLiveStream?.();
    }
  }, [streamNameForLivepeer]);

  const handleSave = useCallback((values: any) => {
    if (values.type === "live-stream") {
      setStreamNameLivepeer(values.name);
    }
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
          />
        );
      case "live-stream":
        return (
          <LiveStream
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
