import { Formik, Form } from "formik";
import { IStreamVOD } from "components/stream/definitions";
import Video from "components/stream/create-stream/video";
import React, { useCallback, useState } from "react";
import { validationSchema } from "components/stream/definitions";
import CommonForm from "components/stream/stream-forms/common";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
type Props = {
  handleSave: Function;
  selectedStream: IStreamVOD;
  formMode: string;
  handleEstimateCost: Function;
  isLoading: boolean;
  handleDelete: Function;

};

const StreamVOD: React.FC<Props> = ({
  handleSave,
  selectedStream,
  formMode,
  handleEstimateCost,
  isLoading,
  handleDelete
}) => {
  const isCreateMode = formMode === "create"
  const [streamInfoVOD] = useState<IStreamVOD>({
    ...selectedStream,
  });
  const { cost } = useSelector((state: RootState) => state.transactionData);

  const handleOnSubmit = useCallback(
    (values: any) => {
      handleSave(values);
    },
    [handleSave]
  );
  const disabledEstimateCost = (values: IStreamVOD) => {
    return (
      values.name === "" ||
      values.attendees === "" ||
      values.video === "" ||
      values.videoSize === "" ||
      values.streamStartDate === undefined ||
      values.streamEndDate === undefined
    );
  };
  return (
    <Formik
      initialValues={streamInfoVOD}
      validationSchema={validationSchema}
      onSubmit={(values) => handleOnSubmit(values)}
    >
      {({ handleChange, values, errors
      ,initialValues }) => (
        <>
          <Form className={`flex flex-row"justify-between" w-[100%] h-[40vh]`}>
            {isCreateMode ? (
              <Video
                status={false}
                values={values}
                suspended={false}
                video={values.video}
                handleChange={handleChange}
              />
            ) : (
              <Video
                values={values}
                suspended={false}
                status={false}
                video={values.video}
                handleChange={() => null}
              />
            )}
            <div
              className="flex flex-col justify-top w-[50%]"
              style={{
                position: "relative",
              }}
            >
              <CommonForm
              initialValues={initialValues}
                values={values}
                handleChange={handleChange}
                cost={cost}
                formMode={formMode}
                loading={isLoading}
                handleEstimateCost={handleEstimateCost}
                handleSave={handleSave}
                disabledEstimateCost={disabledEstimateCost}
                errors={errors}
                handleDelete={handleDelete}
              />
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default StreamVOD;
