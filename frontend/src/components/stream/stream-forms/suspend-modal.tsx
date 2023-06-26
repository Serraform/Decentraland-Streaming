import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fcfcfc",
    padding: "0",
  },
};
type Props = {
  isOpen: boolean;
  handleAction: Function;
  handleClose: Function;
};

const SuspendModal: React.FC<Props> = ({
  isOpen,
  handleAction,
  handleClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      style={customStyles}
      onRequestClose={() => handleClose()}
    >
      <div className="items-start flex flex-col justify-start w-100 dark:bg-[#1a1d1e]">
        <div className="px-[5rem] py-[20px]">
          <h1 className="font-montserratbold text-black text-start b-[40px] dark:text-white">
            Delete Stream
          </h1>
          <p
            className="pt-[15px] text-black
dark:text-white"
          >
            Deleting your stream will unlock the funds for it.
          </p>
          <div className="pt-[20px] flex flex-row justify-end">
            <button
              onClick={() => handleClose()}
              className="btn-third"
              style={{ color: "#C1C1C1" }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleAction();
                handleClose();
              }}
              className="btn-third"
              style={{ paddingRight: "0" }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuspendModal;
