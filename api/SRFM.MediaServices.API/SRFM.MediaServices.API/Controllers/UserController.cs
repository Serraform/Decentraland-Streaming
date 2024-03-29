﻿using Azure;
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
    //[Authorize]
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
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                List<UserDB> user = await _process.ListUsers();
                return user;
            }
            else
            {
                throw new CustomException("Token not valid");
            }
        }

        [HttpGet]
        [Route("ListIsActiveUsers")]
        public async Task<List<UserDB>> ListIsActiveUsers()
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                List<UserDB> user = await _process.ListUserIsActiveItemsAsync(true);
                return user;
            }
            else
            {
                throw new CustomException("Token not valid");
            }
        }

        [HttpGet]
        [Route("ListPremiumUsers/{adminWalletId}")]
        public async Task<List<UserDB>> ListPremiumUsers(string adminWalletId)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                UserDB isAdmin = await _process.GetUserByWalletId(adminWalletId.ToLower());

                if (isAdmin.Role == UserRole.admin.ToString())
                {
                    if (adminWalletId != null)
                    {
                        List<UserDB> user = await _process.ListByFlagItemsAsync("IsPremium", true);
                        return user;
                    }
                    throw new CustomException("WalletId inputs Required");
                }
                else
                {
                    throw new CustomException("User is not admin. Please try with admin account.");
                }
            }
            else
            {
                throw new CustomException("Token not valid");
            }
        }


        [HttpPut]
        [Route("HandlePremiumUserData/{adminWalletId}")]
        public async Task<IActionResult> HandlePremiumUserData(string adminWalletId, [FromBody] UserDB entity)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {

                UserDB isAdmin = await _process.GetUserByWalletId(adminWalletId.ToLower());

                if (isAdmin.Role == UserRole.admin.ToString())
                {
                    UserDB user = await _process.GetUserByWalletId(entity.WalletId.ToLower());

                    if (user != null)
                    {
                        if (entity != null)
                        {
                            user.IsPremium = entity.IsPremium;
                            user.Discount = entity.Discount;
                            user.Role = entity.Role == null ? user.Role : entity.Role;

                            var statusCode = await _process.UpdateUser(user);
                            var ret = new ObjectResult(statusCode) { StatusCode = StatusCodes.Status204NoContent };
                            return ret;
                        }
                        throw new CustomException("WalletId inputs Required");
                    }
                    return NotFound();
                }
                else
                {
                    throw new CustomException("User is not admin. Please try with admin account.");
                }
            }
            else
            {
                throw new CustomException("Token not valid");
            }
        }

        [HttpGet]
        [Route("GetUserDetailsByWalletId/{walletId}")]
        public async Task<UserDB> GetUserDetailsByWalletId(string walletId)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                if (walletId != null)
                {
                    UserDB user = await _process.GetUserByWalletId(walletId.ToLower());
                    return user;
                }
                throw new CustomException("WalletId inputs required");
            }
            else
            {
                throw new CustomException("Token not valid");
            }
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task<object> CreateUser([FromBody] UserDB entity)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                if (entity != null)
                {
                    UserDB user = await _process.GetUserByWalletId(entity.WalletId.ToLower());

                    if (user == null)
                    {
                        entity.PartitionKey = StorageAccount.PartitionKey;
                        entity.RowKey = entity.WalletId.ToLower();
                        entity.Active = true;
                        entity.Role = UserRole.normal.ToString();
                        
                        var ret = await _process.CreateNewUser(entity);
                        //var ret = new ObjectResult(ret) { StatusCode = StatusCodes.Status204NoContent };
                        return ret;

                    }
                    else
                    {
                        //throw new CustomException("WalletId already present. Please try again with new wallet Id.");
                        var responseMsg = new ResponseMessage { ErrorMsg = "WalletId already present. Please try again with new WalletID." };
                        return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(JsonSerializer.Serialize(responseMsg), System.Text.Encoding.UTF8, "application/json") };
                    }
                }
                throw new CustomException("User inputs required");
            }
            else
            {
                throw new CustomException("Token not valid");
            }
        }


        [HttpPut]
        [Route("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UserDB entity)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                UserDB user = await _process.GetUserByWalletId(entity.WalletId.ToLower());

                if (user != null)
                {
                    if (entity != null)
                    {
                        user.Role = entity.Role;
                        user.Active = entity.Active == false ? user.Active : entity.Active;

                        var statusCode = await _process.UpdateUser(user);
                        var ret = new ObjectResult(statusCode) { StatusCode = StatusCodes.Status204NoContent };
                        return ret;
                    }
                    throw new CustomException("WalletId inputs required");
                }
                return NotFound();
            }
            else
            {
                throw new CustomException("Token not valid");
            }
        }

        [HttpDelete]
        [Route("DeleteUserByWalletId/{walletId}")]
        public async Task<IActionResult> DeleteUserByWalletId(string walletId)
        {
            Request.Headers.TryGetValue("Authorization", out Microsoft.Extensions.Primitives.StringValues headerValue);
            var tokenWithBearer = headerValue.ToString();
            var token = tokenWithBearer.Split(" ")[1];
            bool isValidToken = TokenManager.ValidateToken(token);
            if (isValidToken)
            {
                UserDB user = await _process.GetUserByWalletId(walletId.ToLower());

                if (user != null)
                {
                    user.Active = false;
                    var statusCode = await _process.UpdateUser(user);
                    var ret = new ObjectResult(statusCode) { StatusCode = StatusCodes.Status204NoContent };
                    return ret;
                }
                throw new CustomException("WalletId not correct");
            }
            else
            {
                throw new CustomException("Token not valid");
            }
        }
    }
}
