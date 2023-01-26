﻿using Azure;
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
        [Route("CreateStream")]
        public async Task<HttpResponseMessage> CreateStream(StreamDB streamProps)
        {
            if (streamProps != null)
            {
                if (string.IsNullOrEmpty(streamProps.Name) || string.IsNullOrEmpty(streamProps.WalletId))
                {
                    throw new CustomException("Name Required");
                }
                try
                {                  

                    var response = await _process.CreateNewStream(streamProps);

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

        [HttpPut]
        [Route("ExtendStream/{streamId}/{walletId}/{streamStartDate}/{streamEndDate}")]
        public async Task<HttpResponseMessage> ExtendStream(string streamId, string walletId, DateTime streamStartDate, DateTime streamEndDate)
        {

            StreamDB getStream = await _process.GetStreamByStreamId(streamId);

            if (getStream != null)
            {
                getStream.StreamStartDate = streamStartDate;
                getStream.StreamEndDate = streamEndDate;

                var response = await _process.UpdateStream(getStream);

                string jsonString = JsonSerializer.Serialize(response);
                return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };
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
        [Route("CalculateStreamCost/{streamStartDate}/{streamEndDate}")]
        public async Task<StreamCost> CalculateStreamCost(DateTime streamStartDate, DateTime streamEndDate)
        {
            TimeSpan ts = streamEndDate - streamStartDate;

            var cost= String.Concat(ts.Hours,".", ts.Minutes);

            var number = Math.Ceiling(Convert.ToDecimal(cost));
            
            StreamCost streamCost = new StreamCost { Cost = number.ToString() };
            return streamCost;
        }

        [HttpGet]
        [Route("GetStreamByWalletId/{walletId}")]
        public async Task<IEnumerable<StreamDB>> GetStreamByWalletId(string walletId)
        {          
            var streams = await _process.GetStreamsByWalletId(walletId);
            return streams;
        }

        [HttpGet]
        [Route("GetStreamByStreamId/{streamId}")]
        public async Task<StreamDB> GetStreamByStreamId(string streamId)
        {           
            var streams = await _process.GetStreamByStreamId(streamId);
            return streams;
        }


        [HttpGet]
        [Route("GetStreamSessionByStreamId/{streamId}")]
        public async Task<List<StreamLP>> GetStreamSessionByStreamId(string streamId)
        {            
            var streams = await _process.GetStreamSessionByStreamId(streamId);
            return streams;
        }

    }
}
