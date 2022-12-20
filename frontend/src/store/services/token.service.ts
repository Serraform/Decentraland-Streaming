// import axios from "axios";

// let headersList = {
//   Accept: "*/*",
//   "Content-Type": "application/x-www-form-urlencoded",
// };

// let bodyContent =
//   "scope=api://fa3dc8d4-95c4-4503-93cb-174f26a93787/.default&grant_type=client_credentials&client_id=5aeced22-b820-4984-b03a-dc800405bb6f&client_secret=YU78Q~MLw-pfMsrK4vETpO.Dlm.1FgvsJK26Mdm9";

// let reqOptions = {
//   url: `${process.env.REACT_APP_TOKEN_URL}`,
//   method: "POST",
//   headers: headersList,
//   data: bodyContent,
// };

// export const getToken = async () => {
//   try {
//     debugger;
//     const response = await axios.request(reqOptions);
//     const jwt = response.data.access_token;
//     localStorage.setItem("token", jwt);
//   } catch (e) {
//     console.log(e);
//   }
// };

let headersList = {
  Accept: "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  scope: "",
  "Origin": "",
  "Content-Type": "application/x-www-form-urlencoded",
  'Access-Control-Allow-Origin': '*',
};

let bodyContent =
  "scope=api://fa3dc8d4-95c4-4503-93cb-174f26a93787/.default&grant_type=client_credentials&client_id=5aeced22-b820-4984-b03a-dc800405bb6f&client_secret=YU78Q~MLw-pfMsrK4vETpO.Dlm.1FgvsJK26Mdm9";

export const getToken = async () => {
  let response = await fetch(
    "https://login.microsoftonline.com/b8fcd764-567f-440d-8c7a-6218dac96c10/oauth2/v2.0/token",
    {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    }
  );

  let data = await response.text();
  console.log(data);
};
