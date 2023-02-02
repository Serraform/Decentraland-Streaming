import * as Yup from "yup";
interface IStream {
  name: string;
  status: boolean;
  attendees: string;
  streamType: string;
  streamStartDate: Date | undefined;
  streamEndDate: Date | undefined;
  streamInfo: {
    Name:string;
    CreatedAt: number;
    Id: string;
    IsActive: boolean;
    PlayBackId: string;
    Profiles: [];
    Record: boolean;
    StreamKey: string;
    Suspended: boolean;
    playbackUrl: string;
    rtmpIngestUrl: string;
  },
  
}

type IStreamVOD = IStream & {
  video: string;
  videoSize: string;
  videoLenght: string;
};

type ILiveStream = IStream & {
  rtmpIngestUrl: string; 
  streamKey: string;
};

 type IStreamCreation = {
  streamType: string;
  selectedStream: IStream;
};


const initialInfoState = {
  streamType: "",
  name: "",
  status: false,
  attendees: "",
  streamStartDate: Date.now(),
  streamEndDate: Date.now(),
};

const validationSchema = Yup.object().shape({
  streamType: Yup.string().required(),
  name: Yup.string().required(),
  attendees: Yup.string().required(),
  streamStartDate: Yup.date().required(),
  streamEndDate: Yup.date().required(),
});

const validateDateRange = (values:any) => {
  const errors = {streamEndDate: ""};
  if (values.streamStartDate && values.streamEndDate && values.streamStartDate > values.streamEndDate) {
    errors.streamEndDate = 'End date cannot be before start date';
  }
  return errors;
};

function deepEqual(obj1:any, obj2:any) {
  if (obj1 === obj2) return true;
  if (obj1 === null || typeof obj1 !== 'object' ||
      obj2 === null || typeof obj2 !== 'object') return false;
  
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
export { initialInfoState, validationSchema, deepEqual, validateDateRange };
export type { IStream, IStreamVOD, ILiveStream, IStreamCreation };
