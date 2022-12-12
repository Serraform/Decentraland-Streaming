import React, { useState, useCallback } from "react";
import StreamType from "components/stream-modal/create-modal/stream-type";
import StreamInfo from "components/stream-modal/create-modal/stream-info";
import { IStream } from "components/stream-modal/types";
type Props = {
  setModalHeight: Function;
};
const CreateModal: React.FC<Props> = ({ setModalHeight }) => {
  const [step, setStep] = useState(0);
  const [streamInfo, setStreamInfo] = useState<IStream>({
    type: "",
    name: "",
    attendees: "",
    video: "",
    videoSize: "",
    startDate: undefined,
    endDate: undefined,
  });

  const changeStep = (index: number) => {
    setStep(index);
    if (index === 1) {
      setModalHeight("700px");
    }
  };

  const handleChangeInfo = useCallback(
    (newInfo: IStream) => setStreamInfo({ ...streamInfo, ...newInfo }),
    [streamInfo]
  );

  const renderSteps = () => {
    switch (step) {
      case 0:
        return (
          <StreamType
            streamInfo={streamInfo}
            handleSave={handleChangeInfo}
            changeStep={changeStep}
          />
        );
      case 1:
        return (
          <StreamInfo
            streamInfo={streamInfo}
            handleSave={handleChangeInfo}
            changeStep={changeStep}
          />
        );
      default:
        return <></>;
    }
  };
  return <>{renderSteps()}</>;
};

export default CreateModal;
