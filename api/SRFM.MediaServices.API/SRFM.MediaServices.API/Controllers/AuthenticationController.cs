using JwtServices;
using Microsoft.AspNetCore.Mvc;
using Moralis;
using Moralis.AuthApi.Models;
using Moralis.Network;
using Moralis.Web3Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Options;
using SRFM.MediaServices.API;
using System.Net.Http;
using SRFM.MediaServices.API.Services.LivePeer;
using SRFM.MediaServices.API.Services.Moralis;
using System.Text;
using System.Text.Json;
using System.Diagnostics;
using System.Net;

namespace SRFM.MediaServices.API
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {

        private MoralisConfig _moralisConfig;
        private readonly IMoralisService _moralis;        

        public AuthenticationController(IOptions<MoralisConfig> options, IMoralisService moralis)
        {
            _moralisConfig = options.Value;
            _moralis = moralis;
        }

        [HttpPost, Route("{address}/{network}/{chainId}")]
        public async Task<IActionResult> RequestMessage(string address, ChainNetworkType network, ChainList chainId)
        {
            try
            {
                //ChallengeRequestDto req = new ChallengeRequestDto()
                //{
                //    // The Ethereum address performing the signing conformant to capitalization encoded
                //    // checksum specified in EIP-55 where applicable.
                //    Address = address,
                //    // The EIP-155 Chain ID to which the session is bound, and the network where Contract
                //    // Accounts MUST be resolved.
                //    ChainId = (long)chainId,
                //    // The RFC 3986 authority that is requesting the signing
                //    Domain = _moralisConfig.Domain,
                //    // The ISO 8601 datetime string that, if present, indicates when the signed
                //    // authentication message is no longer valid.
                //    ExpirationTime = DateTime.UtcNow.AddMinutes(60),
                //    // The ISO 8601 datetime string that, if present, indicates when the signed
                //    // authentication message will become valid.
                //    NotBefore = DateTime.UtcNow,
                //    // A list of information or references to information the user wishes to have resolved
                //    // as part of authentication by the relying party. They are expressed as RFC 3986 URIs
                //    // separated by "\n- " where \n is the byte 0x0a.
                //    Resources = new string[] { _moralisConfig.Resources },
                //    // Time is seconds at which point this request becomes invalid.
                //    Timeout = 120,
                //    // A human-readable ASCII assertion that the user will sign, and it must not
                //    // contain '\n' (the byte 0x0a).
                //    Statement = "Please confirm",
                //    // An RFC 3986 URI referring to the resource that is the subject of the signing
                //    // (as in the subject of a claim).
                //    Uri = _moralisConfig.Uri
                //};

                //ChallengeResponseDto resp = await MoralisClient.AuthenticationApi.AuthEndpoint.Challenge(req, network);

                var json = new
                {
                    address = address,
                    chainId = (long)chainId,
                    domain = _moralisConfig.Domain,
                    expirationTime = DateTime.UtcNow.AddMinutes(60),
                    notBefore = DateTime.UtcNow,
                    // Resources = new string[] { _moralisConfig.Resources },
                    statement = "Please confirm",
                    uri = _moralisConfig.Uri,
                    timeout = 120
                };

                string jsonString = JsonSerializer.Serialize(json);
                var payload = new StringContent(jsonString, Encoding.UTF8, "application/json");

                ChallengeResponseDto resp = await _moralis.RequestEVM(payload);

                return new CreatedAtRouteResult(nameof(RequestMessage), resp);
            }
            catch (ApiException ex)
            {
                return new BadRequestResult();
            }
            catch (Exception ex)
            {
                return new StatusCodeResult((int)System.Net.HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost, Route("verify/{network}")]
        public async Task<IActionResult> VerifySignature(ChainNetworkType network, [FromBody] CompleteChallengeRequestDto req)
        {
            try
            {
                //CompleteChallengeResponseDto completeResp = await MoralisClient.AuthenticationApi.AuthEndpoint.CompleteChallenge(req, network);

                var json = new
                {
                    message = req.Message,
                    signature = req.Signature                   
                };

                string jsonString = JsonSerializer.Serialize(json);
                var payload = new StringContent(jsonString, Encoding.UTF8, "application/json");

                CompleteChallengeResponseDto completeResp = await _moralis.VerifyEVM(payload);

                // ---------------------------------------------------------------------------------
                // Here is where you would save authentication information to the database.
                // ---------------------------------------------------------------------------------

                Dictionary<string, string> claims = new Dictionary<string, string>();
                claims.Add("Address", completeResp.Address);
                claims.Add("AuthenticationProfileId", completeResp.ProfileId);
                claims.Add("SignatureValidated", "true");

                string token = TokenManager.GenerateToken(claims);

                return new CreatedAtRouteResult(nameof(VerifySignature), token);
            }
            catch (ApiException ex)
            {
                return new BadRequestResult();
            }
            catch (Exception ex)
            {
                return new StatusCodeResult((int)System.Net.HttpStatusCode.InternalServerError);
            }
        }
    }
}