import React, { useState, useRef } from "react";
import { Buffer } from "buffer";
type Props = {
  video: string;
  handleChange: Function;
  values: any;
};
const Video: React.FC<Props> = ({ values, video, handleChange }) => {
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
          handleChange({
            target: { name: "video", value: "s" },
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <div className="flex flex-col w-[40%] relative">
      {video ? (
        <video
          key={localVideo}
          className="w-[40%] mb-[1rem] "
          controls
          style={{
            width: "fit-content",
            height: "100%",
          }}
        >
          <source src={video} type="video/mp4" />
        </video>
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
          className="h-[100%] bg-secondary flex justify-center items-center text-white font-montserratbold text-[30px] hover:cursor-pointer"
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
