import React, { useState, useRef } from "react";
import { Buffer } from "buffer";
import ReactPlayer from "react-player";
import { useFetchStreamDetailsQuery } from "store/api/streams.api";
type Props = {
  video: string;
  handleChange: Function;
  values: any;
  suspended: boolean;
};
const Video: React.FC<Props> = ({ values, video, handleChange }) => {
  const { data } = useFetchStreamDetailsQuery(values.streamInfo.Id, {
    pollingInterval: 6000,
  });
  const [localVideo, setLocalVideo] = useState();
  const inputFileRef: any = useRef();

  const onFileChangeCapture = (e: any, setLocalVideo: any) => {
    onFileChange(e, setLocalVideo);
  };
  const onBtnClick = () => {
    (inputFileRef.current as any).click();
  };
  const getVideoDuraion = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const media = new Audio((reader as any).result);
        media.onloadedmetadata = () => resolve(media.duration);
      };
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
    });
  async function onFileChange(e: any, setLocalVideo: any) {
    const file = e.target.files[0];
    if (!file) return;
    const fileSize = file.size;
    const fileLength = await getVideoDuraion(file);

    if (file) {
      const video = URL.createObjectURL(file);
      setLocalVideo(video);
      let reader = new FileReader();
      reader.onload = function (e) {
        if (reader.result) {
          console.log(Buffer.from(reader.result as any));
          handleChange({ target: { name: "videoSize", value: fileSize } });
          handleChange({ target: { name: "videoLength", value: fileLength } });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }
  const renderStatus = () => {
    switch ((data as any)?.streamStatus) {
      case "Upcoming":
        return (
          <div className="flex justify-center flex-row items-center absolute bullet-status top-0">
            <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-sky-400" />
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
            <div className=" w-3 h-3 mr-[0.5rem] rounded-full bg-red-600" />
            <span className="text-[14px]">Suspended</span>
          </div>
        );
    }
   
  };
  return (
    <div className="flex flex-col w-[48%] relative h-full pr-[2rem]">
      {video ? (
        <div className="relative w-full h-full">
          <ReactPlayer
            url={video}
            muted={true}
            playing={true}
            width="auto"
            height="100%"
            light={!(data as any)?.streamInfo.isActive}
          ></ReactPlayer>
          {renderStatus()}
        </div>
      ) : localVideo ? (
        <video
          key={localVideo}
          className="w-[40%] mb-[1rem]"
          controls
          style={{
            width: "fit-content",
            height: "100%",
          }}
        >
          <source src={localVideo} type="video/mp4" />
        </video>
      ) : (
        <button
          onClick={onBtnClick}
          className="h-[100%] rounded bg-secondary dark:bg-slate-600 flex justify-center items-center text-white font-montserratbold text-[30px] hover:cursor-pointer "
        >
          Upload your video!
        </button>
      )}
      {values.videoLength && (
        <p className="text-primary font-montserratbold">
          Video lenght: {Math.floor((values.videoLength % 3600) / 60)} minutes
        </p>
      )}
      <input
        type="file"
        ref={inputFileRef}
        onChangeCapture={(e) => onFileChangeCapture(e, setLocalVideo)}
        style={{ visibility: "hidden" }}
        className="
        absolute"
      />
    </div>
  );
};

export default Video;
