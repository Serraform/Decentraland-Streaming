import { Field } from "formik";
import "react-nice-dates/build/style.css";
import { DateRangePicker, useDateInput } from "react-nice-dates";

import { enGB } from "date-fns/locale";

type Props = {
  values: any;
  handleChange: Function;
  cost: number;
  loading: boolean;
  disabledEstimateCost: (values: any) => boolean;
  handleEstimateCost: Function;
  handleSave: Function;
  close: Function;
};

const CommonForm: React.FC<Props> = ({
  values,
  handleChange,
  cost,
  loading,
  handleEstimateCost,
  handleSave,
  disabledEstimateCost,
  close,
}) => {
  const timeStartInputProps = useDateInput({
    date: values.startDate,
    format: "HH:mm",
    locale: enGB,
    onDateChange: (e: any) =>
      handleChange({
        target: { name: "startDate", value: e },
      }),
  });

  const timeEndInputProps = useDateInput({
    date: values.endDate,
    format: "HH:mm",
    locale: enGB,
    onDateChange: (e: any) =>
      handleChange({
        target: { name: "endDate", value: e },
      }),
  });

  const modifiersClassNames = {
    highlight: "-highlight",
  };
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="mb-2 w-full mr-3">
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
        <div className="mb-2 w-full ml-3">
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
          {({ startDateInputProps, endDateInputProps, focus }) => {
            return (
              <div className="date-range">
                <h2 className="font-montserratbold text-black text-[15px]">
                  Select Start and End Date of Stream
                </h2>
                <div className="flex flex-row items-baseline">
                  <input
                    className={`mb-[20px] mt-[10px] m-2 ml-0 w-[100%] border ${
                      focus === "startDate" ? " -focused" : ""
                    } border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none`}
                    {...startDateInputProps}
                    placeholder="Start date"
                  />
                  <input
                    className={`mb-[20px] mt-[10px] m-2 ml-0 w-[100%] border ${
                      focus === "startDate" ? " -focused" : ""
                    } border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none`}
                    style={{ marginLeft: 16, width: 80 }}
                    {...timeStartInputProps}
                  />
                  -{" "}
                  <input
                    {...endDateInputProps}
                    placeholder="End date"
                    className={`mb-[20px] mt-[10px] m-2 ml-2 w-[100%] border ${
                      focus === "endDate" ? " -focused" : ""
                    } border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none`}
                  />
                  <input
                    className={`mb-[20px] mt-[10px] m-2 ml-2 w-[100%] border ${
                      focus === "endDate" ? " -focused" : ""
                    } border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none`}
                    style={{ marginLeft: 16, width: 80 }}
                    {...timeEndInputProps}
                  />
                </div>
              </div>
            );
          }}
        </DateRangePicker>
      </div>
      <div className="mt-auto flex flex-col justify-end items-end">
      {cost !== 0 && !loading && (
        <h2 className="font-montserratbold text-black text-[15px] mt-auto mb-[1rem]">
          The cost for upload will be: ${cost} USDT
        </h2>
      )}
      <div>

        <button
        
        onClick={() => close()}
        className=" btn-third mt-auto ml-0"
        >
          Cancel
        </button>

        {cost === 0 && (
          <button
            onClick={() => handleEstimateCost(values)}
            className=" btn-secondary mt-auto"
            disabled={disabledEstimateCost(values) || loading}
          >
            Estimate Cost
          </button>
        )}
        {cost !== 0 && !loading && (
          <button
          onClick={() => handleSave(values)}
          className="btn-secondary"
          disabled={disabledEstimateCost(values) || loading}
          >
            Upload Asset
          </button>
        )}
        </div>
      </div>
      {loading && (
        <div className="preloader">
          <span></span>
          <span></span>
        </div>
      )}
    </>
  );
};

export default CommonForm;
