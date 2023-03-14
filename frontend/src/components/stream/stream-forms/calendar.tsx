import React from "react";
import "react-nice-dates/build/style.css";
import { DateRangePicker, useDateInput } from "react-nice-dates";
import { enUS } from "date-fns/locale";
import { differenceInHours } from "date-fns";
import FaqIcon from "assets/icons/Question";
import ReactTooltip from "react-tooltip";
import { checkDateRangeChange } from "components/stream/definitions";

type Props = {
  values: any;
  handleChange: Function;
  errors: any;
  initialValues: any;
  datesHasChange: Function;
};

const Calendar: React.FC<Props> = ({
  values,
  handleChange,
  errors,
  initialValues,
  datesHasChange,
}) => {
  const returnAsDate = (date: any) => {
    if (typeof date === "string") {
      return new Date(date);
    }
    return date;
  };

  const handleStartDateChange = (e: any) => {
    const hasChange = checkDateRangeChange(
      returnAsDate(e),
      returnAsDate(values.streamEndDate),
      returnAsDate(initialValues.streamStartDate),
      returnAsDate(initialValues.streamEndDate)
    );
    datesHasChange(hasChange === 0 || hasChange === 1);
    handleChange({
      target: { name: "streamStartDate", value: e },
    });
  };

  const handleEndDateChange = (e: any) => {
    const hasChange = checkDateRangeChange(
      returnAsDate(values.streamStartDate),
      returnAsDate(e),
      returnAsDate(initialValues.streamStartDate),
      returnAsDate(initialValues.streamEndDate)
    );
    datesHasChange(hasChange === 0 || hasChange === 1);
    handleChange({
      target: { name: "streamEndDate", value: e },
    });
  };

  const timeStartInputProps = useDateInput({
    date: returnAsDate(values.streamStartDate),
    format: "HH",
    locale: enUS,
    onDateChange: (e: any) => handleStartDateChange(e),
  });

  const timeEndInputProps = useDateInput({
    date: returnAsDate(values.streamEndDate),
    format: "HH",
    locale: enUS,
    onDateChange: (e: any) => handleEndDateChange(e),
  });
  const modifiersClassNames = {
    highlight: "-highlight",
  };
  return (
    <div>
      <DateRangePicker
        startDate={returnAsDate(values.streamStartDate)}
        endDate={returnAsDate(values.streamEndDate)}
        onStartDateChange={(e: any) => handleStartDateChange(e)}
        onEndDateChange={(e: any) => handleEndDateChange(e)}
        minimumDate={new Date()}
        format="dd MMM yyyy"
        modifiersClassNames={modifiersClassNames}
        locale={enUS}
      >
        {({ startDateInputProps, endDateInputProps, focus }) => {
          return (
            <div className="date-range">
              <h2 className="font-montserratbold text-black text-[14px] dark:text-white flex flex-row items-center">
                Select start and end date of stream
                <ReactTooltip
                  id="stream-calendar"
                  place="top"
                  type={"dark"}
                  effect={"float"}
                />
                <div
                  className="form-tooltip"
                  data-for="stream-calendar"
                  data-tip={"Start and end date that you want to stream, the hours are in 24h format"}
                  data-iscapture="true"
                >
                  <FaqIcon />
                </div>
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
                <span className="dark:text-white">to</span>{" "}
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
                    <span className="font-montserratregular">
                      Stream duration:
                    </span>{" "}
                    {differenceInHours(
                      returnAsDate(values.streamEndDate),
                      returnAsDate(values.streamStartDate)
                    )}{" "}
                    hours
                  </>
                ) : (
                  <></>
                )}
              </h2>
              <h2 className="font-montserratbold text-red-600 text-[15px] dark:text-red-600">
                {errors.streamEndDate && <>{errors.streamEndDate}</>}
              </h2>
              <h2 className="font-montserratbold text-red-600 text-[15px] dark:text-red-600">
                {errors.streamStartDate && <>{errors.streamStartDate}</>}
              </h2>
            </div>
          );
        }}
      </DateRangePicker>
    </div>
  );
};

export default Calendar;
