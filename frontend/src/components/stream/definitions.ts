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
  close: Function;
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

export { initialInfoState, validationSchema };
export type { IStream, IStreamVOD, ILiveStream, IStreamCreation };
