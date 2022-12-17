import React from "react";
import { IStreamCreation } from "components/stream/definitions";
import StreamVOD from "components/stream/create-stream/stream-forms/VOD";
import LiveStream from "components/stream/create-stream/stream-forms/live-stream";
const StreamInfo: React.FC<IStreamCreation> = ({ streamType }) => {
  const handleSave = (values: any) => {
    const sendStreamInfo = {
      ...values,
    };
    console.log(sendStreamInfo)
  };
  const renderStreamForm = () => {
    switch (streamType) {
      case "vod":
        return <StreamVOD handleSave={handleSave} />;
      case "live-stream":
        return <LiveStream handleSave={handleSave} />;
      default:
        <></>
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
