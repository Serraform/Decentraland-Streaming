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
        url: `api/Stream/GetStreamByWalletId/${walletID}`,
        method: "get",
      }),
    }),
    fetchStreamDetails: builder.query<any[], string>({
      query: (streamID) => ({
        url: `api/Stream/GetStreamByStreamId/${streamID}`,
        method: "get",
      }),
    }),
    createLiveStream: builder.mutation<any, any>({
      query: ({ walletID, streamValues }) => {
        const { name, attendees, streamStartDate, streamEndDate, streamType, cost, vaultContractId } =
          streamValues;
        return {
          url: `api/Stream/CreateStream`,
          method: "POST",
          data: {
            name: name,
            steamLP: {},
            streamType: streamType,
            WalletId: walletID,
            streamDuration: "",
            streamStartDate: streamStartDate.toISOString(),
            streamEndDate: streamEndDate.toISOString(),
            attendees: attendees,
            cost: ""+cost,
            vaultContractId: ""+vaultContractId
          },
        };
      },
    }),
   editStream: builder.mutation<any, any>({
      query: ({ streamValues }) => {
        
        const { name, attendees, streamStartDate, streamEndDate, cost, streamID } = streamValues;
        return {
          url: `api/Stream/UpdateStream`,
          method: "PATCH",
          data: {
            StreamID: streamID,
            Name: name,
            Cost: cost,
            StreamStartDate: streamStartDate,
            StreamEndDate: streamEndDate,
            Attendees: attendees,
          },
        };
      },
    }),
    suspendLiveStream: builder.mutation<any, any>({
      query: ({ streamId, walletID }) => ({
        url: `api/Stream/Suspend/${streamId}/${walletID}`,
        method: "put",
      }),
    }),
    unSuspendLiveStream: builder.mutation<any, any>({
      query: ({ streamId, walletID }) => ({
        url: `api/Stream/UnSuspend/${streamId}/${walletID}`,
        method: "put",
      }),
    }),
    deleteStream: builder.mutation<any, any>({
      query: ({ streamId }) => ({
        url: `api/Stream/DeleteStreamByStreamId/${streamId}`,
        method: "delete",
      }),
    }),
  }),
});

export const {
  useFetchStreamsByWalletIdQuery,
  useCreateLiveStreamMutation,
  useSuspendLiveStreamMutation,
  useUnSuspendLiveStreamMutation,
  useDeleteStreamMutation,
  useFetchStreamDetailsQuery,
  useEditStreamMutation
} = streamsApi;
