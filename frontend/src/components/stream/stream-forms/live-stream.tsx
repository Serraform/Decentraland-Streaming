import { Formik, Form } from "formik";
import { ILiveStream } from "components/stream/definitions";
import React, { useCallback, useState } from "react";
import { validationSchema, validateDateRange } from "components/stream/definitions";
import CommonForm from "components/stream/stream-forms/common";

import Video from "components/stream/create-stream/video";
type Props = {
  handleSave: Function;
  selectedStream: ILiveStream;
  isNewStream: boolean;
  handleEstimateCost: Function;
  isLoading: boolean;
  cost: number;
};

const LiveStream: React.FC<Props> = ({
  handleSave,
  selectedStream,
  isNewStream,
  handleEstimateCost,
  isLoading,
  cost
}) => {
  

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
  const disabledEstimateCost = (values: ILiveStream, errors:any) => {
    return (
      values.name === "" ||
      values.attendees === "" ||
      values.streamStartDate === undefined ||
      values.streamEndDate === undefined ||
      errors.streamEndDate
    );
  };
  
  return (
    <Formik
      initialValues={liveStreamVideo}
      validationSchema={validationSchema}
      onSubmit={(values) => handleOnSubmit(values)}
      validate={validateDateRange}
    >
      {({ handleChange, values , errors,touched}) => {
        
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
                  errors={errors}
                  handleEstimateCost={handleEstimateCost}
                  handleSave={handleOnSubmit}
                  disabledEstimateCost={disabledEstimateCost}
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
