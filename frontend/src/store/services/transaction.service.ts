import {client} from "store/clientConfig";


export const fetchCostService = async (streamStartDate: string, streamEndDate: string) => {
  const jwtToken = localStorage.getItem("token");
  client.defaults.headers.common['Authorization'] =  "Bearer " +  jwtToken;
  return await client.get(`/api/Stream/CalculateStreamCost/${streamStartDate}/${streamEndDate}`);
};