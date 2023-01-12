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
  const returnAsDate = (date: any) => {
    if(typeof date === "string"){
      return new Date(date)
    }
    return date;
  }
  const timeStartInputProps = useDateInput({
    date: returnAsDate(values.streamStartDate),
    format: "HH:mm",
    locale: enGB,
    onDateChange: (e: any) =>
      handleChange({
        target: { name: "streamStartDate", value: e },
      }),
  });

  const timeEndInputProps = useDateInput({
    date: returnAsDate(values.streamEndDate),
    format: "HH:mm",
    locale: enGB,
    onDateChange: (e: any) =>
      handleChange({
        target: { name: "streamEndDate", value: e },
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
          startDate={returnAsDate(values.streamStartDate)}
          endDate={returnAsDate(values.streamEndDate)}
          onStartDateChange={(e: any) =>
            handleChange({
              target: { name: "streamStartDate", value: e },
            })
          }
          onEndDateChange={(e: any) =>
            handleChange({ target: { name: "streamEndDate", value: e } })
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
          The cost for upload will be: ${cost} USDC
        </h2>
      )}
      <div className="flex">

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
        {cost !== 0 && (
          <button
          onClick={() => handleSave(values)}
          className="btn-secondary flex flex-row items-center"
          disabled={disabledEstimateCost(values) || loading}
          >
          {loading &&  <div className="basic mr-[1rem]"/>}
            Upload Asset
          </button>
        )}
        </div>
      </div>
      
    </>
  );
};

export default CommonForm;
