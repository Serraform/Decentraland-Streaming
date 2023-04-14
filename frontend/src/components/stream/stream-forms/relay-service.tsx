import { Formik, Form } from "formik";
import { IRelayService } from "components/stream/definitions";
import React, { useCallback, useState } from "react";
import {
  validationSchema,
  validateDateRange,
} from "components/stream/definitions";
import CommonForm from "components/stream/stream-forms/common";
import { Field } from "formik";
import Video from "components/stream/create-stream/video";
import ReactTooltip from "react-tooltip";
import FaqIcon from "assets/icons/Question";
type Props = {
  handleSave: Function;
  selectedStream: IRelayService;
  formMode: string;
  handleEstimateCost: Function;
  isLoading: boolean;
  cost: number;
  handleDelete: Function;
};

const RelayService: React.FC<Props> = ({
  handleSave,
  selectedStream,
  formMode,
  handleEstimateCost,
  isLoading,
  cost,
  handleDelete,
}) => {
  const isEditForm = formMode === "edit";

  const [liveStreamVideo] = useState<IRelayService>({
    ...selectedStream,
  });

  const handleOnSubmit = useCallback(
    (values: any) => {
      const valuesToSend = {
        ...values,
        streamType: "relayService",
      };
      handleSave(valuesToSend);
    },
    [handleSave]
  );
  const disabledEstimateCost = (values: IRelayService, errors: any) => {
    return (
      values.relayServiceLink === "" ||
      values.name === "" ||
      values.attendees === "" ||
      values.streamStartDate === undefined ||
      values.streamEndDate === undefined ||
      errors.streamEndDate ||
      errors.streamStartDate
    );
  };

  return (
    <Formik
      initialValues={liveStreamVideo}
      validationSchema={validationSchema}
      onSubmit={(values) => handleOnSubmit(values)}
      validate={validateDateRange}
    >
      {({ handleChange, values, errors, initialValues }) => {
        return (
          <>
            <Form
              className={`flex flex-row ${
                isEditForm ? "justify-between" : "justify-center"
              } items-center w-[100%] h-[35vh]`}
            >
              {isEditForm && (
                <Video
                  values={values}
                  suspended={false}
                  video={values.playBackUrl}
                  handleChange={() => null}
                />
              )}
              <div
                className="flex flex-col justify-top w-[50%] h-[100%]"
                style={{ position: "relative" }}
              >
                <div className="mb-2 w-full mr-3">
                  <h2 className="font-montserratbold text-black text-[14px] dark:text-white flex flex-row items-center">
                    Relay Service Link
                    <ReactTooltip
                      id="relayServiceLink"
                      place="top"
                      type={"dark"}
                      effect={"float"}
                    />
                    <div
                      className="form-tooltip"
                      data-for="relayServiceLink"
                      data-tip={"Link of your Twitch/YouTube live stream"}
                      data-iscapture="true"
                    >
                      <FaqIcon />
                    </div>
                  </h2>
                  <Field
                    type="text"
                    value={values.relayServiceLink}
                    name="relayServiceLink"
                    required
                    onChange={handleChange}
                    placeholder="Relay service link"
                    className="mb-[20px] mt-[10px] w-[100%] border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                  />
                </div>
                <CommonForm
                  initialValues={initialValues}
                  values={values}
                  handleChange={handleChange}
                  cost={cost}
                  loading={isLoading}
                  errors={errors}
                  formMode={formMode}
                  handleEstimateCost={handleEstimateCost}
                  handleSave={handleOnSubmit}
                  disabledEstimateCost={disabledEstimateCost}
                  handleDelete={handleDelete}
                />
              </div>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default RelayService;
