import * as tus from "tus-js-client";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { updatePercentage, stopUploadAsset } from "store/slices/assets.slice";
const useTusUploadInstance = (
  file: File,
  tusEndpoint: string,
  filename: string
) => {

  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const uploadInstance = useMemo(() => {
    if (file) {
      return new tus.Upload(file, {
        endpoint: tusEndpoint, // URL from `tusEndpoint` field in the `/request-upload` response
        metadata: {
          filename,
          filetype: file.type,
        },
        uploadSize: file.size,
        
        onError(err) {
          console.error("Error uploading file:", err);
        },
        onProgress(bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log("Uploaded " + percentage + "%");
          dispatch(updatePercentage({percentage: percentage}));
          if(parseInt(percentage) >= 50){
            dispatch(stopUploadAsset());
            (uploadInstance as any).abort(true);
          }
        },
        onSuccess() {
          console.log("Upload finished:", (uploadInstance as any).url);
        },
      });
    }
    return null;
  }, [file, filename, tusEndpoint, dispatch]);
  const findPreviousUploads = async (uploadInstance: any) => {
    return await uploadInstance.findPreviousUploads();
  };
  const resumeFromPreviousUpload = async (
    uploadInstance: any,
    previousUploads: any
  ) => {
    uploadInstance.resumeFromPreviousUpload(previousUploads[0]);
  };

  return { uploadInstance, findPreviousUploads, resumeFromPreviousUpload };
};
export default useTusUploadInstance;
