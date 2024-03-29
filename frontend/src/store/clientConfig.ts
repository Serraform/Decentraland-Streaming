import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";

const jwtToken = localStorage.getItem("token");

export const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE}`,
  timeout: 50000,
  headers: {
    Authorization: `Bearer ${jwtToken}`,
    "content-type": "application/json",
  },
});

window.addEventListener("storage", () => {
  const jwtToken = localStorage.getItem("token");
  client.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
});

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const jwtToken = localStorage.getItem("token");
      const result = await client({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
