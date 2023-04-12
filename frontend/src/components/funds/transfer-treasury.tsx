import { useEffect, useState } from "react";
import Modal from "react-modal";
import { RootState } from "store/configStore";
import { useSelector } from "react-redux";
import { fetchFunds } from "store/slices/account.slice";
import { finishTransaction } from "store/slices/transaction.slice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
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

const TransferTreasury = (props: any) => {
  const [transferInfo, setTransferInfo] = useState({
    walletAddress: "",
    amount: 0,
  });
  const { loading, receipt } = useSelector(
    (state: RootState) => state.transactionData
  );
  const { openModal, closeModal, handleTransferTreasury } = props;
  const { walletID,treasuryFunds } = useSelector(
    (state: RootState) => state.accountData
  );
   const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (receipt && receipt.status === 1) {
      dispatch(finishTransaction());
      dispatch(fetchFunds(walletID));
      closeModal(false);
    }
  }, [closeModal, dispatch, receipt, walletID]);
  return (
    <>
      <Modal
        isOpen={openModal}
        ariaHideApp={false}
        style={{ content: { ...customStyles.content } }}
        contentLabel="Example Modal"
      >
        <div className="items-start flex flex-col justify-start w-100 dark:bg-[#1a1d1e]">
          <div className="px-[2rem] py-[20px]">
            <h1 className="font-montserratbold text-black text-start b-[40px] dark:text-white">
              Input the wallet you want to transfer the funds and the amount
            </h1>
            <div className="mt-[15px] mb-[10px]">
              <input
                className="mb-[5px] mt-[10px] w-[100%] border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                placeholder="Wallet you want to transfer"
                name="walletAddress"
                value={transferInfo.walletAddress}
                onChange={(e) =>
                  setTransferInfo({
                    ...transferInfo,
                    [e.target.name]: e.target.value,
                  })
                }
              />
              <input
                className="mt-[5px] w-[100%] border border-secondary text-secondary p-[0.5rem] border-b-0 placeholder:text-secondary focus:outline-none"
                placeholder="Amount you want to transfer"
                name="amount"
                value={
            transferInfo.amount
                }
                onChange={(e) =>
                  setTransferInfo({
                    ...transferInfo,
                    [e.target.name]: e.target.value,
                  })
                }
                style={{
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              />
              <div
                className="flex mb-5 flex-row justify-end items-center border border-secondary border-t-0  text-secondary p-[0.5rem] rounded"
                style={{
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
              >
                <div className="mr-2">
                  Balance: {parseFloat(treasuryFunds.toString()) / 10 ** 6} USDC
                </div>
                <button
                  onClick={() =>
                    setTransferInfo({
                      ...transferInfo,
                      amount: parseFloat(treasuryFunds.toString()) / 10 ** 6,
                    })
                  }
                >
                  Max
                </button>
              </div>

              <div className="w-full flex flex-row justify-end">
                <button
                  onClick={() => closeModal(false)}
                  className="mt-[30px] btn-third"
                >
                  Cancel
                </button>
                <button
                  className="mt-[30px] btn-secondary flex flex-row"
                  onClick={() => handleTransferTreasury(transferInfo.walletAddress, transferInfo.amount)}
                >
                  {loading && <div className="basic mr-[1rem]" />}
                  Transfer to treasury
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TransferTreasury;
