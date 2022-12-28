import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";
import { useCreateStream } from "@livepeer/react";

const useUploadStream = (name: string, video: any) => {
  const {
    mutate: createLiveStream,
    data: stream,
    status,
    isLoading
  } = useCreateStream(
    name ? { name: name } : null
  );

  useEffect(() => {
    if (name !== "") {
      createLiveStream?.();
    }
  }, [name]);

  return { isLoading, stream }
};

export default useUploadStream;
