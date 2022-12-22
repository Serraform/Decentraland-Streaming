import React from "react";
import { IStreamVOD, ILiveStream } from "components/stream/definitions";
import StreamVOD from "components/stream/stream-forms/VOD";
import LiveStream from "components/stream/stream-forms/live-stream";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { estimateCost,finishTransaction } from "store/slices/transaction.slice";

import { editStream } from "store/slices/stream.slice";
import { useToasts } from "react-toast-notifications";
type Props = {
  selectedStream: IStreamVOD | ILiveStream;
  isNewStream: boolean;
};
const EditStream: React.FC<Props> = ({ selectedStream, isNewStream }) => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const { addToast } = useToasts();

  const handleSave = (values: any) => {
    dispatch(editStream({...values}));
    addToast("Stream edited", {
      appearance: "success",
      autoDismiss: true,
    });
    dispatch(finishTransaction());
  };
  const handleEstimateCost = (values: any) => {
    dispatch(estimateCost(values));
  };
  const renderStreamForm = () => {
    switch (selectedStream.type.toLowerCase()) {
      case "vod":
        return (
          <StreamVOD
            handleSave={handleSave}
            selectedStream={selectedStream as IStreamVOD}
            isNewStream={false}
            handleEstimateCost={handleEstimateCost}
          />
        );
      case "live-stream":
        return (
          <LiveStream
            handleSave={handleSave}
            selectedStream={selectedStream as ILiveStream}
            isNewStream={false}
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

export default EditStream;
