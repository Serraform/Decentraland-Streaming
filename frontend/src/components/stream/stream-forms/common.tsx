import { useState } from "react";
import { Field } from "formik";
import "react-nice-dates/build/style.css";
import { useNavigate } from "react-router-dom";
import TrashIcon from "assets/icons/Trash";
import SuspendModal from "components/stream/stream-forms/suspend-modal";
import Calendar from "components/stream/stream-forms/calendar";
import { isAfter, isBefore } from "date-fns";
type Props = {
  values: any;
  handleChange: Function;
  cost: number;
  loading: boolean;
  disabledEstimateCost: (values: any, errors:any) => boolean;
  handleEstimateCost: Function;
  handleSave: Function;
  errors:any
};

const returnAsDate = (date: any) => {
  if (typeof date === "string") {
    return new Date(date);
  }
  return date;
};

const CommonForm: React.FC<Props> = ({
  values,
  handleChange,
  cost,
  loading,
  handleEstimateCost,
  handleSave,
  disabledEstimateCost,
  errors
}) => {
  const [openSuspendModal, setOpenSuspendModal] = useState(false);
  const navigate = useNavigate();
  const streamIsBeingCreated = values.streamInfo.CreatedAt === 0;

  const streamIsHappeningOrHasHappened =
    !streamIsBeingCreated &&
    ((isAfter(Date.now(), returnAsDate(values.streamStartDate)) &&
      isBefore(Date.now(), returnAsDate(values.streamEndDate))) ||
      isAfter(Date.now(), returnAsDate(values.streamEndDate)) ||
      values.streamInfo.Suspended);

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
          <h2 className="font-montserratbold text-black text-[15px] dark:text-white">
          Estimated number of attendees
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
      <Calendar values={values} handleChange={handleChange} errors={errors}/>
      <div className="mt-auto flex flex-col justify-end items-end">
        {cost !== 0 && !loading && (
          <h2 className="font-montserratbold text-black text-[15px] mt-auto mb-[1rem] dark:text-primary">
            Total cost for the stream will be: ${cost} USDC
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
              className=" btn-secondary mt-auto flex flex-row items-center"
              disabled={
                disabledEstimateCost(values, errors) ||
                loading ||
                streamIsHappeningOrHasHappened
              }
            >
               {loading && <div className="basic mr-[1rem]" />}
              Estimate cost
            </button>
          )}
          {cost !== 0 && (
            <button
              onClick={() => handleSave(values)}
              className="btn-secondary flex flex-row items-center"
              disabled={
                disabledEstimateCost(values, errors) ||
                loading ||
                streamIsHappeningOrHasHappened
              }
            >
              {loading && <div className="basic mr-[1rem]" />}
              Create Stream
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CommonForm;
