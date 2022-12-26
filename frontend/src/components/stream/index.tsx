import Modal from "react-modal";
import CloseIcon from "assets/icons/Close";
import CreateStream from "components/stream/create-stream";
import EditStream from "components/stream/edit-stream";
import { useState } from "react";
import {  ILiveStream, IStreamVOD } from "components/stream/definitions";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    height:"100%",
    width:"100%",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fcfcfc",

  },
};

type Props = {
  close: Function;
  open: boolean;
  isNewStream: boolean;
  selectedStream: ILiveStream | IStreamVOD;
};

const Stream: React.FC<Props> = ({ open, close, isNewStream, selectedStream }) => {
  return (
    <>
      <Modal
        isOpen={open}
        ariaHideApp={false}
        onRequestClose={() => {
          close();
        }}
        style={{ content: { ...customStyles.content } }}
        contentLabel="Example Modal"
      >
        <div className="flex justify-end">
          <button
            onClick={() => {
              close();
            }}
          >
            <CloseIcon />
          </button>
        </div>
        {isNewStream ? (
          <CreateStream  selectedStream={selectedStream}  />
        ) : (
          <EditStream   selectedStream={selectedStream}  />
        )}
      </Modal>
    </>
  );
};

export default Stream;
