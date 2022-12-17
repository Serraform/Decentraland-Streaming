using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
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
        [Route("GetUserDetailsByWalletId/{walletId}")]
        public async Task<UserDB> GetUserDetailsByWalletId(string walletId)
        {
            // query TableStorage - Asset Table to get all assets by walletId

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
                entity.PartitionKey = "USA";
                entity.WalletId = Guid.NewGuid().ToString();
                entity.RowKey = entity.WalletId;

                // Add new userDB object to Table Storage >> need to check Status code 201/204 by "Prefer header"
                var ret = await _process.CreateNewUser(entity);
                //var ret = new ObjectResult(statusCode) { StatusCode = StatusCodes.Status204NoContent };
                return ret;
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
                    entity.PartitionKey = "USA";
                    entity.RowKey = user.WalletId;
                    entity.ETag = user.ETag;

                    // Add new userDB object to Table Storage >> need to check Status code 201/204 by "Prefer header"
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
            // Add new userDB object to Table Storage >> need to check Status code 201/204 by "Prefer header"

            UserDB user = await _process.GetUserByWalletId(walletId);

            if (user != null)
            {

                var statusCode = await _process.DeleteUser(user);
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
