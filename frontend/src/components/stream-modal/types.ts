export type IStream = {
  type: string;
  name: string;
  attendees: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  video: string;
  videoSize: string;
};

export type IStreamCreation = {
  streamInfo: IStream;
  handleSave: Function;
  changeStep: Function;
};
