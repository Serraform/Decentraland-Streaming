import { Formik, Field, Form } from "formik";
import { ILiveStream } from "components/stream/definitions";
import { DateRangePicker } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import { enGB } from "date-fns/locale";
import React, { useCallback, useState } from "react";
import { validationSchema } from "components/stream/definitions";

type Props = {
  handleSave: Function;
};

const LiveStream: React.FC<Props> = ({ handleSave }) => {
  const [liveStreamVideo] = useState<ILiveStream>({
    name: "",
    attendees: "",
    liveEventLength: "",
    startDate: undefined,
    endDate: undefined,
    status: false,
    type: "live-stream",
    videoLink:""
  });

  const modifiersClassNames = {
    highlight: "-highlight",
  };
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
              <div className="mb-2">
                <h2 className="font-montserratbold text-black text-[15px]">
                  Stream name
                </h2>
                <Field
                  type="text"
                  value={values.name}
                  name="name"
                  required
                  onChange={handleChange}
                  placeholder="Name"
                  className="mb-[20px] mt-[10px] w-[100%] border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                />
              </div>
              <div className="mb-2">
                <h2 className="font-montserratbold text-black text-[15px]">
                  Max estimated number of attendees
                </h2>
                <Field
                  type="text"
                  required
                  value={values.attendees}
                  name="attendees"
                  onChange={handleChange}
                  placeholder="Attendees"
                  className="mb-[20px] mt-[10px] w-[100%] border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                />
              </div>
              <div>
                <DateRangePicker
                  startDate={values.startDate}
                  endDate={values.endDate}
                  onStartDateChange={(e: any) =>
                    handleChange({
                      target: { name: "startDate", value: e },
                    })
                  }
                  onEndDateChange={(e: any) =>
                    handleChange({ target: { name: "endDate", value: e } })
                  }
                  minimumDate={new Date()}
                  minimumLength={1}
                  format="dd MMM yyyy"
                  modifiersClassNames={modifiersClassNames}
                  locale={enGB}
                >
                  {({ startDateInputProps, endDateInputProps, focus }) => (
                    <div className="date-range">
                      <h2 className="font-montserratbold text-black text-[15px]">
                        Select Start and End Date of Stream
                      </h2>
                      <div className="flex flex-row items-baseline">
                        <input
                          className="mb-[20px] mt-[10px] m-2 ml-0 w-[100%] border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                          {...startDateInputProps}
                          placeholder="Start date"
                        />
                        -
                        <input
                          {...endDateInputProps}
                          placeholder="End date"
                          className="mb-[20px] mt-[10px] w-[100%] m-2 mr-0 border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </DateRangePicker>
              </div>
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
