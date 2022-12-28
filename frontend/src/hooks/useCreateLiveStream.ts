import { useEffect } from "react";
import { useCreateStream } from "@livepeer/react";

const useCreateLiveStream = (name: string, video: any) => {
  const {
    mutate: createLiveStream,
    data: stream,
    isLoading
  } = useCreateStream(
    name ? { name: name } : null
  );

  useEffect(() => {
    if (name !== "") {
      createLiveStream?.();
    }
  }, [name, createLiveStream]);

  return { isLoading, stream }
};

export default useCreateLiveStream;
