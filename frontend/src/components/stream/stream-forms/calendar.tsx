import React from "react";
import "react-nice-dates/build/style.css";
import { DateRangePicker, useDateInput } from "react-nice-dates";
import { enUS } from "date-fns/locale";
import { differenceInHours } from "date-fns";
type Props = {
  values: any;
  handleChange: Function;
};

const Calendar: React.FC<Props> = ({ values, handleChange }) => {
  const returnAsDate = (date: any) => {
    if (typeof date === "string") {
      return new Date(date);
    }
    return date;
  };
  const timeStartInputProps = useDateInput({
    date: returnAsDate(values.streamStartDate),
    format: "HH",
    locale: enUS,
    onDateChange: (e: any) =>
      handleChange({
        target: { name: "streamStartDate", value: e },
      }),
  });

  const timeEndInputProps = useDateInput({
    date: returnAsDate(values.streamEndDate),
    format: "HH",
    locale: enUS,
    onDateChange: (e: any) =>
      handleChange({
        target: { name: "streamEndDate", value: e },
      }),
  });
  const modifiersClassNames = {
    highlight: "-highlight",
  };
  return (
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
        format="dd MMM yyyy"
        modifiersClassNames={modifiersClassNames}
        locale={enUS}
      >
        {({ startDateInputProps, endDateInputProps, focus }) => {
          return (
            <div className="date-range">
              <h2 className="font-montserratbold text-black text-[15px] dark:text-white">
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
                  placeholder="HH"
                />
                <span className="dark:text-white">-</span>{" "}
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
                  placeholder="HH"
                />
              </div>
              <h2 className="font-montserratbold text-black text-[15px] dark:text-white">
                {values.streamStartDate && values.streamEndDate ? (
                  <>
                    Duration of the Stream:{" "}
                    {differenceInHours(
                      returnAsDate(values.streamEndDate),
                      returnAsDate(values.streamStartDate)
                    )}{" "}
                    hrs
                  </>
                ) : (
                  <></>
                )}
              </h2>
            </div>
          );
        }}
      </DateRangePicker>
    </div>
  );
};

export default Calendar;
