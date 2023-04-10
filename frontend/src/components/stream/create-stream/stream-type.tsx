import React, { useCallback } from "react";
import { Formik, Field, Form } from "formik";
import { validationSchema } from "components/stream/definitions";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fcfcfc",
    padding: "0",
  },
};
type Props = {
  handleSave: Function;
  changeStep: Function;
};
const StreamType: React.FC<Props> = ({ handleSave, changeStep }) => {
  const handleOnSubmit = useCallback(
    (values: any) => {
      handleSave(values.streamType);
      changeStep(1);
    },
    [handleSave, changeStep]
  );
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      onRequestClose={() => {
        navigate("/");
      }}
      style={{ content: { ...customStyles.content } }}
      contentLabel="Example Modal"
    >
      <div className="items-start flex flex-col justify-start w-100 dark:bg-[#1a1d1e]">
        <div className="px-[5rem] py-[20px]">
          <h1 className="font-montserratbold text-black text-start b-[40px] dark:text-white">
           What type of stream would you like to schedule?
          </h1>
          <div className="flex flex-row flex-wrap justify-evenly items-baseline pt-[35px]">
            <Formik
              initialValues={{ streamType: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleOnSubmit(values)}
            >
              {({ handleChange, values }) => (
                <>
                  <Form className="flex flex-row justify-between w-[100%]">
                  <>
                      <ReactTooltip
                        id="live"
                        place="top"
                        type={"dark"}
                        effect={"float"}
                      />
                      <div
                        data-for="live"
                        className="radio-item"
                        data-tip={
                          "Request an RTMP url/key to broadcast live using OBS, Zoom or other services supporting RTMP output."
                        }
                        data-iscapture="true"
                      >
                        <Field
                          type="radio"
                          onChange={handleChange}
                          id={"liveStream"}
                          name="streamType"
                          value={"liveStream"}
                        />
                        <label htmlFor={"liveStream"}>Live</label>
                      </div>
                    </>
                    <>
                      <ReactTooltip
                        id="VOD"
                        place="top"
                        type={"dark"}
                        effect={"float"}
                      />
                      <div
                        data-for="VOD"
                        className="radio-item"
                        data-tip={
                          "Upload your own video file and stream it on-demand."
                        }
                        data-iscapture="true"
                      >
                        <Field
                          type="radio"
                          onChange={handleChange}
                          id={"vod"}
                          name="streamType"
                          value={"vod"}
                        />
                        <label htmlFor={"vod"}>
                          Video On Demand <br />
                          (COMING SOON)
                        </label>
                      </div>
                    </>
                    
                    <>
                      <ReactTooltip
                        id="twitch"
                        place="top"
                        type={"dark"}
                        effect={"float"}
                      />
                      <div
                        data-for="twitch"
                        className="radio-item"
                        data-tip={
                          "Extract a stream from various services to make them compatible with Decentraland."
                        }
                        data-iscapture="true"
                      >
                        <Field
                          type="radio"
                          onChange={handleChange}
                          id={"twitch"}
                          name="streamType"
                          value={"twitch"}
                          disabled={true}
                        />
                        <label htmlFor={"twitch"}>
                          Service Relay <br /> (COMING SOON)
                        </label>
                      </div>
                    </>
                  </Form>
                  <div className="w-full flex flex-row justify-end">
                    <button
                      onClick={() => navigate("/")}
                      className="mt-[30px] btn-third"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleOnSubmit(values)}
                      className="mt-[30px] btn-secondary"
                      disabled={values.streamType === ""}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StreamType;
