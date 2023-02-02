/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback } from "react";
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
import { useFetchStreamDetailsQuery } from "store/api/streams.api";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
import {useNavigate}from 'react-router-dom';

type Props = {
  selectedStream: IStreamVOD | ILiveStream;
};
const EditStream: React.FC<Props> = ({
  selectedStream,
}) => {
  const { cost } = useSelector((state: RootState) => state.transactionData);
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const {
    data,
    isSuccess,
  } = useFetchStreamDetailsQuery(selectedStream.streamInfo.Id, {  pollingInterval: 6000 });
  const navigate = useNavigate();
  const { addToast } = useToasts();
  
  const handleSave = useCallback((values: any) => {
    dispatch(editStream({ ...values }));
    addToast("Stream edited", {
      appearance: "success",
      autoDismiss: true,
    });
    dispatch(finishTransaction());
  },[]);

  useEffect(() => {
    if(selectedStream.name===""){
      navigate("/");
    }
  }, [selectedStream])

  const handleEstimateCost = (values: any) => {
    dispatch(estimateCost(values));
  };

  const renderStreamForm = () => {
    switch (selectedStream.streamType.toLowerCase()) {
      case "vod":
        return (
          <StreamVOD
            handleSave={handleSave}
            selectedStream={selectedStream as IStreamVOD}
            isNewStream={false}
            handleEstimateCost={handleEstimateCost}
            isLoading={false}
          />
        );
      case "live-stream":
        return (
          <LiveStream
            handleSave={handleSave}
            selectedStream={{
              ...(selectedStream as ILiveStream),
              streamInfo: {
                ...selectedStream?.streamInfo,
                playbackUrl: `https://livepeercdn.studio/hls/${selectedStream?.streamInfo.PlayBackId}/index.m3u8`,
                IsActive: isSuccess ? JSON.parse((data as any).streamInfo).IsActive :  (selectedStream?.streamInfo).IsActive,
              },
            }}
            isNewStream={false}
            handleEstimateCost={handleEstimateCost}
            isLoading={false}
            cost={cost}
          />
        );
      default:
        <></>;
    }
  };
  const renderDetail = (title: string, hasCopy: boolean, value: any) => {
    return (
      <div className="my-2 flex flex-row">
        <h5 className="font-montserratbold mr-2 text-[14px] dark:text-white">{title}</h5>
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
          <span className="font-montserratlight text-[13px] dark:text-white">{value} </span>
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
            {renderDetail("Stream ID", true, (selectedStream?.streamInfo).Id)}
            {renderDetail(
              "Stream Key",
              true,
              (selectedStream?.streamInfo).StreamKey
            )}
            {renderDetail(
              "RTMP ingest URL",
              true,
              "rtmp://rtmp.serraform.com/live"
            )}
            {renderDetail(
              "Playback ID",
              true,
              (selectedStream?.streamInfo).PlayBackId
            )}
            {renderDetail(
              "Playback URL",
              true,
              `https://livepeercdn.studio/hls/${selectedStream?.streamInfo.PlayBackId}/index.m3u8`
            )}
            {renderDetail(
              "Created at",
              false,
              new Date((selectedStream?.streamInfo).CreatedAt).toLocaleString()
            )}
            {renderDetail(
              "Status",
              false,
              isSuccess && JSON.parse((data as any).streamInfo).IsActive  ? "Live" : "Idle"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStream;
