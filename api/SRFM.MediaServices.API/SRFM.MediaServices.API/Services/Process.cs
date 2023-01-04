using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SRFM.MediaServices.API.Models.LivePeer;
using System;
using System.Collections.Generic;
using System.IO;
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

        #region "Asset"

        public async Task GetLivePeerAssets()
        {
            await _assetManager.GetAssets<string>("");
        }

        public async Task<RequestUpload> RequestUploadURL(string fileName, string walletId)
        {
            var reqUpload = await _assetManager.RequestUploadURL(fileName);

            string jsonAssetString = JsonConvert.SerializeObject(reqUpload.Asset);

            if (!string.IsNullOrEmpty(reqUpload.Url))
            {
                //TODO : Create Asset
                var checkUser = await _tableReader.GetItemsByRowKeyAsync<UserDB>("User", walletId);
                if (checkUser != null)
                {
                    var AssetID = reqUpload.Asset.Id;
                    AssetDB asset = new AssetDB
                    {
                        PartitionKey = "USA",
                        AssetId = AssetID,
                        RowKey = AssetID,
                        WalletId = walletId,
                        FileName = fileName,
                        Url = reqUpload.Url,
                        AssetName = fileName,
                        Active = true,
                        AssetInfo = jsonAssetString
                        //UploadStatus = reqUpload.Status //Need to check upload status in livepear                         
                    };

                    var createAsset = await _tableWriter.AddAsync("Asset", asset);
                }
            }

            return reqUpload;
        }

        public async Task<AssetStatusLP> GetAssetUploadStatus(string assetId)
        {
            var status = await _assetManager.GetAssetUploadStatus(assetId);

            string jsonAssetString = JsonConvert.SerializeObject(status.Status);
            if (status.Status != null)
            {
                var asset = await _tableReader.GetItemsByRowKeyAsync<AssetDB>("Asset", assetId);
                if (asset != null)
                {
                    asset.UploadAssetStatus = jsonAssetString;
                    var update = await _tableWriter.UpdateAsync("Asset", asset);
                }
            }

            return status;
        }

        public async Task<object> DeleteAsset(AssetDB assetProp)
        {
            return await _tableWriter.UpdateAsync("Asset", assetProp);
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

        public async Task<AssetDB> GetAssetByAssetId(string assetId)
        {
            return await _tableReader.GetItemsByRowKeyAsync<AssetDB>("Asset", assetId);
        }

        #endregion


        #region "User"

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
            return await _tableWriter.UpdateAsync("User", userProp);
        }

        public async Task<List<UserDB>> ListUsers()
        {
            return await _tableReader.ListItemsAsync<UserDB>("User", "USA");
        }

        public async Task<UserDB> GetUserByWalletId(string walletId)
        {
            return await _tableReader.GetItemsByRowKeyAsync<UserDB>("User", walletId);
        }

        #endregion



        #region "Stream"

        public async Task<List<StreamDB>> ListStream()
        {
            return await _tableReader.ListItemsAsync<StreamDB>("Stream", "USA");
        }

        public async Task<List<StreamDB>> GetStreamsByWalletId(string walletId)
        {
            //TODO get streams by walletId;
            return await _tableReader.ListItemsByWalletIdAsync<StreamDB>("Stream", walletId);
        }

        public async Task<StreamDB> GetStreamByStreamId(string streamId)
        {
            return await _tableReader.GetItemsByRowKeyAsync<StreamDB>("Stream", streamId);
        }

        public async Task<HttpResponseMessage> SuspendStream(string streamId, string walletId)
        {

            var httpStatus = await _assetManager.SuspendStream(streamId);

            if (httpStatus.IsSuccessStatusCode)
            {
                //TODO update TableStorage stream status to AssetDB object 
                var stream = await _tableReader.GetItemsByRowKeyAsync<StreamDB>("Stream", streamId);

                if (stream != null)
                {
                    stream.SuspendStatus = "Suspended";

                    var update = await _tableWriter.UpdateAsync("Stream", stream);
                }
            }
            return httpStatus;
        }

        public async Task<HttpResponseMessage> UnSuspendStream(string streamId, string walletId)
        {
            var httpStatus = await _assetManager.UnSuspendStream(streamId);
            //TODO update TableStorage stream status to AssetDB object
            if (httpStatus.IsSuccessStatusCode)
            {
                var stream = await _tableReader.GetItemsByRowKeyAsync<StreamDB>("Stream", streamId);

                if (stream != null)
                {
                    stream.SuspendStatus = "Normal";
                    var update = await _tableWriter.UpdateAsync("Stream", stream);
                }
            }

            return httpStatus;
        }

        public async Task<StreamLP> CreateNewStream(StreamDB streamProps, string walletId)
        {

            var checkUser = await _tableReader.GetItemsByRowKeyAsync<UserDB>("User", walletId);
            if (checkUser != null)
            {
                var streamStatus = await _assetManager.CreateNewStream(streamProps.StreamLP);

                string jsonStreamString = JsonConvert.SerializeObject(streamStatus);

                //TODO update table storage with stream

                if (!string.IsNullOrEmpty(streamStatus.Id))
                {
                    //TODO : Create Stream


                    StreamDB stream = new StreamDB
                    {
                        PartitionKey = "USA",
                        StreamID = streamStatus.Id,
                        RowKey = streamStatus.Id,
                        WalletId = walletId,
                        Name = streamStatus.Name,
                        StreamInfo = jsonStreamString,
                        SuspendStatus = "Normal",
                        Active = true
                    };

                    var createStream = await _tableWriter.AddAsync("Stream", stream);
                }

                return streamStatus;
            }
            throw new CustomException("Wrong wallet id for stream creation.");

        }

        public async Task<HttpResponseMessage> DeleteStream(StreamDB streamProp)
        {
            var httpStatus = await _assetManager.DeleteStream(streamProp.StreamID);
            if (httpStatus.IsSuccessStatusCode)
            {
                var status = await _tableWriter.UpdateAsync("Stream", streamProp);
            }

            return httpStatus;
        }

        #endregion
    }
}
