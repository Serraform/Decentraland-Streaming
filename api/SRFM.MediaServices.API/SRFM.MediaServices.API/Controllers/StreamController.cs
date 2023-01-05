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
    [Authorize]
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
        public async Task<HttpResponseMessage> CreateStream(StreamDB streamProps, string walletId)
        {
            if (streamProps != null)
            {
                if (string.IsNullOrEmpty(streamProps.Name))
                {
                    throw new CustomException("Name Required");
                }
                try
                {
                    streamProps.StreamLP = new StreamLP { Name = streamProps.Name };

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

        [HttpDelete]
        [Route("DeleteStreamByStreamId/{streamId}")]
        public async Task<IActionResult> DeleteStreamByStreamId(string streamId)
        {
            // Add new userDB object to Table Storage >> need to check Status code 201/204 by "Prefer header"

            StreamDB stream = await _process.GetStreamByStreamId(streamId);

            if (stream != null)
            {
                stream.Active = false;
                var statusCode = await _process.DeleteStream(stream);
                var ret = new ObjectResult(statusCode) { StatusCode = StatusCodes.Status204NoContent };
                return ret;

            }
            throw new CustomException("Stream id not correct");
        }

        [HttpGet]
        [Route("GetStreamByWalletId/{walletId}")]
        public async Task<IEnumerable<StreamDB>> GetStreamByWalletId(string walletId)
        {
            // query TableStorage - Asset Table to get all assets by walletId
            var streams = await _process.GetStreamsByWalletId(walletId);
            return streams;
        }

    }
}
