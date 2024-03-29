﻿using Azure;
using JwtServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SRFM.MediaServices.API.Models.LivePeer;
using SRFM.MediaServices.API.Services.Twitch;
using System;
using System.Collections.Generic;
using System.IO;
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
        private readonly ITwitchService _twitch;
        private readonly ILogger<StreamController> _logger;

        public StreamController(IProcess process, ITwitchService twitch, ILogger<StreamController> logger)
        {
            _process = process;
            _twitch = twitch;
            _logger = logger;
        }    

        [HttpGet]
        [Route("ListAllEndStream")]
        public async Task<List<StreamDB>> ListAllEndStream(DateTime? startDate, DateTime? endDate)
        { 
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                List<StreamDB> filteredResultsTwo = null; ;

                List<StreamDB> streams = await _process.ListStreamIsActiveItemsAsync(true);

                if (startDate == null && endDate == null)
                {
                    filteredResultsTwo = streams.Where(stream => stream.StreamEndDate <= DateTime.UtcNow).ToList();
                }
                else
                {
                    filteredResultsTwo = streams.Where(stream => stream.StreamEndDate >= startDate && stream.StreamEndDate <= endDate).ToList();
                }

                return filteredResultsTwo;
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpPost]
        [Route("VerifyM3U8Url")]
        public async Task<bool> VerifyM3U8Url([FromBody]string twitchUrl)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                var response = await _twitch.VerifyRelayM3U8Status(twitchUrl);
                return response;
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpPost]
        [Route("TriggerWrokflow/{twitchUrl}/{streamKey}")]
        public async Task<HttpResponseMessage> TriggerWrokflow(string twitchUrl,string streamKey)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                var response = await _twitch.TriggerWrokflow(twitchUrl, streamKey);

                string jsonString = JsonSerializer.Serialize(response);
                return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpPut]
        [Route("Suspend/{streamId}/{walletId}")]
        public async Task<HttpResponseMessage> SuspendStream(string streamId, string walletId, [FromBody] StreamLPStatus value)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                var response = await _process.SuspendStream(streamId, walletId);
                return response;
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpPut]
        [Route("UnSuspend/{streamId}/{walletId}")]
        public async Task<HttpResponseMessage> UnSuspendStream(string streamId, string walletId, [FromBody] StreamLPStatus value)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                var response = await _process.UnSuspendStream(streamId, walletId);
                return response;
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpPost]
        [Route("CreateStream")]
        public async Task<HttpResponseMessage> CreateStream(StreamDB streamProps)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);


            if (isValidToken)
            {
                if (streamProps != null)
                {
                    if (string.IsNullOrEmpty(streamProps.Name) || string.IsNullOrEmpty(streamProps.WalletId))
                    {
                        throw new CustomException("Name Required");
                    }
                    try
                    {

                        if (streamProps.StreamType == StreamType.vod.ToString())
                        {
                            AssetDB getAsset = await _process.GetAssetByAssetId(streamProps.VId);

                            if (getAsset != null)
                            {
                                var guid = Guid.NewGuid().ToString();

                                streamProps.PlayBackId = getAsset.PlayBackId;
                                streamProps.StreamID = guid;
                                streamProps.RowKey = guid;

                                var response = await _process.SaveNewStream(streamProps);

                                string jsonString = JsonSerializer.Serialize(response);
                                return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };
                            }
                            else
                            {
                                throw new CustomException("Asset is not found");
                            }
                        }
                        else if (streamProps.StreamType == StreamType.relayService.ToString())
                        {
                            ////var m3u8Status = await _twitch.VerifyRelayM3U8Status(System.Web.HttpUtility.UrlEncode(streamProps.relayUrl));

                            //if (m3u8Status)
                            //{
                            //    var guid = Guid.NewGuid().ToString();

                            //    streamProps.StreamID = guid;
                            //    streamProps.RowKey = guid;

                            //    streamProps.relayUrlIsVerified = true;
                            //    var response = await _process.SaveNewStream(streamProps);

                            //    string jsonString = JsonSerializer.Serialize(response);
                            //    return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };
                            //}
                            //else
                            //{
                                //var guid = Guid.NewGuid().ToString();

                                //streamProps.StreamID = guid;
                                //streamProps.RowKey = guid;
                                //streamProps.relayUrlIsVerified = false;

                                var response = await _process.CreateNewStream(streamProps);

                                string jsonString = JsonSerializer.Serialize(response);
                                return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };
                           // }
                        }
                        else
                        {

                            var response = await _process.CreateNewStream(streamProps);

                            string jsonString = JsonSerializer.Serialize(response);
                            return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };
                        }
                    }
                    catch (Exception ex)
                    {
                        return new HttpResponseMessage(HttpStatusCode.InternalServerError);
                    }
                }
                throw new CustomException("Stream inputs Required");
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpPut]
        [Route("ExtendStream/{streamId}/{walletId}/{streamStartDate}/{streamEndDate}")]
        public async Task<HttpResponseMessage> ExtendStream(string streamId, string walletId, DateTime streamStartDate, DateTime streamEndDate)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
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
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpPatch]
        [Route("UpdateStream")]
        public async Task<HttpResponseMessage> UpdateStream(StreamDB streamProps)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                StreamDB getStream = await _process.GetStreamByStreamId(streamProps.StreamID);

                if (getStream != null)
                {
                    getStream.Name = streamProps.Name;
                    getStream.StreamStartDate = streamProps.StreamStartDate;
                    getStream.StreamEndDate = streamProps.StreamEndDate;
                    getStream.StreamDuration = streamProps.StreamDuration;
                    getStream.Cost = streamProps.Cost;
                    getStream.Attendees = streamProps.Attendees;                    

                    var response = await _process.UpdateStream(getStream);

                    string jsonString = JsonSerializer.Serialize(response);
                    return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };
                }
                throw new CustomException("Stream inputs Required");
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpDelete]
        [Route("DeleteStreamByStreamId/{streamId}")]
        public async Task<HttpResponseMessage> DeleteStreamByStreamId(string streamId)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                // Add new userDB object to Table Storage >> need to check Status code 201/204 by "Prefer header"

                StreamDB stream = await _process.GetStreamByStreamId(streamId);

                if (stream != null)
                {
                    stream.Active = false;
                    var response = await _process.DeleteStream(stream);
                    
                    string jsonString = JsonSerializer.Serialize(response);
                    return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };

                }
                throw new CustomException("Stream id not correct");
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpPatch]
        [Route("UpdateStream/{vaultContractId}")]
        public async Task<HttpResponseMessage> UpdateStreamByVaultContractId(string vaultContractId, StreamDB streamProps)
        {
            //var url = Request.Scheme + "://" + Request.Host.Value;
            var qsCode = Request.QueryString.Value;

            if (_twitch.ValidateEndpoint(qsCode))
            {
                if (vaultContractId != null)
                {
                    StreamDB getStream = await _process.GetStreamByVaultContractId(vaultContractId);

                    if (getStream != null)
                    {
                        //getStream.Name = streamProps.Name;
                        getStream.StreamStartDate = streamProps.StreamStartDate;
                        getStream.StreamEndDate = streamProps.StreamEndDate;
                        getStream.StreamDuration = streamProps.StreamDuration;
                        getStream.Cost = streamProps.Cost;
                        getStream.Attendees = streamProps.Attendees;

                        var response = await _process.UpdateStream(getStream);

                        string jsonString = JsonSerializer.Serialize(response);
                        return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };
                    }
                    throw new CustomException("Stream inputs Required");
                }
                throw new CustomException("vaultContractId Required");
            }
            throw new CustomException("Token not valid.");
        }


        [HttpDelete]
        [Route("DeleteStreamByVaultContractId/{vaultContractId}")]
        public async Task<HttpResponseMessage> DeleteStreamByVaultContractId(string vaultContractId)
        {
            //var url = Request.Scheme + "://" + Request.Host.Value;
            var qsCode = Request.QueryString.Value;

            if (_twitch.ValidateEndpoint(qsCode))
            {
                if (vaultContractId != null)
                {
                    StreamDB stream = await _process.GetStreamByVaultContractId(vaultContractId);

                    if (stream != null)
                    {
                        stream.Active = false;
                        var response = await _process.DeleteStream(stream);

                        string jsonString = JsonSerializer.Serialize(response);
                        return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };

                    }
                    throw new CustomException("Stream id not correct");
                }
                throw new CustomException("vaultContractId Required");
            }
            throw new CustomException("Token not valid.");
        }

        [HttpGet]
        [Route("CalculateStreamCost/{streamStartDate}/{streamEndDate}")]
        public async Task<StreamCost> CalculateStreamCost(DateTime streamStartDate, DateTime streamEndDate)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                TimeSpan ts = streamEndDate - streamStartDate;

                var number = Math.Ceiling(ts.TotalHours);

                var vaultId = new Random().Next(0, 999999).ToString();
                vaultId = string.Concat(streamStartDate.ToString("yyyyMMddmmss"), vaultId);

                StreamCost streamCost = new StreamCost { Cost = number.ToString(), VaultContractId = vaultId };
                return streamCost;

            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpGet]
        [Route("GetStreamByWalletId/{walletId}")]
        public async Task<IEnumerable<StreamDB>> GetStreamByWalletId(string walletId)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                var streams = await _process.GetStreamsByWalletId(walletId.ToLower());
                return streams;
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpGet]
        [Route("GetStreamByStreamId/{streamId}")]
        public async Task<StreamDB> GetStreamByStreamId(string streamId)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                var streams = await _process.GetStreamByStreamId(streamId);
                return streams;
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }


        [HttpGet]
        [Route("GetStreamSessionByStreamId/{streamId}")]
        public async Task<List<StreamLP>> GetStreamSessionByStreamId(string streamId)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                var streams = await _process.GetStreamSessionByStreamId(streamId);
                return streams;
            }
            else
            {
                throw new CustomException("Token not valid.");
            }
        }

        [HttpPatch]
        [Route("UpdateStreamsIsPulled")]
        public async Task<HttpResponseMessage> UpdateStreamsIsPulled([FromBody]List<string> streamIds, bool isPulled)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                var response = await _process.UpdateStreamsIsPulled(streamIds, isPulled);

                string jsonString = JsonSerializer.Serialize(response);
                return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json") };
            }
            else
            {
                throw new CustomException("Token not valid.");
            }

        }
       
    }
}
