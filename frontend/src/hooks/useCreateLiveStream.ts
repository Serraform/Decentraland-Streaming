import { useEffect, useMemo } from "react";
import { useCreateStream } from "@livepeer/react";

const useCreateLiveStream = (name: string, video: any) => {
  const {
    mutate: createLiveStream,
    data: stream,
    isLoading
  } = useCreateStream(
    name ? { name: name } : null
  );

  useMemo(() => {
    if (name !== "") {
      createLiveStream?.();
    }
  },[name]);

  return { isLoading, stream }
};

export default useCreateLiveStream;
