import * as Yup from "yup";
const initialInfoState = {
  type: "",
  name: "",
  attendees: "",
  video: "",
  videoSize: "",
  startDate: undefined,
  endDate: undefined,
};

const validationSchema = Yup.object().shape({
  type: Yup.string().required(),
  name: Yup.string().required(),
  attendees: Yup.string().required(),
});

export { initialInfoState, validationSchema };
