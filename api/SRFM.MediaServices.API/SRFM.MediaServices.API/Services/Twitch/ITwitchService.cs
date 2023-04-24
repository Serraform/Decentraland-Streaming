using System.Net.Http;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API.Services.Twitch
{
    public interface ITwitchService
    {
        public Task<bool> VerifyRelayM3U8Status(string twitchUrl);

        public Task<HttpResponseMessage> TriggerWrokflow(string payload, string streamKey);
    }
}
