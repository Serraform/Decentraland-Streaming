import { Formik, Field, Form } from "formik";
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
  const { cost, loading, error } = useSelector(
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
      values.videoLink === "" ||
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
                </>
              )}
              <CommonForm values={values} handleChange={handleChange} />
              {cost!==0 && !loading && <h2 className="font-montserratbold text-black text-[15px]">
                     The cost for upload will be: ${cost} ETH
                    </h2>}
              {cost===0  && <button
                onClick={() => handleEstimateCost(values)}
                className="mt-[40px] btn-secondary"
                disabled={disabledEstimateCost(values) || loading}
              >
                Estimate Cost
              </button>}
              {cost!==0 && !loading  && <button
                onClick={() => handleSave(values)}
                className="mt-[40px] btn-secondary"
                disabled={disabledEstimateCost(values) || loading}
              >
             Upload Asset
              </button>}
              {loading && (
                <div className="preloader">
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default LiveStream;
