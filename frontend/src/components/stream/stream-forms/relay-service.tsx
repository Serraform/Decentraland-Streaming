import { Formik, Form } from "formik";
import { IRelayService } from "components/stream/definitions";
import React, { useCallback, useState, useEffect } from "react";
import {
  validationSchema,
  validateDateRange,
} from "components/stream/definitions";
import CommonForm from "components/stream/stream-forms/common";
import { Field } from "formik";
import Video from "components/stream/create-stream/video";
import ReactTooltip from "react-tooltip";
import FaqIcon from "assets/icons/Question";
import { useLazyVerifyRelayLinkQuery } from "store/api/streams.api";
import SuccessIcon from "assets/icons/Success";
import ErrorIcon from "assets/icons/Error";
import { useToasts } from "react-toast-notifications";
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
  const [relayUrlIsVerified, setIsVerfied] = useState(false);
  const { addToast } = useToasts();
  const [
    verifyRelayLink,
    {
      data: verifyRelayLinkResponse,
      isLoading: verifingRelayLink,
      isSuccess,
      isError,
    },
  ] = useLazyVerifyRelayLinkQuery();

  useEffect(() => {
    if (isSuccess && verifyRelayLinkResponse) {
      addToast("Broadcast url could be verified", {
        appearance: "success",
        autoDismiss: true,
      });
      setIsVerfied(verifyRelayLinkResponse);
    } else if (isSuccess && !verifyRelayLinkResponse) {
      addToast(
        "Broadcast url couldn't be verified, please read here for more info: ",
        {
          appearance: "error",
          autoDismiss: true,
        }
      );
    }
  }, [verifyRelayLinkResponse, isSuccess, isError, addToast]);

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
      values.relayUrl === "" ||
      !values.relayUrlIsVerified ||
      values.name === "" ||
      values.attendees === "" ||
      values.streamStartDate === undefined ||
      values.streamEndDate === undefined ||
      errors.streamEndDate !== ""|| errors.streamStartDate!==""
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
              } items-top w-[100%] `}
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
                  Broadcast Link
                    <ReactTooltip
                      id="relayUrl"
                      place="top"
                      type={"dark"}
                      effect={"float"}
                    />
                    <div
                      className="form-tooltip"
                      data-for="relayUrl"
                      data-tip={"Link of your Twitch/YouTube/etc live stream"}
                      data-iscapture="true"
                    >
                      <FaqIcon />
                    </div>
                  </h2>
                  <div className="flex flex-row items-center mb-[20px] mt-[10px]">
                    <Field
                      type="text"
                      value={values.relayUrl}
                      name="relayUrl"
                      disabled={formMode === "edit" && (values as any)?.relayUrlIsVerified}
                      onChange={handleChange}
                      placeholder="Broadcast Link"
                      required
                      className=" w-[100%] mr-5 border border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                    />
                    <button
                      className=" btn-secondary flex flex-row items-center w-[35%] justify-center"
                      disabled={
                        values.relayUrl === "" ||
                        values.relayUrl === null ||
                        (formMode === "edit" && (values as any)?.relayUrlIsVerified)
                      }
                      onClick={() => verifyRelayLink(values.relayUrl)}
                    >
                      {verifingRelayLink && <div className="basic" />}
                      {isSuccess && verifyRelayLinkResponse && <SuccessIcon />}
                      {isSuccess && !verifyRelayLinkResponse && <ErrorIcon />}

                      <span className="ml-2 " style={{whiteSpace: "pre"}}>Verify Link</span>
                    </button>
                  </div>
                </div>
                <CommonForm
                  initialValues={initialValues}
                  values={{ ...values, relayUrlIsVerified:  (relayUrlIsVerified || ((values)?.relayUrlIsVerified as boolean))  }}
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