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
};

const SuspendModal: React.FC<Props> = ({ isOpen }) => {
  return (
    <Modal isOpen={isOpen} style={customStyles}>
      <div className="items-start flex flex-col justify-start w-100 dark:bg-[#1a1d1e]">
        <div className="px-[5rem] py-[20px]">
          <h1 className="font-montserratbold text-black text-start b-[40px] dark:text-white">
            This action is irreversible
          </h1>
          <p
            className="pt-[15px] text-black
dark:text-white"
          >
            Suspending your stream will unlock funds back to your funds
          </p>
          <div  className="pt-[20px] flex flex-row justify-end">
            <button className="btn-third" style={{color: "#C1C1C1"}}>Cancel</button>
            <button className="btn-third" style={{paddingRight: "0"}}>Suspend</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuspendModal;
