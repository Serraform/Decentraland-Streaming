import { Field } from "formik";
import "react-nice-dates/build/style.css";
import { DateRangePicker } from "react-nice-dates";
import { enGB } from "date-fns/locale";

type Props = {
  values: any;
  handleChange: Function;
};

const CommonForm: React.FC<Props> = ({ values, handleChange }) => {
  const modifiersClassNames = {
    highlight: "-highlight",
  };
  return (
    <>
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
          minimumLength={1}
          format="dd MMM yyyy"
          modifiersClassNames={modifiersClassNames}
          locale={enGB}
        >
          {({ startDateInputProps, endDateInputProps, focus }) => {
            debugger;
            return (
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
          )}}
        </DateRangePicker>
      </div>
    </>
  );
};

export default CommonForm;
