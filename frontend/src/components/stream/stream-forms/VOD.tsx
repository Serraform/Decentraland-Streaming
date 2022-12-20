import { Formik,  Form } from "formik";
import { IStreamVOD } from "components/stream/definitions";
import Video from "components/stream/create-stream/video";
import React, { useCallback, useState } from "react";
import { validationSchema } from "components/stream/definitions";
import CommonForm from 'components/stream/stream-forms/common';
type Props = {
  handleSave: Function;
  selectedStream: IStreamVOD,
  isNewStream: boolean
};


const StreamVOD: React.FC<Props> = ({ handleSave, selectedStream, isNewStream }) => {
  const [streamInfoVOD] = useState<IStreamVOD>({
    ...selectedStream,
  });

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
          <Form className={`flex flex-row ${isNewStream ? "justify-between" : "justify-center"} w-[100%]`}>
           {isNewStream && <Video video={values.video} handleChange={handleChange} />}
            <div className="flex flex-col justify-top w-[50%]">
              
              <CommonForm values={values} handleChange={handleChange}/>
              <button
                onClick={() => handleOnSubmit(values)}
                className="mt-[40px] btn-secondary"
                disabled={disabledEstimateCost(values)}
              >
                Estimate Cost
              </button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default StreamVOD;
