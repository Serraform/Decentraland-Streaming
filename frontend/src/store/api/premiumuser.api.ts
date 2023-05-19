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
        url: `api/User/ListPremiumUsers/${walletID}`,
        method: "get",
      }),
    }),
    updateUserPremium: builder.mutation<any, any>({
      query: ({ walletID, userWalletId, discount }) => {
        return {
          url: `api/User/HandlePremiumUserData/${walletID}`,
          method: "PUT",
          data: {
            walletId: userWalletId,
            discount: discount,
            isPremium: true,
          },
          prepareHeaders: (headers: any) => {
            const jwtToken = localStorage.getItem("token");
            headers.set("Authorization", `Bearer ${jwtToken}`);
            return headers;
          },
        };
      },
    }),
  }),
});

export const { useFetchListUsersPremiumQuery, useUpdateUserPremiumMutation } =
  premiumUsersApi;
