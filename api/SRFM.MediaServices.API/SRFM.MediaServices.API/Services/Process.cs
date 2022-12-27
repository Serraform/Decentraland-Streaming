using Microsoft.Extensions.Logging;
using SRFM.MediaServices.API.Models.LivePeer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class Process : IProcess
    {
        private readonly ITableReader _tableReader;
        private readonly ITableWriter _tableWriter;
        private readonly IAssetManager _assetManager;
        private readonly ILogger<Process> _logger;


        public Process(ITableReader tableReader, ITableWriter tablewriter, IAssetManager assetManager, ILogger<Process> logger)
        {
            _tableReader = tableReader;
            _tableWriter = tablewriter;
            _logger = logger;
            _assetManager = assetManager;
        }

        // Below are test methods
        public async Task<List<AssetDB>> ListAssets()
        {
            return await _tableReader.ListItemsAsync<AssetDB>("Asset", "USA");
        }

        public async Task<List<AssetDB>> GetAssetByWalletId(string walletId)
        {
            //TODO get assets by walletId;
            return await _tableReader.ListItemsByWalletIdAsync<AssetDB>("Asset", walletId);
        }

        public async Task<List<StreamDB>> GetStreamsByWalletId(string walletId)
        {
            //TODO get streams by walletId;
            return await _tableReader.ListItemsByWalletIdAsync<StreamDB>("Stream", walletId);
        }

        public async Task<List<UserDB>> ListUsers()
        {
            return await _tableReader.ListItemsAsync<UserDB>("User", "USA");
        }

        public async Task<UserDB> GetUserByWalletId(string walletId)
        {
            return await _tableReader.GetItemsByRowKeyAsync<UserDB>("User", walletId);
        }

        public async Task<AssetDB> GetAssetByAssetId(string assetId)
        {
            return await _tableReader.GetItemsByRowKeyAsync<AssetDB>("Asset", assetId);
        }

        public async Task<object> CreateNewUser(UserDB userProp)
        {
            return await _tableWriter.AddAsync("User", userProp);
        }

        public async Task<object> UpdateUser(UserDB userProp)
        {
            return await _tableWriter.UpdateAsync("User", userProp);
        }

        public async Task<object> DeleteUser(UserDB userProp)
        {
            return await _tableWriter.DeleteAsync("User", userProp);
        }

      

        public async Task GetLivePeerAssets()
        {
            await _assetManager.GetAssets<string>("");
        }

        public async Task<RequestUpload> RequestUploadURL(string fileName, string walletId)
        {
            var reqUpload = await _assetManager.RequestUploadURL(fileName);

            if (!string.IsNullOrEmpty(reqUpload.Url))
            {
                //TODO : Create Asset
                var checkUser = await _tableReader.GetItemsByRowKeyAsync<UserDB>("User", walletId);
                if (checkUser != null)
                {
                    var AssetID = Guid.NewGuid().ToString();
                    AssetDB asset = new AssetDB
                    {
                        PartitionKey = "USA",
                        AssetId = AssetID,
                        RowKey = AssetID,
                        WalletId = walletId,
                        FileName = fileName,
                        Url = reqUpload.Url
                        //UploadStatus = reqUpload.Status //Need to check upload status in livepear response
                        //AssetName = //Need to add
                    };

                    var createAsset = await _tableWriter.AddAsync("Asset", asset);
                }
            }

            return reqUpload;
        }

        public async Task<AssetStatusLP> GetAssetUploadStatus(string assetId)
        {
            var status = await _assetManager.GetAssetUploadStatus(assetId);

            //TODO update TableStorage status to AssetDB object of user
            var getAsset = await _tableReader.GetItemsByRowKeyAsync<AssetDB>("Asset", assetId);
            if (getAsset != null)
            {
                AssetDB asset = new AssetDB
                {
                    PartitionKey = "USA",
                    RowKey = getAsset.AssetId,
                    ETag = getAsset.ETag,
                    UploadStatus = status.Status
                };

                var update = await _tableWriter.UpdateAsync("Asset", asset);
            }

            return status;
        }

        public async Task<object> DeleteAsset(AssetDB assetProp)
        {
            return await _tableWriter.DeleteAsync("Asset", assetProp);
        }

        public async Task<HttpResponseMessage> SuspendStream(string streamId, string walletId)
        {

            var httpStatus = await _assetManager.SuspendStream(streamId);
            //TODO update TableStorage stream status to AssetDB object 

            return httpStatus;
        }

        public async Task<HttpResponseMessage> UnSuspendStream(string streamId, string walletId)
        {
            var httpStatus = await _assetManager.UnSuspendStream(streamId);
            //TODO update TableStorage stream status to AssetDB object 

            return httpStatus;
        }

        public async Task<StreamLP> CreateNewStream(StreamLP streamProps,string walletId)
        {
            var streamStatus = await _assetManager.CreateNewStream(streamProps);
            //TODO update table storage with stream

            //if (!string.IsNullOrEmpty(streamStatus.Url))
            //{
            //    //TODO : Create Asset
            //    var checkStream = await _tableReader.GetItemsAsync<AssetDB>("Stream", walletId);
            //    if (checkStream != null)
            //    {
            //        var StreamID = Guid.NewGuid().ToString();
            //        StreamDB asset = new StreamtDB
            //        {
            //            PartitionKey = "USA",
            //            StreamId = StreamID,
            //            RowKey = StreamID,
            //            WalletId = walletId,
            //            FileName = fileName,
            //            Url = reqUpload.Url
            //            //UploadStatus = reqUpload.Status //Need to check upload status in livepear response
            //            //AssetName = //Need to add
            //        };

            //        var createAsset = await _tableWriter.AddAsync("Asset", asset);
            //    }
            //}

            return streamStatus;
        }
    }
}
