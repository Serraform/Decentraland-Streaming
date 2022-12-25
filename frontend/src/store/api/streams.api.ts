import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "store/clientConfig";
export const streamsApi = createApi({
  reducerPath: "streamsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE}Asset`,
  }),
  endpoints: (builder) => ({
    fetchStreamsByWalletId: builder.query<any[], string>({
      query: (walletID) => ({
        url: `/GetAssetsByWalletId/${walletID}`,
        method: "get",
      }),
    }),
  }),
});

export const { useFetchStreamsByWalletIdQuery } = streamsApi;
