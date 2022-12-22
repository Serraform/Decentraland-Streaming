import { Formik, Form } from "formik";
import { ILiveStream } from "components/stream/definitions";
import React, { useCallback, useState } from "react";
import { validationSchema } from "components/stream/definitions";
import CommonForm from "components/stream/stream-forms/common";
import { useSelector } from "react-redux";
import { RootState } from "store/configStore";

type Props = {
  handleSave: Function;
  selectedStream: ILiveStream;
  isNewStream: boolean;
  handleEstimateCost: Function;
};

const LiveStream: React.FC<Props> = ({
  handleSave,
  selectedStream,
  isNewStream,
  handleEstimateCost,
}) => {
  const { cost, loading } = useSelector(
    (state: RootState) => state.transactionData
  );

  const [liveStreamVideo] = useState<ILiveStream>({
    ...selectedStream,
  });

  const handleOnSubmit = useCallback(
    (values: any) => {
      handleSave(values);
    },
    [handleSave]
  );
  const disabledEstimateCost = (values: ILiveStream) => {
    return (
      values.name === "" ||
      values.attendees === "" ||
      values.startDate === undefined ||
      values.endDate === undefined
    );
  };
  return (
    <Formik
      initialValues={liveStreamVideo}
      validationSchema={validationSchema}
      onSubmit={(values) => handleOnSubmit(values)}
    >
      {({ handleChange, values }) => (
        <>
          <Form className="flex flex-row justify-center items-center w-[100%] h-[35vh]">
            <div className="flex flex-col justify-top w-[50%] h-[100%]" style={{position:"relative"}}>
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

export default LiveStream;
