﻿using SRFM.MediaServices.API.Models.LivePeer;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public interface IProcess
    {
        public Task<List<AssetDB>> GetAssetByWalletId(string WalletId);

        public Task<List<StreamDB>> GetStreamsByWalletId(string WalletId);

        public Task<UserDB> GetUserByWalletId(string WalletId);

        public Task<object> CreateNewUser(UserDB userProps);

        public Task<object> UpdateUser(UserDB userProps);

        public Task<object> DeleteUser(UserDB userProps);

        public Task GetLivePeerAssets();

        public Task<RequestUpload> RequestUploadURL(string fileName,string walletId);

        public Task<AssetStatusLP> GetAssetUploadStatus(string assetId);

        public Task<HttpResponseMessage> SuspendStream(string streamId, string walletId);

        public Task<HttpResponseMessage> UnSuspendStream(string streamId, string walletId);

        public Task<StreamLP> CreateNewStream(StreamLP streamProps, string walletId);

    }
}