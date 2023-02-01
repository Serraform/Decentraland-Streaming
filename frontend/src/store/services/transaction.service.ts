import {client} from "store/clientConfig";


export const fetchCostService = async (streamStartDate: string, streamEndDate: string) => {
  return await client.get(`/api/Stream/CalculateStreamCost/${streamStartDate}/${streamEndDate}`);
};