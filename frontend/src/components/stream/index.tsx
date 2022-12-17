import Modal from "react-modal";
import CloseIcon from "assets/icons/Close";
import CreateStream from "components/stream/create-stream";
import EditStream from "components/stream/edit-stream";
import { useState } from "react";
import { IStream } from "components/stream/definitions";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    width: "90%",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fcfcfc",
  },
};

type Props = {
  close: () => void;
  open: boolean;
  isNewStream: boolean;
  selectedStream: IStream;
};

const Stream: React.FC<Props> = ({ open, close, isNewStream, selectedStream }) => {
  const [modalHeight, setModalHeight] = useState("auto");
  return (
    <>
      <Modal
        isOpen={open}
        onRequestClose={() => {
          close();
          setModalHeight("auto");
        }}
        style={{ content: { ...customStyles.content, height: modalHeight } }}
        contentLabel="Example Modal"
      >
        <div className="flex justify-end">
          <button
            onClick={() => {
              close();
              setModalHeight("auto");
            }}
          >
            <CloseIcon />
          </button>
        </div>
        {isNewStream ? (
          <CreateStream setModalHeight={setModalHeight} />
        ) : (
          <EditStream setModalHeight={setModalHeight} selectedStream={selectedStream} />
        )}
      </Modal>
    </>
  );
};

export default Stream;