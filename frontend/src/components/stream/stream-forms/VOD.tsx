import { Formik, Form } from "formik";
import { IStreamVOD } from "components/stream/definitions";
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
import { RootState } from "store/configStore";
import { useFetchAssetsByWalletIdQuery } from "store/api/assets.api";
import { useSelector } from "react-redux";
type Props = {
  handleSave: Function;
  selectedStream: IStreamVOD;
  formMode: string;
  handleEstimateCost: Function;
  isLoading: boolean;
  cost: number;
  handleDelete: Function;
};

const VOD: React.FC<Props> = ({
  handleSave,
  selectedStream,
  formMode,
  handleEstimateCost,
  isLoading,
  cost,
  handleDelete,
}) => {
  const isEditForm = formMode === "edit";

  const { walletID } = useSelector((state: RootState) => state.accountData);
  const { data: assets, isLoading: loading } =
    useFetchAssetsByWalletIdQuery(walletID);
  const [liveStreamVideo] = useState<IStreamVOD>({
    ...selectedStream,
  });

  const handleOnSubmit = useCallback(
    (values: any) => {
      const valuesToSend = {
        ...values,
        streamType: "vod",
      };
      handleSave(valuesToSend);
    },
    [handleSave]
  );
  const disabledEstimateCost = (values: IStreamVOD, errors: any) => {
    return (
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
                {!isEditForm ? (<div className="mb-2 w-full mr-3">
                  <h2 className="font-montserratbold text-black text-[14px] dark:text-white flex flex-row items-center">
                    Select Asset
                    <ReactTooltip
                      id="asset"
                      place="top"
                      type={"dark"}
                      effect={"float"}
                    />
                    <div
                      className="form-tooltip"
                      data-for="asset"
                      data-tip={
                        "Make sure that you previously uploaded your asset"
                      }
                      data-iscapture="true"
                    >
                      <FaqIcon />
                    </div>
                  </h2>
                  {!loading ? (
                    <Field
                      as="select"
                      name="VId"
                      disabled={isEditForm}
                      required
                      onChange={handleChange}
                      className="mb-[20px] mt-[10px] w-[100%] border bg-transparent  border-secondary text-secondary p-[0.5rem] placeholder:text-secondary focus:outline-none"
                    >
                      <option value="">Select an asset</option>
                      {assets &&
                        Object.keys(
                          assets.filter(
                            (asset) =>{
                              return JSON.parse((asset as any).uploadAssetStatus)
                                .Phase === "ready"}
                          )
                        ).map((key: any) => {
                          return (
                            <option value={assets[key]?.assetId}>
                              {assets[key]?.assetName}
                            </option>
                          );
                        })}
                    </Field>
                  ) : (
                    <div className="mb-[20px] mt-[10px] basic" />
                  )}
                </div>): <h2 className="mb-[20px] font-montserratbold text-black text-[14px] dark:text-white flex flex-row items-center">
                    Video File Selected: {assets?.filter((asset) => asset.assetId === (values as any).vId)[0]?.assetName}
                    <ReactTooltip
                      id="asset"
                      place="top"
                      type={"dark"}
                      effect={"float"}
                    />
                    <div
                      className="form-tooltip"
                      data-for="asset"
                      data-tip={
                        "This is the Video selected by you to stream, you cannot edit it"
                      }
                      data-iscapture="true"
                    >
                      <FaqIcon />
                    </div>
                  </h2>}
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

export default VOD;
