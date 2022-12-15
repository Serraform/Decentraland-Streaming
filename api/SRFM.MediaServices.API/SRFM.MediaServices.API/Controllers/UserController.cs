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
        [Route("GetUserDetailsByWalletId/{walletId}")]
        public async Task<UserDB> GetUserDetailsByWalletId(string walletId)
        {
            // query TableStorage - Asset Table to get all assets by walletId

            return new UserDB() { Id = "user123", WalletId = walletId };
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDB value)
        {
            // Add new userDB object to Table Storage
            var ret = new ObjectResult(value) { StatusCode = StatusCodes.Status201Created };
            return ret;
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
