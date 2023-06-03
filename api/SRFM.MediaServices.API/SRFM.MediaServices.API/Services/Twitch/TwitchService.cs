using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SRFM.MediaServices.API.Models.Config;
using SRFM.MediaServices.API.Models.LivePeer;
using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using SRFM.MediaServices.API.Services.Twitch;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;

namespace SRFM.MediaServices.API
{

    public class TwitchService : ITwitchService
    {
        public HttpClient Client { get; }
        private TwitchConfig _twitchConfig;

        public TwitchService(HttpClient client, IOptions<TwitchConfig> options)
        {
            _twitchConfig = options.Value;            
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_twitchConfig.GitHubKey}");
            client.DefaultRequestHeaders.Add("User-Agent", $"{_twitchConfig.GitHubUserAgent}");
            Client = client;
        }

        public bool ValidateEndpoint(string validCode)
        {
            if (!string.IsNullOrEmpty(validCode))
            {

                if (validCode == _twitchConfig.ValidateNodeEndpoint)
                {
                    return true;
                }
            }

            return false;
        }

        public async Task<bool> VerifyRelayM3U8Status(string twitchUrl)
        {
            if (!string.IsNullOrEmpty(twitchUrl))
            {
                HttpResponseMessage response = await Client.GetAsync($"{_twitchConfig.M3U8BaseUrl}?code={_twitchConfig.M3U8Code}&twitch_url={twitchUrl}");

                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return true;
                }
            }

            return false;
        }

        public async Task<string> VerifyRelayM3U8Url(string twitchUrl)
        {
            HttpResponseMessage response = await Client.GetAsync($"{_twitchConfig.M3U8BaseUrl}?code={_twitchConfig.M3U8Code}&twitch_url={twitchUrl}");

            string responseJson = await response.Content.ReadAsStringAsync();

            return responseJson;
        }

        public async Task<HttpResponseMessage> TriggerWrokflow(string twitchUrl, string streamKey)
        {           
            var verifedUrl = await this.VerifyRelayM3U8Url(twitchUrl);

            var jsonObject = new JObject(
                new JProperty("ref", "main"),
                new JProperty("inputs", new JObject(
                    new JProperty("m3u8_url", verifedUrl),
                    new JProperty("livestream_token", streamKey)
                    ))
                );
          
            var payload = new StringContent(jsonObject.ToString(), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await Client.PostAsync($"{_twitchConfig.WorkflowBaseUrl}", payload);

            string responseJson = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<HttpResponseMessage>(responseJson);
        }
    }
}
