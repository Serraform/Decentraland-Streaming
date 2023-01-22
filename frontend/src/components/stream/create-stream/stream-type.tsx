import React, { useCallback } from "react";
import { Formik, Field, Form } from "formik";
import { validationSchema } from "components/stream/definitions";
import Modal from "react-modal";import {useNavigate}from 'react-router-dom';
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fcfcfc",
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
  );  const navigate = useNavigate();
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
      <div className="px-[5rem] py-[20px] items-start flex flex-col justify-start w-100">
        <h1 className="font-montserratbold text-black text-start b-[40px]">
          Please select which type of streaming you wish to upload
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
                  <div className="radio-item">
                    <Field
                      type="radio"
                      onChange={handleChange}
                      id={"vod"}
                      name="streamType"
                      value={"vod"}
                    />
                    <label htmlFor={"vod"}>
                      Video-On-Demand <br />
                      (VOD) streaming
                    </label>
                  </div>
                  <div className="radio-item">
                    <Field
                      type="radio"
                      onChange={handleChange}
                      id={"live-stream"}
                      name="streamType"
                      value={"live-stream"}
                    />
                    <label htmlFor={"live-stream"}>Live Streaming</label>
                  </div>
                  <div className="radio-item">
                    <Field
                      type="radio"
                      onChange={handleChange}
                      id={"twitch"}
                      name="streamType"
                      value={"twitch"}
                    />
                    <label htmlFor={"twitch"}>Twitch</label>
                  </div>
                </Form>
                <div className="w-full flex flex-row justify-end">
                  <button
                    onClick={() =>  navigate("/")}
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
    </Modal>
  );
};

export default StreamType;
