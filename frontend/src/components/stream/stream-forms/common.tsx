import { Field } from "formik";
import "react-nice-dates/build/style.css";
import { useNavigate } from "react-router-dom";
import Calendar from "components/stream/stream-forms/calendar";
import { isAfter, isBefore } from "date-fns";
type Props = {
  values: any;
  handleChange: Function;
  cost: number;
  loading: boolean;
  disabledEstimateCost: (values: any) => boolean;
  handleEstimateCost: Function;
  handleSave: Function;
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
}) => {
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
      <Calendar values={values} handleChange={handleChange} />
      <div className="mt-auto flex flex-col justify-end items-end">
        {cost !== 0 && !loading && (
          <h2 className="font-montserratbold text-black text-[15px] mt-auto mb-[1rem] dark:text-white">
            The cost for upload will be: ${cost} USDC
          </h2>
        )}
        <div className="flex">
          <button
            onClick={() => navigate("/")}
            className=" btn-third mt-auto ml-0"
          >
            Cancel
          </button>

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
