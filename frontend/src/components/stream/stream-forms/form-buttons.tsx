import { useNavigate } from "react-router-dom";
import TrashIcon from "assets/icons/Trash";
const FormButtons = (props: any) => {
  const {
    formMode,
    cost,
    isDisabled,
    loading,
    streamIsBeingCreated,
    setOpenSuspendModal,
    handleEstimateCost,
    handleSave,
    values,
    needsToEstimateNewCost
  } = props;
  console.log(cost)
  const navigate = useNavigate();
  return (
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
          {cost === 0 ? "Calculate Price" : "Schedule Stream"}
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
          {cost === 0 && needsToEstimateNewCost ? "Calculate Price" : "Edit Stream"}
        </button>
      )}
    </div>
  );
};

export default FormButtons;