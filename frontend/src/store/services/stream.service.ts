import {client} from "store/clientConfig";


export const fetchStreamsService = async (walletID: string) => {
  return await client.get(`/api/Asset/GetAssetsByWalletId/${walletID}`);
};