import React from "react";
import {
  IStreamCreation,
  ILiveStream,
  IStreamVOD,
} from "components/stream/definitions";
import StreamVOD from "components/stream/stream-forms/VOD";
import LiveStream from "components/stream/stream-forms/live-stream";
import { estimateCost, finishTransaction } from "store/slices/transaction.slice";
import { uploadStream } from "store/slices/stream.slice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
const StreamInfo: React.FC<IStreamCreation> = ({
  streamType,
  selectedStream,
}) => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const handleSave = (values: any) => {
    dispatch(uploadStream({...values, type: streamType}));
    dispatch(finishTransaction());
  };
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
          />
        );
      case "live-stream":
        return (
          <LiveStream
            handleSave={handleSave}
            selectedStream={selectedStream as ILiveStream}
            isNewStream={true}
            handleEstimateCost={handleEstimateCost}
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
