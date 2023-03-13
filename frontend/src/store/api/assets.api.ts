import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "store/clientConfig";
import { IAsset } from "components/stream/definitions";
export const assetsApi = createApi({
  reducerPath: "assetsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE}`,
  }),
  endpoints: (builder) => ({
    fetchAssetsByWalletId: builder.query<IAsset[], string>({
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
    fetchAssetStatus: builder.query<any[], string>({
      query: (assetID) => ({
        url: `api/Asset/GetAssetStatus/${assetID}`,
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
  useFetchAssetStatusQuery
} = assetsApi;
