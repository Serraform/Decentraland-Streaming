using Microsoft.Extensions.Options;
using Moralis.AuthApi.Models;
using Newtonsoft.Json;
using SRFM.MediaServices.API.Models.LivePeer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API.Services.Moralis
{
    public class MoralisService : IMoralisService
    {
        public HttpClient Client { get; }
        private MoralisConfig _moralisConfig;

        public MoralisService(HttpClient client, IOptions<MoralisConfig> options)
        {
            _moralisConfig = options.Value;
            client.BaseAddress = new Uri(_moralisConfig.BaseUrl);
            client.DefaultRequestHeaders.Add("X-API-Key", $"{_moralisConfig.ApiKey}");
            Client = client;
        }

        public async Task<ChallengeResponseDto> RequestEVM(StringContent payload)
        {

            HttpResponseMessage response = await Client.PostAsync("request/evm", payload);

            string responseJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<ChallengeResponseDto>(responseJson);
        }

        public async Task<CompleteChallengeResponseDto> VerifyEVM(StringContent payload)
        {

            HttpResponseMessage response = await Client.PostAsync("verify/evm", payload);

            string responseJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<CompleteChallengeResponseDto>(responseJson);
        }
    }
}
