import axios from "axios";
const jwtToken = localStorage.getItem("token");
export default axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE}`,
  timeout: 50000,
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
});
