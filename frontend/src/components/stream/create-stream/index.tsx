import React, { useState } from "react";
import StreamType from "components/stream/create-stream/stream-type";
import StreamData from "components/stream/create-stream/stream-data";
import { IStream } from "components/stream/definitions";
type Props = {
  selectedStream: IStream;
};
const CreateStream: React.FC<Props> = ({
  selectedStream,
}) => {
  const [step, setStep] = useState(0);
  const [streamType, setStreamType] = useState("");

  const changeStep = (index: number) => {
    setStep(index);
   
  };

  const renderSteps = () => {
    switch (step) {
      case 0:
        return (
          <StreamType
            handleSave={setStreamType}
            changeStep={changeStep}
          />
        );
      case 1:
        return (
          <StreamData
            streamType={streamType}
            selectedStream={selectedStream}
          />
        );
      default:
        return <></>;
    }
  };
  return <>{renderSteps()}</>;
};

export default CreateStream;
