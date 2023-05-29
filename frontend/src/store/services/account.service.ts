import { client } from "store/clientConfig";
export const createAccount = async (walletID: string, authToken: string) => {
  return await client.post(
    "/api/User/CreateUser",
    {
      WalletId: walletID,
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
};

export const updateAccount = async ({ walletID, Role }: any) => {
  const jwtToken = localStorage.getItem("token");
  client.defaults.headers.common["Authorization"] = "Bearer " + jwtToken;
  return await client.put(
    "/api/User/UpdateUser",
    {
      WalletId: walletID,
      Role: Role,
    },
    {
      headers: { Authorization: `Bearer ${jwtToken}` },
    }
  );
};

export const getAccountDetailsByWalletId = async (walletID: string) => {
  const jwtToken = localStorage.getItem("token");
  client.defaults.headers.common["Authorization"] = "Bearer " + jwtToken;
  return await client.get(`/api/User/GetUserDetailsByWalletId/${walletID}`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
};

export const getSignatureChallenge = async (
  walletID: string,
  network: string,
  chainId: string
) => {
  return await client.post(`/Authentication/${walletID}/0/${chainId}`);
};

export const verifySignature = async (body: any) => {
  return await client.post(`/Authentication/verify/0`, body);
};
