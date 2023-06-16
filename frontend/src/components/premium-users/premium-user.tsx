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

const PremiumUser = (props: any) => {
  const { open, handleClose, handleSave, handleChange, premiumUserData, loading } =
    props;

  return (
    <>
      <Modal
        isOpen={open}
        ariaHideApp={false}
        style={{ content: { ...customStyles.content } }}
        contentLabel="Example Modal"
      >
        <div className="items-start flex flex-col justify-start w-100 dark:bg-[#1a1d1e]">
          <div className="px-[2rem] py-[20px]">
            <h1 className="font-montserratbold text-black text-start b-[40px] dark:text-white">
              Enter the wallet address and discount amount (%)
            </h1>
            <div className="mt-[15px] mb-[10px]">
              <input
                className="mb-[5px] mt-[10px] w-[100%] border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                placeholder="Wallet public address (0x...)"
                name="walletId"
                value={premiumUserData.walletId}
                onChange={(e) =>
                  handleChange({
                    ...premiumUserData,
                    [e.target.name]: e.target.value,
                  })
                }
              />
              <input
                className="mt-[5px] w-[100%] border border-secondary text-secondary p-[0.5rem]  placeholder:text-secondary focus:outline-none"
                placeholder="User discount (%)"
                name="discount"
                value={premiumUserData.discount}
                onChange={(e) =>
                  handleChange({
                    ...premiumUserData,
                    [e.target.name]: e.target.value,
                  })
                }
               
              />

              <div className="w-full flex flex-row justify-end">
                <button
                  onClick={() => handleClose()}
                  className="mt-[30px] btn-third"
                >
                  Cancel
                </button>
                <button
                  className="mt-[30px] btn-secondary flex flex-row"
                  onClick={() => handleSave()}
                >
                  {loading && <div className="basic mr-[1rem]" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PremiumUser;
