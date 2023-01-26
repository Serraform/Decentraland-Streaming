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
        private readonly IQueuesWriter _queuesWriter;
        private readonly IAssetManager _assetManager;
        private readonly ILogger<Process> _logger;


        public Process(ITableReader tableReader, ITableWriter tablewriter, IQueuesWriter queueswriter, IAssetManager assetManager, ILogger<Process> logger)
        {
            _tableReader = tableReader;
            _tableWriter = tablewriter;
            _queuesWriter = queueswriter;
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
                        PartitionKey = StorageAccount.PartitionKey,
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
            return await _tableReader.ListItemsAsync<AssetDB>("Asset", StorageAccount.PartitionKey);
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
            return await _tableReader.ListItemsAsync<UserDB>("User", StorageAccount.PartitionKey);
        }

        public async Task<UserDB> GetUserByWalletId(string walletId)
        {
            return await _tableReader.GetItemsByRowKeyAsync<UserDB>("User", walletId);
        }

        #endregion



        #region "Stream"

        public async Task<List<StreamDB>> ListStream()
        {
            return await _tableReader.ListItemsAsync<StreamDB>("Stream", StorageAccount.PartitionKey);
        }

        public async Task<List<StreamDB>> GetStreamsByWalletId(string walletId)
        {            
            return await _tableReader.ListItemsByWalletIdAsync<StreamDB>("Stream", walletId);
        }

        public async Task<List<StreamLP>> GetStreamSessionByStreamId(string streamId)
        {
            //Need to discuss from where to show Stream detail to user , from LP or from DB or update StreamLP every time
            var httpStatus = await _assetManager.GetStreamSession(streamId);

            var getStream = await _tableReader.GetItemsByRowKeyAsync<StreamDB>("Stream", streamId);

            getStream.StreamInfo = JsonConvert.SerializeObject(httpStatus);

            return httpStatus;
        }

        public async Task<StreamDB> GetStreamByStreamId(string streamId)
        {
            //Need to discuss from where to show Stream detail to user , from LP or from DB or update StreamLP every time
            var httpStatus = await _assetManager.GetStream(streamId);

            var getStream = await _tableReader.GetItemsByRowKeyAsync<StreamDB>("Stream", streamId);

            getStream.StreamInfo = JsonConvert.SerializeObject(httpStatus);

            return getStream;
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

        public async Task<StreamLP> CreateNewStream(StreamDB streamProps)
        {

            var checkUser = await _tableReader.GetItemsByRowKeyAsync<UserDB>("User", streamProps.WalletId);
            if (checkUser != null)
            {
                StreamLP  streamLP= new StreamLP { Name = streamProps.Name };

                var streamStatus = await _assetManager.CreateNewStream(streamLP);

                string jsonStreamString = JsonConvert.SerializeObject(streamStatus);

                var payLoadStreamQueues = new
                {
                    walletId = streamProps.WalletId,
                    streamId= streamStatus.Id,
                    StartDateTime =streamProps.StreamStartDate,
                    EndDateTime = streamProps.StreamEndDate
                };

                string jsonStreamQueuesString = JsonConvert.SerializeObject(payLoadStreamQueues);

                //TODO update table storage with stream

                if (!string.IsNullOrEmpty(streamStatus.Id))
                {
                    //TODO : Create Stream

                    streamProps.PartitionKey = StorageAccount.PartitionKey;
                    streamProps.StreamID = streamStatus.Id;
                    streamProps.RowKey = streamStatus.Id;                    
                    streamProps.Name = streamStatus.Name;
                    streamProps.StreamInfo = jsonStreamString;
                    streamProps.PlayBackId = streamStatus.PlayBackId;
                    streamProps.SuspendStatus = "Suspended"; //streamStatus.Suspended ? "Suspended" : "Normal";
                    streamProps.Active = true;

                    var createStream = await _tableWriter.AddAsync("Stream", streamProps);

                    //Suspend Stream
                    var suspendStream = await this.SuspendStream(streamStatus.Id, streamProps.WalletId);

                    await _queuesWriter.AddQueuesMessageAsync("queue-livestream", jsonStreamQueuesString);

                }

                return streamStatus;
            }
            throw new CustomException("Wrong wallet id for stream creation.");

        }

        public async Task<object> UpdateStream(StreamDB streamProp)
        {
            return await _tableWriter.UpdateAsync("Stream", streamProp);
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
