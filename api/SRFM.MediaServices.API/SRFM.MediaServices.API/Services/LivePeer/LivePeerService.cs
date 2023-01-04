using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SRFM.MediaServices.API.Models.LivePeer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API.Services.LivePeer
{
    //ref : https://www.assemblyai.com/blog/getting-started-with-httpclientfactory-in-c-sharp-and-net-5/
    public class LivePeerService
    {
        public HttpClient Client { get; }
        private LivePeerConfig _livepeerConfig;

        public LivePeerService(HttpClient client, IOptions<LivePeerConfig> options)
        {
            _livepeerConfig = options.Value;
            client.BaseAddress = new Uri(_livepeerConfig.BaseAddress);
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_livepeerConfig.ApiKey}");
            Client = client;
        }

        public async Task<RequestUpload> RequestUploadURI(StringContent payload)
        {           

            HttpResponseMessage response = await Client.PostAsync("asset/request-upload", payload);

            string responseJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<RequestUpload>(responseJson);
        }

        public async Task<AssetStatusLP> GetUploadStatus(string assetId)
        {

            HttpResponseMessage response = await Client.GetAsync($"asset/{assetId}");

            string responseJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<AssetStatusLP>(responseJson);
        }

        public async Task<HttpResponseMessage> PatchStream(string streamId, StringContent payload)
        {

            HttpResponseMessage response = await Client.PatchAsync($"stream/{streamId}",payload);

            return response;

           // string responseJson = await response.Content.ReadAsStringAsync();

          //  return JsonConvert.DeserializeObject<AssetStatusLP>(responseJson);
        }

        public async Task<StreamLP> CreateNewStream(StringContent payload)
        {

            HttpResponseMessage response = await Client.PostAsync("stream", payload);

            string responseJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<StreamLP>(responseJson);
        }

        public async Task<HttpResponseMessage> DeleteStream(string streamId)
        {
            HttpResponseMessage response = await Client.DeleteAsync($"stream/{streamId}");

            return response;
        }




    }
}
