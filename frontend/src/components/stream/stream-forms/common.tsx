import { useState } from "react";
import { Field } from "formik";
import "react-nice-dates/build/style.css";
import SuspendModal from "components/stream/stream-forms/suspend-modal";
import Calendar from "components/stream/stream-forms/calendar";
import { isAfter, isBefore } from "date-fns";
import FormButtons from "components/stream/stream-forms/form-buttons";
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
  const [needsToEstimateNewCost, setNeedsToEstimateNewCost] = useState(false);
  const [openSuspendModal, setOpenSuspendModal] = useState(false);
  const streamIsBeingCreated = values.streamInfo.CreatedAt === 0;

  const streamIsHappeningOrHasHappened =
    !streamIsBeingCreated &&
    ((isAfter(Date.now(), returnAsDate(values.streamStartDate)) &&
      isBefore(Date.now(), returnAsDate(values.streamEndDate))) ||
      isAfter(Date.now(), returnAsDate(values.streamEndDate)) || false);
      //  values.streamInfo.Suspended);

  return (
    <>
      <SuspendModal
        isOpen={openSuspendModal}
        handleAction={handleDelete}
        handleClose={setOpenSuspendModal}
      />
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
      <Calendar values={values} handleChange={handleChange} errors={errors} datesHasChange={setNeedsToEstimateNewCost} initialValues={initialValues}/>
      <div className="mt-auto flex flex-col justify-end items-end">
        {cost !== 0 && !loading && (
          <h2 className="font-montserratbold text-black text-[15px] mt-auto mb-[1rem] dark:text-primary">
            Total cost for the stream will be: ${cost} USDC
          </h2>
        )}
        <div className="flex">
          <FormButtons
              formMode={formMode}
              cost={cost}
              isDisabled={
                (disabledEstimateCost(values, errors) ||
                loading ||
                streamIsHappeningOrHasHappened)}
              loading={loading}
              streamIsBeingCreated={streamIsBeingCreated}
              setOpenSuspendModal={setOpenSuspendModal}
              handleEstimateCost={handleEstimateCost}
              handleSave={handleSave}
              values={values}
              needsToEstimateNewCost={needsToEstimateNewCost}
          />
        </div>
      </div>
    </>
  );
};

export default CommonForm;
