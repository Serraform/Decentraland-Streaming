import CreateStream from "components/stream/create-stream";
import EditStream from "components/stream/edit-stream";
import { ILiveStream, IStreamVOD } from "components/stream/definitions";


type Props = {
  isNewStream: boolean;
  selectedStream: ILiveStream | IStreamVOD;
};

const Stream: React.FC<Props> = ({
  isNewStream,
  selectedStream,
}) => {
  
  return (
    <>
        {isNewStream ? (
          <CreateStream selectedStream={selectedStream} />
        ) : (
          <EditStream selectedStream={selectedStream} />
        )}
    </>
  );
};

export default Stream;
