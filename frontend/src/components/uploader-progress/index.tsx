import WarningIcon from "assets/icons/Warning";
const UploaderProgress = () => {
  debugger;
  return (
    <div className="bg-[#fcfcfc] dark:bg-slate-600 border rounded px-5 py-2 absolute bottom-0 right-0 m-4">
      <div className="flex flex-col flex-start">
        <h1 className="font-montserratbold text-black text-start mb-[10px] dark:text-white">
          Upload in progress
        </h1>
        <div className="bg-yellow-200 rounded px-2 py-1 mb-[10px]">
          <div className="flex flex-row items-center">
            <WarningIcon />
            <span className="ml-1 font-montserratregular text-[13px]">
              Do not close this page until upload is complete.
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-montserratregular text-[14px] dark:text-white">
            How to Learn Faster ...
          </span>
          <div className="c-gqwkJN c-gqwkJN-ejCoEP-direction-row c-gqwkJN-jroWjL-align-center c-gqwkJN-awKDG-justify-start c-gqwkJN-kVNAnR-wrap-noWrap">
            <div className="c-lesPJm c-lesPJm-ihbpiMz-css">
              <div
                role="progressbar"
                data-state="loading"
                data-value="5.23564337355211"
                data-max="100"
                className="c-gNqtWQ c-gNqtWQ-gYiNiz-variant-blue"
              >
                <div
                  data-state="loading"
                  data-value="5.23564337355211"
                  data-max="100"
                  className="c-eEvPKh"
                  style={{ transform: "translateX(5%)" }}
                ></div>
              </div>
            </div>
            <span className="font-montserratregular text-[14px] dark:text-white">
              5%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploaderProgress;
