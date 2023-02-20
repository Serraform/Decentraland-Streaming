import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useRef, useReducer, useEffect } from "react";
import Close from "assets/icons/Close";
import { useRequestAssetUploaderQuery } from "store/api/assets.api";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
import { useToasts } from "react-toast-notifications";
import useTusUploadInstance from "hooks/useTusUploadInstance";
import { startUploadAsset } from "store/slices/assets.slice";
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
const AssetUploader = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const { addToast } = useToasts();
  const { walletID } = useSelector((state: RootState) => state.accountData);
  const inputFileRef: any = useRef();
  const [file, setFile] = useReducer(
    (prev: any, next: any) => {
      const newEvent = { ...prev, ...next };
      return newEvent;
    },
    {
      fileInfo: null,
      localVideo: null,
      tusEndpoint: "",
    }
  );
  const { uploadInstance } = useTusUploadInstance(
    file.fileInfo,
    file.tusEndpoint,
    file.fileInfo?.name
  );
  const { data, isLoading, isSuccess, isError } = useRequestAssetUploaderQuery(
    { walletID, assetName: file.fileInfo && file.fileInfo.name },
    {
      skip: !file.fileInfo,
    }
  );

  useEffect(() => {
    if (isSuccess && data) {
      setFile({ tusEndpoint: data.tusEndPoint });
    }
  }, [isSuccess, data]);
  const navigate = useNavigate();

  const onFileChangeCapture = (e: any) => {
    onFileChange(e);
  };
  const onBtnClick = () => {
    (inputFileRef.current as any).click();
  };
  async function onFileChange(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    setFile({ fileInfo: file });
    if (file) {
      // const video = URL.createObjectURL(file);
      // setLocalVideo(video);
      let reader = new FileReader();
      reader.onload = function (e) {
        if (reader.result) {
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }
  return (
    <>
      <Modal
        isOpen={true}
        ariaHideApp={false}
        onRequestClose={() => {
          navigate("/");
        }}
        style={{ content: { ...customStyles.content } }}
        contentLabel="Example Modal"
      >
        <div className="items-start flex flex-col justify-start w-100 dark:bg-[#1a1d1e]">
          <div className="px-[2rem] py-[20px]">
            <h1 className="font-montserratbold text-black text-start b-[40px] dark:text-white">
              Upload Asset
            </h1>
            <div className="mt-[15px] mb-[10px]">
              <div
                role="presentation"
                className="cursor-pointer border border-primary px-6 py-2
                rounded text-center w-[25rem]"
                onClick={onBtnClick}
              >
                <input
                  accept="video/mp4,.mp4,video/quicktime,.mov,video/x-msvideo,.avi,video/webm,.webm,video/x-ms-wmv,.wmv,video/x-matroska,.mkv,video/x-flv,.flv"
                  ref={inputFileRef}
                  onChangeCapture={(e) => onFileChangeCapture(e)}
                  multiple={false}
                  type="file"
                  style={{ display: "none" }}
                />
                <p className="p-[15px] text-[16px]">
                  <span className="font-montserratregular dark:text-white">
                    <span className="font-montserratbold text-primary">
                      Browse files
                    </span>
                  </span>
                </p>
              </div>
              <div className="c-lesPJm c-lesPJm-iefzdUn-css">
                {file.fileInfo !== undefined && file.fileInfo !== null && (
                  <div className="flex flex-row items-center file-name">
                    <button
                      onClick={() => {
                        setFile({ fileInfo: undefined, tusEndpoint: "" });
                      }}
                    >
                      <Close />
                    </button>
                    <p className=" text-[10px]  dark:text-sky-100">
                      {(file.fileInfo as any).name}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <span id="radix-:ru:" className="mb-4 text-[10px]  text-slate-500">
              .mp4, .mov, .avi, .webm, .wmv, .mkv, .flv supported.
            </span>
            <div className="w-full flex flex-row justify-end">
              <button
                onClick={() => navigate("/")}
                className="mt-[30px] btn-third"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (uploadInstance) {
                    uploadInstance.start();
                    dispatch(startUploadAsset({ title: file.fileInfo.name }));
                    addToast("Uploading asset started", {
                      appearance: "success",
                      autoDismiss: true,
                    });
                    navigate("/");
                  }
                }}
                className="mt-[30px] btn-secondary flex flex-row"
                disabled={
                  isLoading || !file.fileInfo || file.tusEndpoint === ""
                }
              >
                {isLoading && <div className="basic mr-[1rem]" />}
                Upload
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AssetUploader;
