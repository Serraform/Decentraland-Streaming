import { Field } from "formik";
import "react-nice-dates/build/style.css";
import { useNavigate } from "react-router-dom";
import Calendar from 'components/stream/stream-forms/calendar'
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
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="mb-2 w-full mr-3">
          <h2 className="font-montserratbold text-black text-[15px] dark:text-white">
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
          <h2 className="font-montserratbold text-black text-[15px] dark:text-white">
          Estimated number of attendees
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
      <Calendar values={values} handleChange={handleChange} />
      <div className="mt-auto flex flex-col justify-end items-end">
        {cost !== 0 && !loading && (
          <h2 className="font-montserratbold text-black text-[15px] mt-auto mb-[1rem] dark:text-primary">
            Total cost for the stream will be: ${cost} USDC
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
              disabled={disabledEstimateCost(values) || loading}
            >
              Estimate cost
            </button>
          )}
          {cost !== 0 && (
            <button
              onClick={() => handleSave(values)}
              className="btn-secondary flex flex-row items-center"
              disabled={disabledEstimateCost(values) || loading}
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
