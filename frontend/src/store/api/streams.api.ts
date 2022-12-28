import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "store/clientConfig";
export const streamsApi = createApi({
  reducerPath: "streamsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE}`,
  }),
  endpoints: (builder) => ({
    fetchStreamsByWalletId: builder.query<any[], string>({
      query: (walletID) => ({
        url: `Stream/GetStreamsByWalletId/${walletID}`,
        method: "get",
      }),
    }),
    createLiveStream: builder.mutation<any, any>({
      query: ({ walletID, streamName }) => ({
        url: `Stream/CreateStream/${walletID}`,
        method: "post",
        body: {
          streamName: streamName,
        },
      }),
    }),
    suspendLiveStream: builder.mutation<any, any>({
      query: ({ streamId, walletID }) => ({
        url: `Stream/Suspend/${streamId}/${walletID}`,
        method: "put",
      }),
    }),
    unSuspendLiveStream: builder.mutation<any, any>({
      query: ({ streamId, walletID }) => ({
        url: `Stream/UnSuspend/${streamId}/${walletID}`,
        method: "put",
      }),
    }),
  }),
});

export const {
  useFetchStreamsByWalletIdQuery,
  useCreateLiveStreamMutation,
  useSuspendLiveStreamMutation,
  useUnSuspendLiveStreamMutation,
} = streamsApi;
