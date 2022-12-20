import React from "react";
import { IStream, IStreamVOD, ILiveStream } from "components/stream/definitions";
import StreamVOD from "components/stream/stream-forms/VOD";
import LiveStream from "components/stream/stream-forms/live-stream";
type Props = {
  selectedStream: IStreamVOD | ILiveStream;
  isNewStream: boolean;
};
const EditStream: React.FC<Props> = ({ selectedStream, isNewStream }) => {
  const handleSave = (values: any) => {
    const sendStreamInfo = {
      ...values,
    };
    console.log(sendStreamInfo);
  };
  const renderStreamForm = () => {
    switch (selectedStream.type.toLowerCase()) {
      case "vod":
        return <StreamVOD handleSave={handleSave} selectedStream={selectedStream as IStreamVOD} isNewStream={isNewStream} />;
      case "live-stream":
        return <LiveStream handleSave={handleSave} selectedStream={selectedStream as ILiveStream} isNewStream={isNewStream}  />;
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
