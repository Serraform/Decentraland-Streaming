import { useNavigate } from "react-router-dom";
import TrashIcon from "assets/icons/Trash";
import { finishTransaction } from "store/slices/transaction.slice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "store/configStore";

const FormButtons = (props: any) => {
  const {
    formMode,
    cost,
    isDisabled,
    loading,
    setOpenSuspendModal,
    handleEstimateCost,
    handleSave,
    values,
    needsToEstimateNewCost,
  } = props;
  const navigate = useNavigate();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  console.log(cost);
  const dispatch = useAppDispatch();

  return (
    <div className="flex">
      <button
        onClick={() => {
          dispatch(finishTransaction());
          navigate("/");
        }}
        className=" btn-third mt-auto ml-0 mr-1"
      >
        Cancel
      </button>
      {formMode === "edit" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenSuspendModal(true);
          }}
          type="button"
          className=" btn-cancel flex flex-row items-center mt-auto ml-0 mr-5"
          disabled={isDisabled}
        >
          {loading ? (
            <div className="basic mr-[1rem] before:border-l-red-600" />
          ) : (
            <TrashIcon />
          )}
          Delete
        </button>
      )}
      {formMode === "create" ? (
        <button
          onClick={() => {
            if (cost === 0) {
              handleEstimateCost(values);
            } else {
              handleSave(values);
            }
          }}
          className=" btn-secondary mt-auto flex flex-row items-center"
          disabled={isDisabled}
        >
          {loading && <div className="basic mr-[1rem]" />}
          {cost === 0
            ? "Calculate Price"
            : !values.relayUrlIsVerified
            ? "Save Stream"
            : "Schedule Stream"}
        </button>
      ) : (
        <button
          onClick={() => {
            if (cost === 0 && needsToEstimateNewCost) {
              handleEstimateCost(values);
            } else {
              handleSave(values);
            }
          }}
          className=" btn-secondary mt-auto flex flex-row items-center"
          disabled={isDisabled}
        >
          {loading && <div className="basic mr-[1rem]" />}
          {cost === 0 && needsToEstimateNewCost
            ? "Calculate Price"
            : !values.relayUrlIsVerified
            ? "Save Stream"
            : "Save Changes"}
        </button>
      )}
    </div>
  );
};

export default FormButtons;
