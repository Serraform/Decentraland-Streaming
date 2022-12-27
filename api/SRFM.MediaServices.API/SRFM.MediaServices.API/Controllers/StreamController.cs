using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SRFM.MediaServices.API.Models.LivePeer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StreamController : ControllerBase
    {
        private readonly IProcess _process;
        private readonly ILogger<StreamController> _logger;

        public StreamController(IProcess process, ILogger<StreamController> logger)
        {
            _process = process;
            _logger = logger;
        }

        [HttpPut]
        [Route("Suspend/{streamId}/{walletId}")]
        public async Task<HttpResponseMessage> SuspendStream(string streamId, string walletId, [FromBody] StreamLPStatus value)
        {
            var response = await _process.SuspendStream(streamId, walletId);
            return response;
        }

        [HttpPut]
        [Route("UnSuspend/{streamId}/{walletId}")]
        public async Task<HttpResponseMessage> UnSuspendStream(string streamId, string walletId, [FromBody] StreamLPStatus value)
        {
            var response = await _process.UnSuspendStream(streamId, walletId);
            return response;
        }

        [HttpPost]
        [Route("CreateStream/{walletId}")]
        public async Task<HttpResponseMessage> CreateStream([FromBody] StreamLP streamProps, string walletId)
        {
            if (streamProps != null)
            {
                if (string.IsNullOrEmpty(streamProps.Name))
                {
                    throw new CustomException("Name Required");
                }
                try
                {
                    var response = await _process.CreateNewStream(streamProps, walletId);

                    string jsonString = JsonSerializer.Serialize(response);
                    return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };

                }
                catch (Exception ex)
                {
                    return new HttpResponseMessage(HttpStatusCode.InternalServerError);
                }
            }
            throw new CustomException("Stream inputs Required");

        }

        [HttpGet]
        [Route("GetStreamsByWalletId/{walletId}")]
        public async Task<IEnumerable<StreamDB>> GetAssetsByWalletId(string walletId)
        {
            // query TableStorage - Asset Table to get all assets by walletId
            var streams = await _process.GetStreamsByWalletId(walletId);
            return streams;

            //  return new List<AssetDB>() { new AssetDB() { AssetId = "MyAssetId", WalletId = "xyzabc" } };
        }

    }
}
