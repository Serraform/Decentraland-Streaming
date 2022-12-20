import axios from "axios";

let headersList = {
  Accept: "*/*",
  "Content-Type": "application/x-www-form-urlencoded",
};

let bodyContent =
  "scope=api://fa3dc8d4-95c4-4503-93cb-174f26a93787/.default&grant_type=client_credentials&client_id=5aeced22-b820-4984-b03a-dc800405bb6f&client_secret=YU78Q~MLw-pfMsrK4vETpO.Dlm.1FgvsJK26Mdm9";

let reqOptions = {
  url: `${process.env.REACT_APP_TOKEN_URL}`,
  method: "POST",
  headers: headersList,
  data: bodyContent,
};

export const getToken = async () => {
  try {
    const response = await axios.request(reqOptions);
    const jwt = response.data.access_token;
    localStorage.setItem("token", jwt);
  } catch (e) {
    console.log(e);
  }
};