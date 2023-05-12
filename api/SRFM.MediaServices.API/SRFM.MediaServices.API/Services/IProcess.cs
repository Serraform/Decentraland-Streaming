using SRFM.MediaServices.API.Models.LivePeer;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public interface IProcess
    {       

        public Task<UserDB> GetUserByWalletId(string WalletId);

        public Task<List<UserDB>> ListUsers();

        public Task<List<UserDB>> ListByFlagItemsAsync(string columnName, bool flag);

        public Task<object> CreateNewUser(UserDB userProps);

        public Task<object> UpdateUser(UserDB userProps);

        public Task<object> DeleteUser(UserDB userProps);     

        public Task GetLivePeerAssets();

        public Task<List<AssetDB>> ListAssets();

        public Task<object> SaveNewStream(StreamDB streamName);

        public Task<List<AssetDB>> GetAssetByWalletId(string WalletId);

        public Task<AssetDB> GetAssetByAssetId(string assetId);

        public Task<RequestUpload> RequestUploadURL(string fileName,string walletId);

        public Task<AssetStatusLP> GetAssetUploadStatus(string assetId);

        public Task<object> DeleteAsset(AssetDB assetProps);

        public Task<List<StreamDB>> ListStream();

        public Task<List<StreamDB>> ListIsActiveItemsAsync(bool isActive);

        public Task<HttpResponseMessage> SuspendStream(string streamId, string walletId);

        public Task<HttpResponseMessage> UnSuspendStream(string streamId, string walletId);

        public Task<StreamLP> CreateNewStream(StreamDB streamName);

        public Task<object> UpdateStream(StreamDB streamProps);

        public Task<object> UpdateStreamsIsPulled(List<string> streamIds, bool isPulled);

        public Task<object> DeleteStream(StreamDB streamProps);

        public Task<StreamDB> GetStreamByStreamId(string StreamId);

        public Task<List<StreamDB>> GetStreamsByWalletId(string WalletId);

        public Task<List<StreamLP>> GetStreamSessionByStreamId(string StreamId);

    }
}