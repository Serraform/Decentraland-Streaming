import Modal from "react-modal";
import CloseIcon from "assets/icons/Close";
import CreateModal from "components/stream-modal/create-modal";
import { useState } from "react";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    width: "90%",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fcfcfc"
  },
};

type Props = {
  close: () => void;
  open: boolean;
  isNewStream: boolean;
};

const StreamModal: React.FC<Props> = ({ open, close, isNewStream }) => {
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
        {isNewStream && <CreateModal setModalHeight={setModalHeight} />}
      </Modal>
    </>
  );
};

export default StreamModal;
