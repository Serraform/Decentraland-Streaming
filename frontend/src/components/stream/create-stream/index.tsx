import React, { useState} from "react";
import StreamType from "components/stream/create-stream/stream-type";
import StreamData from "components/stream/create-stream/stream-data";
type Props = {
  setModalHeight: Function;
};
const CreateStream: React.FC<Props> = ({ setModalHeight }) => {
  const [step, setStep] = useState(0);
  const [streamType, setStreamType] = useState("");
 
  const changeStep = (index: number) => {
    setStep(index);
    if (index === 1) {
      setModalHeight("700px");
    }
  };

  const renderSteps = () => {
    switch (step) {
      case 0:
        return (
          <StreamType handleSave={setStreamType} changeStep={changeStep} />
        );
      case 1:
        return <StreamData streamType={streamType} />;
      default:
        return <></>;
    }
  };
  return <>{renderSteps()}</>;
};

export default CreateStream;
