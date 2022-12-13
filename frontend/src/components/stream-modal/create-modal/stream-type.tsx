import React, { useCallback } from "react";
import { IStreamCreation } from "components/stream-modal/types";
import { Formik, Field, Form } from "formik";
import {
  initialInfoState,
  validationSchema,
} from "components/stream-modal/formdata";
const StreamType: React.FC<IStreamCreation> = ({
  handleSave,
  changeStep,
}) => {
  const handleOnSubmit = useCallback((values: any) => {
    handleSave(values)
    changeStep(1)
  }, [handleSave,
    changeStep]);
  return (
    <div className="px-[5rem] py-[20px] items-center flex flex-col justify-center w-100">
      <h1 className="font-montserratbold text-black text-center pb-[40px]">
        Please select which type of streaming you wish to upload
      </h1>
      <div className="flex flex-row flex-wrap justify-evenly items-baseline pt-[20px]">
        <Formik
          initialValues={initialInfoState}
          validationSchema={validationSchema}
          onSubmit={(values) => handleOnSubmit(values)}
        >
          {({ handleChange, values }) => (
            <>
              <Form className="flex flex-row justify-between w-[100%]">
                <div className="radio-item">
                  <Field
                    type="radio"
                    onChange={handleChange}
                    id={"vod"}
                    name="type"
                    value={"vod"}
                  />
                  <label htmlFor={"vod"}>
                    Video-On-Demand <br />
                    (VOD) streaming
                  </label>
                </div>
                <div className="radio-item">
                  <Field
                    type="radio"
                    onChange={handleChange}
                    id={"live-stream"}
                    name="type"
                    value={"live-stream"}
                  />
                  <label htmlFor={"live-stream"}>Live Streaming</label>
                </div>
                <div className="radio-item">
                  <Field
                    type="radio"
                    onChange={handleChange}
                    id={"twitch"}
                    name="type"
                    value={"twitch"}
                  />
                  <label htmlFor={"twitch"}>Twitch</label>
                </div>
              </Form>
              <button
                onClick={() => handleOnSubmit(values)}
                className="mt-[40px] btn-secondary"
                disabled={values.type === ""}
              >
                Next
              </button>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StreamType;
