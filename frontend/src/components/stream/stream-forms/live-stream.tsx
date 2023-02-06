import { Formik, Form } from "formik";
import { ILiveStream } from "components/stream/definitions";
import React, { useCallback, useState } from "react";
import {
  validationSchema,
  validateDateRange,
} from "components/stream/definitions";
import CommonForm from "components/stream/stream-forms/common";

import Video from "components/stream/create-stream/video";
type Props = {
  handleSave: Function;
  selectedStream: ILiveStream;
  formMode: string;
  handleEstimateCost: Function;
  isLoading: boolean;
  cost: number;
  handleDelete: Function;
};

const LiveStream: React.FC<Props> = ({
  handleSave,
  selectedStream,
  formMode,
  handleEstimateCost,
  isLoading,
  cost,
  handleDelete,
}) => {
  const isEditForm = formMode === "edit";

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
  const disabledEstimateCost = (values: ILiveStream, errors: any) => {
    return (
      values.name === "" ||
      values.attendees === "" ||
      values.streamStartDate === undefined ||
      values.streamEndDate === undefined ||
      errors.streamEndDate ||  errors.streamStartDate
    );
  };

  return (
    <Formik
      initialValues={liveStreamVideo}
      validationSchema={validationSchema}
      onSubmit={(values) => handleOnSubmit(values)}
      validate={validateDateRange}
    >
      {({ handleChange, values, errors, initialValues }) => {
        return (
          <>
            <Form
              className={`flex flex-row ${
                isEditForm ? "justify-between" : "justify-center"
              } items-center w-[100%] h-[35vh]`}
            >
              {isEditForm && (
                <Video
                  values={values}
                  suspended={false}
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
                initialValues={initialValues}
                  values={values}
                  handleChange={handleChange}
                  cost={cost}
                  loading={isLoading}
                  errors={errors}
                  formMode={formMode}
                  handleEstimateCost={handleEstimateCost}
                  handleSave={handleOnSubmit}
                  disabledEstimateCost={disabledEstimateCost}
                  handleDelete={handleDelete}
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
