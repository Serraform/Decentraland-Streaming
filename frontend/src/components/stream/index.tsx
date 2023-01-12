import Modal from "react-modal";
// import CloseIcon from "assets/icons/Close";
import CreateStream from "components/stream/create-stream";
import EditStream from "components/stream/edit-stream";
import { ILiveStream, IStreamVOD } from "components/stream/definitions";
import { useState } from "react";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
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

const Stream: React.FC<Props> = ({
  open,
  close,
  isNewStream,
  selectedStream,
}) => {
  const [modalFullSide, setFullSide] = useState(false);
  return (
    <>
      <Modal
        isOpen={open}
        ariaHideApp={false}
        onRequestClose={() => {
          close();
          setFullSide(false)
        }}
        style={{ content: { ...customStyles.content, width: modalFullSide ? "100%" : "", height: modalFullSide ? "100%" : "" } }}
        contentLabel="Example Modal"
      >
        {isNewStream ? (
          <CreateStream selectedStream={selectedStream} setFullSide={setFullSide} close={close}/>
        ) : (
          <EditStream selectedStream={selectedStream} setFullSide={setFullSide} close={close}/>
          
        )}
      </Modal>
    </>
  );
};

export default Stream;
