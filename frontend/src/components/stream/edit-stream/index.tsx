import { useEffect } from "react";
import { IStreamVOD, ILiveStream } from "components/stream/definitions";
import StreamVOD from "components/stream/stream-forms/VOD";
import LiveStream from "components/stream/stream-forms/live-stream";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import {
  estimateCost,
  finishTransaction,
} from "store/slices/transaction.slice";
import FileCopyIcon from "assets/icons/FileCopy";
import { editStream } from "store/slices/stream.slice";
import { useToasts } from "react-toast-notifications";
import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";
type Props = {
  selectedStream: IStreamVOD | ILiveStream;
  setFullSide: Function;
  close: Function;
};
const EditStream: React.FC<Props> = ({
  selectedStream,
  setFullSide,
  close,
}) => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const { addToast } = useToasts();
  useEffect(() => {
    setFullSide(true);
  }, []);
  const handleSave = (values: any) => {
    dispatch(editStream({ ...values }));
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
            close={close}
            isLoading={false}
          />
        );
      case "live-stream":
        return (
          <LiveStream
            handleSave={handleSave}
            selectedStream={selectedStream as ILiveStream}
            isNewStream={false}
            handleEstimateCost={handleEstimateCost}
            close={close}
            isLoading={false}
          />
        );
      default:
        <></>;
    }
  };
  const renderDetail = (title: string, hasCopy: boolean, value: any) => {
    return (
      <div className="my-2 flex flex-row">
        <h5 className="font-montserratbold mr-2 text-[14px]">{title}</h5>
        {hasCopy ? (
          <span
            className="font-montserratlight text-[13px] flex flex-row items-center hover:bg-[#f7f9fa] hover:cursor-pointer"
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
          <span className="font-montserratlight text-[13px]">{value} </span>
        )}
      </div>
    );
  };
  return (
    <div className="px-[5rem] pt-[20px] pb-[5rem]">
      <div className="flex flex-col">
        <div className="flex flex-row flex-wrap justify-evenly items-baseline pt-[20px]">
          {renderStreamForm()}
        </div>
        <div className=" mt-[40px]">
          <h3 className="font-montserratbold">Details</h3>
          <div className="flex flex-col justify-between border-t-third border mt-1 border-l-0 border-r-0 border-b-0">
            {renderDetail("Stream ID", true, selectedStream.id)}
            {renderDetail(
              "Stream Key",
              true,
              (selectedStream as any).streamKey
            )}
            {renderDetail(
              "RTMP ingest URL",
              true,
              (selectedStream as any).rtmpIngestUrl
            )}
            {renderDetail("Playback ID", true, selectedStream.playbackId)}
            {renderDetail("Playback URL", true, selectedStream.playbackUrl)}
            {renderDetail(
              "Created at",
              false,
              new Date(selectedStream.createdAt).toLocaleString()
            )}
            {renderDetail("Status", false, selectedStream.status)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStream;
