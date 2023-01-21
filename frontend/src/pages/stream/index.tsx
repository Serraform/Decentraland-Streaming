import StreamView from "components/stream";
import { RootState } from "store/configStore";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Stream = () => {
  const { selectedStream } = useSelector(
    (state: RootState) => state.streamData
  );
  let { id } = useParams();
  
  return (
    <>
      <StreamView isNewStream={id === "new"} selectedStream={selectedStream} />
    </>
  );
};

export default Stream;
