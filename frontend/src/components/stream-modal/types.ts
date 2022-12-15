interface IStream {
  name: string;
  attendees: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export type IStreamVOD = IStream & {
  video: string;
  videoSize: string;
  videoLenght: string;
};

export type ILiveStream = IStream & {
  videoM3U8: string;
  liveEventLength: string;
};

export type IStreamCreation = {
  streamType: string;
};
