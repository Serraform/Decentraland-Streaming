using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SRFM.MediaServices.API.Models.LivePeer;
using SRFM.MediaServices.API.Services.LivePeer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class AssetManager : IAssetManager
    {
        private LivePeerConfig _livepeerConfig;
        private ILogger<AssetManager> _logger;
        private readonly LivePeerService _livePeerService;

        public AssetManager(IOptions<LivePeerConfig> options, ILogger<AssetManager> logger, LivePeerService livePeerService)
        {
            _livepeerConfig = options.Value;
            _logger = logger;
            _livePeerService = livePeerService;
        }


        public async Task GetAssets<T>(string query)
        {
            var apikey = _livepeerConfig.ApiKey;
        }

        public async Task<RequestUpload> RequestUploadURL(string fileName)
        {
            var json = new
            {
                name = fileName
            };

            string jsonString = JsonSerializer.Serialize(json);
            var payload = new StringContent(jsonString, Encoding.UTF8, "application/json");

            return await _livePeerService.RequestUploadURI(payload);
        }

        public async Task<HttpResponseMessage> SuspendStream(string streamId)
        {
            var json = new
            {
                suspended = true
            };

            string jsonString = JsonSerializer.Serialize(json);
            var payload = new StringContent(jsonString, Encoding.UTF8, "application/json");

            return await _livePeerService.PatchStream(streamId,payload);
        }

        public async Task<HttpResponseMessage> UnSuspendStream(string streamId)
        {
            var json = new
            {
                suspended = false
            };

            string jsonString = JsonSerializer.Serialize(json);
            var payload = new StringContent(jsonString, Encoding.UTF8, "application/json");

            return await _livePeerService.PatchStream(streamId, payload);
        }

        public async Task<StreamLP> CreateNewStream(StreamLP streamProps)
        {
            string jsonString = JsonSerializer.Serialize(streamProps);

            var payLoadStream = new
            {
                name = streamProps.Name
            };


            var payload = new StringContent(JsonSerializer.Serialize(payLoadStream), Encoding.UTF8, "application/json");

            return await _livePeerService.CreateNewStream(payload);
        }

        public async Task<AssetStatusLP> GetAssetUploadStatus(string assetId)
        {           
            return await _livePeerService.GetUploadStatus(assetId);
        }

        public async Task<HttpResponseMessage> DeleteStream(string streamId)
        {
            return await _livePeerService.DeleteStream(streamId);
        }
            // live peer operations here.




        }
}
