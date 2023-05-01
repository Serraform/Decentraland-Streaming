import { useState, useEffect, useMemo } from "react";
import { Field } from "formik";
import "react-nice-dates/build/style.css";
import SuspendModal from "components/stream/stream-forms/suspend-modal";
import Calendar from "components/stream/stream-forms/calendar";
import { isAfter, isBefore } from "date-fns";
import { useToasts } from "react-toast-notifications";
import FormButtons from "components/stream/stream-forms/form-buttons";
import FaqIcon from "assets/icons/Question";
import ReactTooltip from "react-tooltip";

type Props = {
  values: any;
  initialValues: any;
  handleChange: Function;
  cost: number;
  loading: boolean;
  disabledEstimateCost: (values: any, errors: any) => boolean;
  handleEstimateCost: Function;
  handleSave: Function;
  formMode: string;
  handleDelete: Function;
  errors: any;
};

const returnAsDate = (date: any) => {
  if (typeof date === "string") {
    return new Date(date);
  }
  return date;
};

const CommonForm: React.FC<Props> = ({
  values,
  initialValues,
  handleChange,
  cost,
  loading,
  handleEstimateCost,
  handleSave,
  disabledEstimateCost,
  errors,
  handleDelete,
  formMode,
}) => {
  const { addToast } = useToasts();
  const [needsToEstimateNewCost, setNeedsToEstimateNewCost] = useState(false);
  const [openSuspendModal, setOpenSuspendModal] = useState(false);
  
  const streamIsBeingCreated = useMemo(
    () => formMode==="edit",
    [formMode]
  );

  useEffect(() => {
    setNeedsToEstimateNewCost(false)
  }, [cost])

  

  const streamIsHappeningOrHasHappened = useMemo(
    () =>
      !streamIsBeingCreated &&
      ((isAfter(Date.now(), returnAsDate(values.streamStartDate)) &&
        isBefore(Date.now(), returnAsDate(values.streamEndDate))) ||
        isAfter(Date.now(), returnAsDate(values.streamEndDate)) ||
        values.streamInfo?.streamStatus === "Suspended"),
    [
      streamIsBeingCreated,
      values.streamEndDate,
      values.streamInfo?.streamStatus,
      values.streamStartDate,
    ]
  );

  useEffect(() => {
    console.log("streamIsHappeningOrHasHappened has re execute");
    if (streamIsHappeningOrHasHappened) {
      addToast(
        "This stream cannot be modified because it has already passed.",
        {
          appearance: "warning",
          autoDismiss: true,
        }
      );
    }
  }, [streamIsHappeningOrHasHappened, addToast]);

  const preventMinus = (e: any) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  return (
    <>
      <SuspendModal
        isOpen={openSuspendModal}
        handleAction={handleDelete}
        handleClose={setOpenSuspendModal}
      />

      <div className="flex flex-row justify-between  items-baseline">
        <div className="mb-2 w-full mr-3">
          <h2 className="font-montserratbold text-black text-[14px] dark:text-white flex flex-row items-center">
            Stream name
            <ReactTooltip
              id="stream-name"
              place="top"
              type={"dark"}
              effect={"float"}
            />
            <div
              className="form-tooltip"
              data-for="stream-name"
              data-tip={"Name of the stream"}
              data-iscapture="true"
            >
              <FaqIcon />
            </div>
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
          <h2 className="font-montserratbold text-black text-[14px] dark:text-white flex flex-row items-center">
            Estimated number of attendees
            <ReactTooltip
              id="stream-attendees"
              place="top"
              type={"dark"}
              effect={"float"}
            />
            <div
              className="form-tooltip"
              data-for="stream-attendees"
              data-tip={"Estimated number of attendees of the stream"}
              data-iscapture="true"
            >
              <FaqIcon />
            </div>
          </h2>
          <Field
            type="number"
            min="0"
            onKeyPress={preventMinus}
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

      <Calendar
        values={values}
        handleChange={handleChange}
        errors={errors}
        datesHasChange={setNeedsToEstimateNewCost}
        initialValues={initialValues}
      />

      <div className="mt-auto flex flex-col justify-end items-end">
        {cost !== 0 && !loading && (
          <h2 className="font-montserratbold text-black text-[15px] mt-auto mb-[1rem] dark:text-primary">
            <span className="font-montserratregular">
              {" "}
              Your stream will cost:
            </span>{" "}
            ${cost} USDC
          </h2>
        )}

        <FormButtons
          formMode={formMode}
          cost={cost}
          isDisabled={
            disabledEstimateCost(values, errors) ||
            loading ||
            streamIsHappeningOrHasHappened
          }
          loading={loading}
          setOpenSuspendModal={setOpenSuspendModal}
          handleEstimateCost={handleEstimateCost}
          handleSave={handleSave}
          values={values}
          needsToEstimateNewCost={needsToEstimateNewCost}
        />
      </div>
    </>
  );
};

export default CommonForm;
