import { Field } from "formik";
import "react-nice-dates/build/style.css";
import { DateRangePicker, useDateInput } from "react-nice-dates";
import { useNavigate } from "react-router-dom";
import { enGB } from "date-fns/locale";
import { useCallback, useState } from "react";
import { isBefore, isAfter } from "date-fns";
import TrashIcon from "assets/icons/Trash";
import SuspendModal from "components/stream/stream-forms/suspend-modal";
type Props = {
  values: any;
  handleChange: Function;
  cost: number;
  loading: boolean;
  disabledEstimateCost: (values: any) => boolean;
  handleEstimateCost: Function;
  handleSave: Function;
};

const CommonForm: React.FC<Props> = ({
  values,
  handleChange,
  cost,
  loading,
  handleEstimateCost,
  handleSave,
  disabledEstimateCost,
}) => {
  const [openSuspendModal, setOpenSuspendModal] = useState(false);
  const navigate = useNavigate();
  const returnAsDate = useCallback((date: any) => {
    if (typeof date === "string") {
      return new Date(date);
    }
    return date;
  }, []);

  const streamIsBeingCreated = values.streamInfo.CreatedAt === 0;

  const streamIsHappeningOrHasHappened =
    !streamIsBeingCreated &&
    ((isAfter(Date.now(), returnAsDate(values.streamStartDate)) &&
      isBefore(Date.now(), returnAsDate(values.streamEndDate))) ||
      isAfter(Date.now(), returnAsDate(values.streamEndDate)) ||
      values.streamInfo.Suspended);

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
      <SuspendModal isOpen={openSuspendModal} />
      <div className="flex flex-row justify-between">
        <div className="mb-2 w-full mr-3">
          <h2 className="font-montserratbold text-black text-[14px] dark:text-white">
            Stream name
          </h2>
          <Field
            type="text"
            value={values.name}
            name="name"
            required
            disabled={streamIsHappeningOrHasHappened}
            onChange={handleChange}
            placeholder="Name"
            className="mb-[20px] mt-[10px] w-[100%] border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
          />
        </div>
        <div className="mb-2 w-full ml-3">
          <h2 className="font-montserratbold text-black text-[14px] dark:text-white">
            Max estimated number of attendees
          </h2>
          <Field
            type="text"
            required
            value={values.attendees}
            disabled={streamIsHappeningOrHasHappened}
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
          format="dd MMM yyyy"
          modifiersClassNames={modifiersClassNames}
          locale={enGB}
        >
          {({ startDateInputProps, endDateInputProps, focus }) => {
            return (
              <div className="date-range">
                <h2 className="font-montserratbold text-black text-[14px] dark:text-white">
                  Select Start and End Date of Stream
                </h2>
                <div className="flex flex-row items-baseline">
                  <input
                    className={`mb-[20px] mt-[10px] m-2 ml-0 w-[100%] border ${
                      focus === "startDate" ? " -focused" : ""
                    } border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none`}
                    {...startDateInputProps}
                    value={
                      startDateInputProps.value === ""
                        ? returnAsDate(values.streamStartDate)
                        : startDateInputProps.value
                    }
                    disabled={streamIsHappeningOrHasHappened}
                    placeholder="Start date"
                  />
                  <input
                    className={`mb-[20px] mt-[10px] m-2 ml-0 w-[100%] border ${
                      focus === "startDate" ? " -focused" : ""
                    } border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none`}
                    style={{ marginLeft: 16, width: 80 }}
                    disabled={streamIsHappeningOrHasHappened}
                    {...timeStartInputProps}
                  />
                  -{" "}
                  <input
                    {...endDateInputProps}
                    placeholder="End date"
                    value={
                      endDateInputProps.value === ""
                        ? returnAsDate(values.streamEndDate)
                        : endDateInputProps.value
                    }
                    disabled={streamIsHappeningOrHasHappened}
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
                    disabled={streamIsHappeningOrHasHappened}
                  />
                </div>
              </div>
            );
          }}
        </DateRangePicker>
      </div>
      <div className="mt-auto flex flex-col justify-end items-end">
        {cost !== 0 && !loading && (
          <h2 className="font-montserratbold text-black text-[15px] mt-auto mb-[1rem] dark:text-white">
            The cost for upload will be: ${cost} USDC
          </h2>
        )}
        <div className="flex">
          <button
            onClick={() => navigate("/")}
            className=" btn-third mt-auto ml-0 mr-1"
          >
            Cancel
          </button>
          {!streamIsBeingCreated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenSuspendModal(true);
              }}
              type="button"
              className=" btn-cancel flex flex-row items-center mt-auto ml-0 mr-5"
              // disabled={
              //   disabledEstimateCost(values) ||
              //   loading ||
              //   streamIsHappeningOrHasHappened
              // }
            >
              {loading ? (
                <div className="basic mr-[1rem] before:border-l-red-600" />
              ) : (
                <TrashIcon />
              )}
              Suspend
            </button>
          )}

          {cost === 0 && (
            <button
              onClick={() => handleEstimateCost(values)}
              className=" btn-secondary mt-auto"
              disabled={
                disabledEstimateCost(values) ||
                loading ||
                streamIsHappeningOrHasHappened
              }
            >
              Estimate Cost
            </button>
          )}
          {cost !== 0 && (
            <button
              onClick={() => handleSave(values)}
              className="btn-secondary flex flex-row items-center"
              disabled={
                disabledEstimateCost(values) ||
                loading ||
                streamIsHappeningOrHasHappened
              }
            >
              {loading && <div className="basic mr-[1rem]" />}
              Upload Asset
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CommonForm;
