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
  isNewStream: boolean;
  handleEstimateCost: Function;
};

const StreamVOD: React.FC<Props> = ({
  handleSave,
  selectedStream,
  isNewStream,
  handleEstimateCost,
}) => {
  const [streamInfoVOD] = useState<IStreamVOD>({
    ...selectedStream,
  });
  const { cost, loading } = useSelector(
    (state: RootState) => state.transactionData
  );

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
      values.startDate === undefined ||
      values.endDate === undefined
    );
  };
  return (
    <Formik
      initialValues={streamInfoVOD}
      validationSchema={validationSchema}
      onSubmit={(values) => handleOnSubmit(values)}
    >
      {({ handleChange, values }) => (
        <>
          <Form
            className={`flex flex-row ${
              isNewStream ? "justify-between" : "justify-center"
            } w-[100%] h-[40vh]`}
            
          >
            {isNewStream && (
              <Video   values={values} video={values.video} handleChange={handleChange} />
            )}
            <div className="flex flex-col justify-top w-[50%]" style={{
              position: "relative",
            }}>
              <CommonForm
                values={values}
                handleChange={handleChange}
                cost={cost}
                loading={loading}
                handleEstimateCost={handleEstimateCost}
                handleSave={handleSave}
                disabledEstimateCost={disabledEstimateCost}
              />
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default StreamVOD;
