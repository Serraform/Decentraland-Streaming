import React, { useState } from "react";
import StreamType from "components/stream/create-stream/stream-type";
import StreamData from "components/stream/create-stream/stream-data";
import { IStream } from "components/stream/definitions";
type Props = {
  selectedStream: IStream;
  setFullSide: Function;
  close: Function;
};
const CreateStream: React.FC<Props> = ({
  selectedStream,
  setFullSide,
  close,
}) => {
  const [step, setStep] = useState(0);
  const [streamType, setStreamType] = useState("");

  const changeStep = (index: number) => {
    setStep(index);
    if (index === 1) {
      setFullSide(true);
    }
  };

  const renderSteps = () => {
    switch (step) {
      case 0:
        return (
          <StreamType
            handleSave={setStreamType}
            changeStep={changeStep}
            close={close}
          />
        );
      case 1:
        return (
          <StreamData
            streamType={streamType}
            selectedStream={selectedStream}
            close={close}
          />
        );
      default:
        return <></>;
    }
  };
  return <>{renderSteps()}</>;
};

export default CreateStream;
