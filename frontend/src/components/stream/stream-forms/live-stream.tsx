import { Formik, Form } from "formik";
import { ILiveStream } from "components/stream/definitions";
import React, { useCallback, useState } from "react";
import { validationSchema } from "components/stream/definitions";
import CommonForm from "components/stream/stream-forms/common";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
import Video from "components/stream/create-stream/video";
type Props = {
  handleSave: Function;
  selectedStream: ILiveStream;
  isNewStream: boolean;
  handleEstimateCost: Function;
  close: Function;
  isLoading: boolean;
};

const LiveStream: React.FC<Props> = ({
  handleSave,
  selectedStream,
  isNewStream,
  handleEstimateCost,
  close,
  isLoading,
}) => {
  const { cost } = useSelector((state: RootState) => state.transactionData);

  const [liveStreamVideo] = useState<ILiveStream>({
    ...selectedStream,
  });

  const handleOnSubmit = useCallback(
    (values: any) => {
      const valuesToSend = {
        ...values,
        streamType: "live-stream",
      };
      handleSave(valuesToSend);
    },
    [handleSave]
  );
  const disabledEstimateCost = (values: ILiveStream) => {
    return (
      values.name === "" ||
      values.attendees === "" ||
      values.streamStartDate === undefined ||
      values.streamEndDate === undefined
    );
  };
  
  return (
    <Formik
      initialValues={liveStreamVideo}
      validationSchema={validationSchema}
      onSubmit={(values) => handleOnSubmit(values)}
    >
      {({ handleChange, values }) => {
        
        return (
          <>
            <Form
              className={`flex flex-row ${
                !isNewStream ? "justify-between" : "justify-center"
              } items-center w-[100%] h-[35vh]`}
            >
              {!isNewStream && (
                <Video
                  values={values}
                  suspended={selectedStream.streamInfo.Suspended}
                  status={selectedStream.streamInfo.IsActive}
                  video={values.streamInfo.playbackUrl}
                  handleChange={() => null}
                />
              )}
              <div
                className="flex flex-col justify-top w-[50%] h-[100%]"
                style={{ position: "relative" }}
              >
                <CommonForm
                  values={values}
                  handleChange={handleChange}
                  cost={cost}
                  loading={isLoading}
                  handleEstimateCost={handleEstimateCost}
                  handleSave={handleOnSubmit}
                  disabledEstimateCost={disabledEstimateCost}
                  close={close}
                />
              </div>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default LiveStream;
