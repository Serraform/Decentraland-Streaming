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

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SRFM.MediaServices.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AssetController : ControllerBase
    {
        private readonly IProcess _process;
        private readonly ILogger<AssetController> _logger;

        public AssetController(IProcess process, ILogger<AssetController> logger)
        {
            _process = process;
            _logger = logger;
        }        

        [HttpGet]
        [Route("ListAsset")]
        public async Task<List<AssetDB>> ListAsset()
        {            
            List<AssetDB> asset = await _process.ListAssets();
            return asset;
        }

        [HttpGet]
        [Route("RequestUploadURL/{filename}/{walletId}")]
        public async Task<RequestUpload> RequestUploadURL(string filename, string walletId)
        {   
            var reqUpload = await _process.RequestUploadURL(filename, walletId);

            return reqUpload;


            //ref doc : https://docs.livepeer.studio/guides/on-demand/upload-video-asset/api
            // call https://docs.livepeer.studio/guides/on-demand/upload-video-asset/api#step-1-generate-upload-url
            // create new record in Asset-TableStorage.
            // get the url 
            // return to UI

            //return new RequestUpload() { Url = "https://origin.livepeer.com/api/asset/upload/direct?token=eyJhbGciOiJ..bla.bla.bla", Asset = new AssetLP() { Id = "myAssetId", Name = filename } };
        }

        [HttpGet]
        [Route("GetAssetStatus/{assetId}/{walletId}")]
        public async Task<AssetStatusLP> GetAssetStatus(string assetId, string walletId)
        {
            var status = await _process.GetAssetUploadStatus(assetId);
            return status;

            //ref doc : https://docs.livepeer.studio/guides/on-demand/upload-video-asset/api#step-3-check-the-upload-status

            // call get status api
            // update status of that asset in Table storage
            // get the url 
            // return to UI
            // return new AssetStatusLP() { Id = assetId, Status = new AssetUploadStatus() { Phase = "ready", ErrorMessage = "Test", Progress = "40" } };
        }

        [HttpGet]
        [Route("GetAssetsByWalletId/{walletId}")]
        public async Task<IEnumerable<AssetDB>> GetAssetsByWalletId(string walletId)
        {            
            var assets = await _process.GetAssetByWalletId(walletId);
            return assets;          
        }
        
        [HttpDelete]
        [Route("DeleteAssetByAssetId/{assetId}")]
        public async Task<IActionResult> DeleteAssetByAssetId(string assetId)
        {       

            AssetDB asset = await _process.GetAssetByAssetId(assetId);

            if (asset != null)
            {
                asset.Active = false;
                var statusCode = await _process.DeleteAsset(asset);
                var ret = new ObjectResult(statusCode) { StatusCode = StatusCodes.Status204NoContent };
                return ret;

            }
            throw new CustomException("WalletId not correct");
        }        
    }
}
