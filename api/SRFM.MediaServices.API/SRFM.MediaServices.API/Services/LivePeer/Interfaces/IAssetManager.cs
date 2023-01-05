using SRFM.MediaServices.API.Models.LivePeer;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public interface IAssetManager
    {
        public Task GetAssets<T>(string query);

        public Task<RequestUpload> RequestUploadURL(string fileName);

        public Task<AssetStatusLP> GetAssetUploadStatus(string assetId);

        public Task<HttpResponseMessage> SuspendStream(string streamId);

        public Task<HttpResponseMessage> UnSuspendStream(string streamId);

        public Task<StreamLP> CreateNewStream(StreamLP streamProps);

        public Task<HttpResponseMessage> DeleteStream(string streamId);
    }
}