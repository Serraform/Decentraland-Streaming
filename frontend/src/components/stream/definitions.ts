import * as Yup from "yup";
interface IStream {
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  attendees: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  type: string;
  createdAt: number;
  id: string; 
  playbackId: string;
  playbackUrl: string;
  
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
  close: Function;
};


const initialInfoState = {
  type: "",
  name: "",
  status: false,
  attendees: "",
  startDate: Date.now(),
  endDate: Date.now(),
};

const validationSchema = Yup.object().shape({
  type: Yup.string().required(),
  name: Yup.string().required(),
  attendees: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
});

export { initialInfoState, validationSchema };
export type { IStream, IStreamVOD, ILiveStream, IStreamCreation };
