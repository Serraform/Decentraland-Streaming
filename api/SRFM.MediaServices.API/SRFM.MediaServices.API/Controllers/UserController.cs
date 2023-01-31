using Azure;
using JwtServices;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SRFM.MediaServices.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SRFM.MediaServices.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IProcess _process;
        private readonly ILogger<UserController> _logger;

        public UserController(IProcess process, ILogger<UserController> logger)
        {
            _process = process;
            _logger = logger;
        }

        [HttpGet]
        [Route("ListUsers")]
        public async Task<List<UserDB>> ListUsers()
        {
            //Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            //var tokenWithBearer = headerValue.ToString();
            //var token = tokenWithBearer.Split(" ")[1];
            //bool isValidToken = TokenManager.ValidateToken(token);
            //if (isValidToken)
            //{
            
            //}

            //var accessToken = await HttpContext.GetTokenAsync("access_token");
            //using (var httpClient = new HttpClient())
            //{
            //    httpClient.DefaultRequestHeaders.Authorization
            //                 = new AuthenticationHeaderValue("Bearer", accessToken);
            //}

            List<UserDB> user = await _process.ListUsers();
            return user;
        }

        [HttpGet]
        [Route("GetUserDetailsByWalletId/{walletId}")]
        public async Task<UserDB> GetUserDetailsByWalletId(string walletId)
        {  
            if (walletId != null)
            {
                UserDB user = await _process.GetUserByWalletId(walletId);
                return user;
            }
            throw new CustomException("WalletId inputs Required");
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task<object> CreateUser([FromBody] UserDB entity)
        {
            if (entity != null)
            {
                UserDB user = await _process.GetUserByWalletId(entity.WalletId);

                if (user == null)
                {
                    entity.PartitionKey = StorageAccount.PartitionKey;                   
                    entity.RowKey = entity.WalletId;
                   
                    var ret = await _process.CreateNewUser(entity);
                    //var ret = new ObjectResult(ret) { StatusCode = StatusCodes.Status204NoContent };
                    return ret;
                    
                }
                else
                {
                    //throw new CustomException("WalletId already present. Please try again with new wallet Id.");
                    var responseMsg = new ResponseMessage { ErrorMsg = "WalletId already present. Please try again with new wallet Id." };
                    return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(JsonSerializer.Serialize(responseMsg), System.Text.Encoding.UTF8, "application/json") };                    
                }
            }
            throw new CustomException("User inputs Required");
        }


        [HttpPut]
        [Route("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UserDB entity)
        {

            UserDB user = await _process.GetUserByWalletId(entity.WalletId);

            if (user != null)
            {
                if (entity != null)
                {
                    entity.PartitionKey = StorageAccount.PartitionKey;
                    entity.RowKey = user.WalletId;
                    entity.ETag = user.ETag;
                    
                    var statusCode = await _process.UpdateUser(entity);
                    var ret = new ObjectResult(statusCode) { StatusCode = StatusCodes.Status204NoContent };
                    return ret;
                }
                throw new CustomException("WalletId inputs Required");
            }
            return NotFound();            
        }

        [HttpDelete]
        [Route("DeleteUserByWalletId/{walletId}")]
        public async Task<IActionResult> DeleteUserByWalletId(string walletId)
        {  
            UserDB user = await _process.GetUserByWalletId(walletId);

            if (user != null)
            {
                user.Active = false;
                var statusCode = await _process.UpdateUser(user);
                var ret = new ObjectResult(statusCode) { StatusCode = StatusCodes.Status204NoContent };
                return ret;
            }
            throw new CustomException("WalletId not correct");
        }








        //// GET: api/<UserController>
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET api/<UserController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}




        //// PUT api/<UserController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE api/<UserController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
