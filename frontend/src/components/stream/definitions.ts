import * as Yup from "yup";
import { differenceInMinutes, isBefore, isEqual } from "date-fns";
interface IStream {
  streamID: any;
  name: string;
  status: boolean;
  streamType: string;
  pulled: boolean;
  streamStartDate: Date | undefined;
  streamEndDate: Date | undefined;
  cost: string;
  vaultContractId: string;
  streamInfo: {
    Name: string;
    CreatedAt: number;
    Id: string;
    IsActive: boolean;
    PlayBackId: string;
    Profiles: [];
    Record: boolean;
    StreamKey: string;
    Suspended: boolean;
    playBackUrl: string;
    rtmpIngestUrl: string;
  };
}

interface IAsset {
  assetId: string;
  assetName: string;
  playbackId: string;
}

type IStreamVOD = IStream & {
  asset: IAsset | null;
  playBackUrl: string;
  VId: string;
};

type ILiveStream = IStream & {
  playBackUrl: string;
  rtmpIngestUrl: string;
  streamKey: string;
};

type IRelayService = IStream & {
  relayUrl: string;
  playBackUrl: string;
  relayUrlIsVerified: boolean;
};

type IStreamCreation = {
  streamType: string;
  selectedStream: IStream;
};

const initialInfoState = {
  streamType: "",
  name: "",
  status: false,
  streamStartDate: Date.now(),
  streamEndDate: Date.now(),
  pulled: false,
};

const validationSchema = Yup.object().shape({
  streamType: Yup.string().required(),
  name: Yup.string().required(),
  streamStartDate: Yup.date().required(),
  streamEndDate: Yup.date().required(),
});

const validateDateRange = (values: any) => {
  const errors = { streamEndDate: "", streamStartDate: "" };
  if (
    values.streamStartDate &&
    values.streamEndDate &&
    values.streamStartDate > values.streamEndDate
  ) {
    errors.streamEndDate = "End date cannot be before start date";
  }
  if (isBefore(values.streamStartDate, Date.now())) {
    errors.streamStartDate = "Start date cannot be a past date";
  }
  return errors;
};

function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;
  if (
    obj1 === null ||
    typeof obj1 !== "object" ||
    obj2 === null ||
    typeof obj2 !== "object"
  )
    return false;

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

const checkDateRangeChange = (
  oldStartDate: Date,
  oldEndDate: Date,
  newStartDate: Date,
  newEndDate: Date
) => {
  const oldRange = differenceInMinutes(oldEndDate, oldStartDate);
  const newRange = differenceInMinutes(newEndDate, newStartDate);

  if (newRange < oldRange) {
    const difference = oldRange - newRange;
    // Call function A
    console.log(
      `The date range has been shortened by ${difference} minutes. Function A is called.`
    );
    return 0;
  } else if (newRange > oldRange) {
    const difference = newRange - oldRange;
    // Call function B
    console.log(
      `The date range has been extended by ${difference} minutes. Function B is called.`
    );
    return 1;
  } else {
    console.log(`The date range has not changed.`);
    return -1;
  }
};

const calculateMinutesDuration = (
  oldStartDate: Date,
  oldEndDate: Date,
  newStartDate: Date,
  newEndDate: Date
) => {
  const oldRange = differenceInMinutes(oldEndDate, oldStartDate);
  const newRange = differenceInMinutes(newEndDate, newStartDate);

  if (newRange < oldRange) {
    const difference = oldRange - newRange;
    // Call function A
    return -Math.abs(difference);
  } else if (newRange > oldRange) {
    const difference = newRange - oldRange;
    // Call function B
    return difference;
  } else {
    console.log(`The date range has not changed.`);
    return 0;
  }
};

const datesHasChanged = (dateLeft: Date, dateRight: Date) => {
  return !isEqual(dateLeft, dateRight);
};
export {
  initialInfoState,
  validationSchema,
  calculateMinutesDuration,
  deepEqual,
  validateDateRange,
  checkDateRangeChange,
  datesHasChanged,
};
export type {
  IStream,
  IStreamVOD,
  ILiveStream,
  IStreamCreation,
  IAsset,
  IRelayService,
};
