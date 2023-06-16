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

    fetchAllEndedStreams: builder.query<any, any>({
      query: () => ({
        url: `api/Stream/ListAllEndStream`,
        method: "get",
      }),
    }),
    createLiveStream: builder.mutation<any, any>({
      query: ({ walletID, streamValues }) => {
        const {
          name,
          streamStartDate,
          streamEndDate,
          streamType,
          cost,
          vaultContractId,
          VId,
          relayUrl,
          relayUrlIsVerified
        } = streamValues;
        return {
          url: `api/Stream/CreateStream`,
          method: "POST",
          prepareHeaders: (headers: any) => {
            const jwtToken = localStorage.getItem("token");
            headers.set("Authorization", `Bearer ${jwtToken}`);
            return headers;
          },
          data: {
            name: name,
            relayUrl: relayUrl,
            steamLP: {},
            streamType: streamType,
            VId: VId ? VId : "",
            WalletId: walletID,
            streamDuration: "",
            streamStartDate: streamStartDate.toISOString(),
            streamEndDate: streamEndDate.toISOString(),
            relayUrlIsVerified: relayUrlIsVerified,
            attendees: "" + 1,
            cost: "" + cost,
            vaultContractId: "" + vaultContractId,
          },
        };
      },
    }),
    editStream: builder.mutation<any, any>({
      query: ({ streamValues }) => {
        const {
          name,
          streamStartDate,
          streamEndDate,
          cost,
          streamID,
        } = streamValues;
        return {
          url: `api/Stream/UpdateStream`,
          method: "PATCH",
          prepareHeaders: (headers: any) => {
            const jwtToken = localStorage.getItem("token");
            headers.set("Authorization", `Bearer ${jwtToken}`);
            return headers;
          },
          data: {
            StreamID: streamID,
            Name: name,
            Cost: cost,
            StreamStartDate: streamStartDate,
            StreamEndDate: streamEndDate,
            Attendees:"1",
          },
        };
      },
    }),
  
    deleteStream: builder.mutation<any, any>({
      query: ({ streamId }) => ({
        url: `api/Stream/DeleteStreamByStreamId/${streamId}`,
        method: "delete",
        prepareHeaders: (headers: any) => {
          const jwtToken = localStorage.getItem("token");
          headers.set("Authorization", `Bearer ${jwtToken}`);
          return headers;
        },
      }),
    }),
    markPulledStreams: builder.mutation<any, any>({
      query: (body) => ({
        url: `api/Stream/UpdateStreamsIsPulled?isPulled=true`,
        method: "PATCH",
        data: body.streamsIds,
        prepareHeaders: (headers: any) => {
          const jwtToken = localStorage.getItem("token");
          headers.set("Authorization", `Bearer ${jwtToken}`);
          return headers;
        },
      }),
    }),
    verifyRelayLink: builder.query<any, any>({
      query: (body) => ({
        url: `api/Stream/VerifyM3U8Url`,
        method: "POST",
        prepareHeaders: (headers: any) => {
          const jwtToken = localStorage.getItem("token");
          headers.set("Authorization", `Bearer ${jwtToken}`);
          return headers;
        },
        data: body,
      }),
    }),
  }),
});

export const {
  useFetchStreamsByWalletIdQuery,
  useCreateLiveStreamMutation,
  useFetchAllEndedStreamsQuery,
  useDeleteStreamMutation,
  useFetchStreamDetailsQuery,
  useEditStreamMutation,
  useMarkPulledStreamsMutation,
  useLazyVerifyRelayLinkQuery,
} = streamsApi;
