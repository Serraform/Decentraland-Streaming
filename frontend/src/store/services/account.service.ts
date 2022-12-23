import client from "store/clientConfig";
export const createAccount = async (walletID: string) => {
  return await client.post("/User/CreateUser", {
    walletID: walletID
  });
};

export const getAccountDetailsByWalletId = async (walletID: string) => {
  return await client.get(`/User/GetUserDetailsByWalletId/${walletID}`);
};
