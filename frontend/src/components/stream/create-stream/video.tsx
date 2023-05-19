import React from "react";
import ReactPlayer from "react-player";
import { useFetchStreamDetailsQuery } from "store/api/streams.api";
type Props = {
  video: string;
  handleChange: Function;
  values: any;
  suspended: boolean;
};
const Video: React.FC<Props> = ({ values, video }) => {
  const { data } = useFetchStreamDetailsQuery(values.streamID, {
    pollingInterval: 6000,
  });

  const renderStatus = () => {
    if((data as any)?.streamStatus === "Idle" && (data as any)?.streamType ==="vod"){
      return (
        <div className="flex justify-center flex-row items-center absolute bullet-status top-0">
          <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-green-600" />
          <span className="text-[14px]">Ready</span>
        </div>
      );
    }
    switch ((data as any)?.streamStatus) {
      case "Upcoming":
        return (
          <div className="flex justify-center flex-row items-center absolute bullet-status top-0">
            <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-purple-400" />
            <span className="text-[14px]">Upcoming</span>
          </div>
        );
      case "Idle":
        return (
          <div className="flex justify-center flex-row items-center absolute bullet-status top-0">
            <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-gray-600" />
            <span className="text-[14px]">Idle</span>
          </div>
        );
      case "Live":
        return (
          <div className="flex justify-center flex-row items-center absolute bullet-status top-0">
            <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-green-600" />
            <span className="text-[14px]">Live</span>
          </div>
        );
      case "Suspended":
        return (
          <div className="flex justify-center flex-row items-center absolute bullet-status top-0">
            <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-sky-600" />
            <span className="text-[14px]">Done</span>
          </div>
        );
    }
   
  };
  return (
    <div className="flex flex-col w-[48%] relative pr-[2rem]" style={{
      aspectRatio: "9/6"
    }}>
        <div className="relative w-full h-full">
          <ReactPlayer
            url={video}
            muted={true}
            controls={true}
            playing={true}
            width="auto"
            height="100%"
          ></ReactPlayer>
          {renderStatus()}
        </div>
    
      
    </div>
  );
};

export default Video;
