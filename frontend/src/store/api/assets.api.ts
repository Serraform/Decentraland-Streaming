import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "store/clientConfig";
export const assetsApi = createApi({
  reducerPath: "assetsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE}`,
  }),
  endpoints: (builder) => ({
    fetchAssetsByWalletId: builder.query<any[], string>({
      query: (walletID) => ({
        url: `api/Asset/GetAssetsByWalletId/${walletID}`,
        method: "get",
      }),
    }),
    fetchAssetDetails: builder.query<any[], string>({
      query: (assetID) => ({
        url: `api/Asset/GetAssetByAssetId/${assetID}`,
        method: "get",
      }),
    }),
    requestAssetUploader: builder.query<any, any>({
      query: ({ walletID, assetName }) => ({
        url: `api/Asset/RequestUploadURL/${assetName}/${walletID}`,
        method: "get",
      }),
    }),
  }),
});

export const {
  useFetchAssetsByWalletIdQuery,
  useRequestAssetUploaderQuery,
  useFetchAssetDetailsQuery,
} = assetsApi;
