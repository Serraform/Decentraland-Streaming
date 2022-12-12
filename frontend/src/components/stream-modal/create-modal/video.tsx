import React, { useState, useRef } from "react";
import {Buffer} from 'buffer';
type Props = {
  video: string;
  handleChange: Function;
};
const Video: React.FC<Props> = ({ video, handleChange }) => {
  const [localVideo, setLocalVideo] = useState();
  const inputFileRef: any = useRef();

  const onFileChangeCapture = (e: any, setLocalVideo: any) => {
    onFileChange(e, setLocalVideo);
  };
  const onBtnClick = () => {
    (inputFileRef.current as any).click();
  };

  function onFileChange(e: any, setLocalVideo: any) {
    const file = e.target.files[0];
    if (!file) return;
    const fileSize = file.size;
    if (file) {
      const video = URL.createObjectURL(file);
      setLocalVideo(video);
      let reader = new FileReader();
      reader.onload = function (e) {
        if (reader.result) {
          debugger;
          console.log(Buffer.from(reader.result as any));
          handleChange({ target: { name: "videoSize", value: fileSize } });
          handleChange({
            target: { name: "video", value: Buffer.from(reader.result as any) }
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <div className="flex flex-col w-[90%] relative">
      {video ? (
        <video key={localVideo} className="w-[90%] mb-[1rem]" controls>
          <source src={video} type="video/mp4" />
        </video>
      ) : localVideo ? (
        <video key={localVideo} className="w-[90%] mb-[1rem]" controls>
          <source src={localVideo} type="video/mp4" />
        </video>
      ) : (
        <button
          onClick={onBtnClick}
          className="w-[90%] h-[400px] bg-secondary flex justify-center items-center text-white font-montserratbold text-[30px] hover:cursor-pointer"
        >
          Upload your video!
        </button>
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
