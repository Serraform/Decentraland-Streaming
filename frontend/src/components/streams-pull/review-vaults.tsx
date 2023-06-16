import { useEffect } from "react";
import Modal from "react-modal";
import { RootState } from "store/configStore";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { fetchFunds } from "store/slices/account.slice";
import { finishTransaction } from "store/slices/transaction.slice";
import { useMarkPulledStreamsMutation } from "store/api/streams.api";

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

const ReviewVaults = (props: any) => {
  const {
    openModal,
    vaultsId,
    vaultsFunds,
    streamIds,
    vaultsName,
    setState,
    handleTransfering,
    loading,
    receipt,
  } = props;
  const [markStreamsAsPulled] = useMarkPulledStreamsMutation();
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (receipt && receipt.status === 1) {
      dispatch(finishTransaction());
      markStreamsAsPulled({ streamsIds: streamIds });

      dispatch(fetchFunds(walletID));
      setState({ openModal: false, vaultsId, vaultsFunds });
    }
  }, [
    dispatch,
    markStreamsAsPulled,
    receipt,
    setState,
    streamIds,
    vaultsFunds,
    vaultsId,
    walletID,
  ]);
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
              Confirm treasury withdraw
            </h1>
            <div className="mt-[15px] mb-[10px]">
              <ul>
                {Array.from(vaultsName.entries()).map((value, index) => {
                  const key = (value as any)[0];
                  const keyValue = (value as any)[1];
                  return (
                    <div className="flex flex-row justify-between border-b border-slate-500 pt-3">
                      <span className="font-montserratregular text-dark dark:text-white">
                        {key}
                      </span>
                      <span className="font-montserratregular text-dark dark:text-white">
                        {keyValue} USDC
                      </span>
                    </div>
                  );
                })}
              </ul>

              <div className="w-full flex flex-row justify-end">
                <button
                  onClick={() =>
                    setState({ openModal: false, vaultsId, vaultsFunds })
                  }
                  className="mt-[30px] btn-third"
                >
                  Cancel
                </button>
                <button
                  className="mt-[30px] btn-secondary flex flex-row"
                  onClick={() => handleTransfering()}
                >
                  {loading && <div className="basic mr-[1rem]" />}
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReviewVaults;
