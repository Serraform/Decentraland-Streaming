import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "store/clientConfig";
export const premiumUsersApi = createApi({
  reducerPath: "premiumUsersApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE}`,
  }),
  endpoints: (builder) => ({
    fetchListUsersPremium: builder.query<any[], string>({
      query: (walletID) => ({
        url: `api/User/ListUsersPremium/${walletID}`,
        method: "get",
      }),
    }),
    addUserPremium: builder.mutation<any, any>({
      query: ({ walletID, userWalletId, discount }) => {
       
        return {
          url: `api/Stream/AddPremiumUser/${walletID}`,
          method: "POST",
          data: {
            walletIDPremiumUser: userWalletId,
            discount: discount,
          },
        };
      },
    }),
    editUserPremium: builder.mutation<any, any>({
        query: ({ walletID, userWalletId, discount }) => {
         
          return {
            url: `api/Stream/EditPremiumUser/${walletID}`,
            method: "PATCH",
            data: {
              walletIDPremiumUser: userWalletId,
              discount: discount,
            },
          };
        },
      }),
  }),
});

export const {
  useFetchListUsersPremiumQuery,
  useAddUserPremiumMutation,
  useEditUserPremiumMutation,
} = premiumUsersApi;
