import { Formik, Field, Form } from "formik";
import { ILiveStream } from "components/stream/definitions";
import React, { useCallback, useState } from "react";
import { validationSchema } from "components/stream/definitions";
import CommonForm from "components/stream/stream-forms/common";
type Props = {
  handleSave: Function;
  selectedStream: ILiveStream;
  isNewStream: boolean;
};

const LiveStream: React.FC<Props> = ({
  handleSave,
  selectedStream,
  isNewStream,
}) => {
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
      values.videoLink === "" ||
      values.liveEventLength === "" ||
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
          <Form className="flex flex-row justify-center items-center w-[100%]">
            <div className="flex flex-col justify-top w-[50%]">
              {isNewStream && (
                <>
                  <div className="mb-2">
                    <h2 className="font-montserratbold text-black text-[15px]">
                      Link to Live Stream (M3U8)
                    </h2>
                    <Field
                      type="text"
                      value={values.videoLink}
                      name="videoLink"
                      required
                      onChange={handleChange}
                      placeholder="Live Stream Link"
                      className="mb-[20px] mt-[10px] w-[100%] border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                    />
                  </div>
                  <div className="mb-2">
                    <h2 className="font-montserratbold text-black text-[15px]">
                      Live Stream Duration (in minutes)
                    </h2>
                    <Field
                      type="text"
                      value={values.liveEventLength}
                      name="liveEventLength"
                      required
                      onChange={handleChange}
                      placeholder="Live Event Length"
                      className="mb-[20px] mt-[10px] w-[100%] border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                    />
                  </div>
                </>
              )}
              <CommonForm values={values} handleChange={handleChange} />
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

export default LiveStream;
