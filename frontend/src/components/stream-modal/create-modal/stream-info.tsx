import { IStreamCreation, IStream } from "components/stream-modal/types";
import { Formik, Field, Form } from "formik";
import { validationSchema } from "components/stream-modal/formdata";
import Video from "components/stream-modal/create-modal/video";
import { DateRangePicker} from "react-nice-dates";
import "react-nice-dates/build/style.css";
import { enGB } from "date-fns/locale";
const StreamInfo: React.FC<IStreamCreation> = ({
  streamInfo,
  handleSave,
  changeStep,
}) => {
  const modifiersClassNames = {
    highlight: "-highlight",
  };
  const handleOnSubmit = useCallback(
    (values: any) => {
      handleSave(values);
    },
    [handleSave]
  );

  const disabledEstimateCost = (values: IStream) =>{
    return (values.name === "" ||
    values.type === "" ||
    values.attendees === "" ||
    values.video === "" ||
    values.videoSize === "" ||
    values.startDate === undefined ||
    values.endDate === undefined)}
  return (
    <div className="px-[5rem] pt-[20px] pb-[5rem]">
      <div className="flex flex-row flex-wrap justify-evenly items-baseline pt-[20px]">
        <Formik
          initialValues={streamInfo}
          validationSchema={validationSchema}
          onSubmit={(values) => handleOnSubmit(values)}
        >
          {({ handleChange, values }) => (
            <>
              <Form className="flex flex-row justify-between w-[100%]">
                <Video video={streamInfo.video} handleChange={handleChange} />
                <div className="flex flex-col justify-top w-[50%]">
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
      </div>
    </div>
  );
};

export default StreamInfo;
