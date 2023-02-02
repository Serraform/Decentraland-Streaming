import {client} from "store/clientConfig";
export const createAccount = async (walletID: string, authToken: string) => {
  return await client.post("/api/User/CreateUser", {
    walletID: walletID
  }, {
    headers:{ "Authorization": `Bearer ${authToken}`}
  });
};

export const getAccountDetailsByWalletId = async (walletID: string) => {
  return await client.get(`/api/User/GetUserDetailsByWalletId/${walletID}`);
};

export const getSignatureChallenge = async (walletID: string, network:string, chainId:string) => {
  return await client.post(`/Authentication/${walletID}/0/${chainId}`);
};


export const verifySignature = async (body: any) => {
  return await client.post(`/Authentication/verify/0`, body)
}