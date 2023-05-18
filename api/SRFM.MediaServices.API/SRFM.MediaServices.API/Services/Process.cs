using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SRFM.MediaServices.API.Models.LivePeer;
using SRFM.MediaServices.API.Services.Twitch;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
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
        private readonly ITwitchService _twitch;
        private readonly ILogger<Process> _logger;


        public Process(ITableReader tableReader, ITableWriter tablewriter, IQueuesWriter queueswriter, IAssetManager assetManager, ITwitchService twitch, ILogger<Process> logger)
        {
            _tableReader = tableReader;
            _tableWriter = tablewriter;
            _queuesWriter = queueswriter;
            _twitch = twitch;
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
                        PlayBackId = reqUpload.Asset.PlayBackId,
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

        public async Task<object> SaveNewStream(StreamDB streamProps)
        {

            var checkUser = await _tableReader.GetItemsByRowKeyAsync<UserDB>("User", streamProps.WalletId);
            if (checkUser != null)
            { 
                var payLoadStreamQueues = new
                {
                    walletId = streamProps.WalletId,
                    streamId = streamProps.StreamID,
                    RowKey = streamProps.RowKey,
                    StartDateTime = streamProps.StreamStartDate,
                    EndDateTime = streamProps.StreamEndDate
                };

                string jsonStreamQueuesString = JsonConvert.SerializeObject(payLoadStreamQueues);

                //TODO update table storage with stream

                if (!string.IsNullOrEmpty(streamProps.StreamID))
                {
                    //TODO : Create Stream

                    streamProps.PartitionKey = StorageAccount.PartitionKey;
                    //streamProps.StreamID = streamStatus.Id;
                    //streamProps.RowKey = streamStatus.Id;
                    //streamProps.Name = streamStatus.Name;
                    //streamProps.StreamInfo = jsonStreamString;
                    //streamProps.PlayBackId = streamStatus.PlayBackId;
                    streamProps.Pulled = false;
                    streamProps.SuspendStatus = "Suspended";
                    streamProps.StreamStatus = StreamStatus.Upcoming.ToString();
                    streamProps.Active = true;

                    var createStream = await _tableWriter.AddAsync("Stream", streamProps);
                   
                    await _queuesWriter.AddQueuesMessageAsync("queue-livestream", jsonStreamQueuesString);

                    return createStream;
                }
               
            }
            throw new CustomException("Wrong wallet id for stream creation.");

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

        public async Task<List<UserDB>> ListUserIsActiveItemsAsync(bool isActive)
        {
            return await _tableReader.ListIsActiveItemsAsync<UserDB>("User", StorageAccount.PartitionKey, isActive);
        }

        public async Task<List<UserDB>> ListByFlagItemsAsync(string columnName,bool flag)
        {
            return await _tableReader.ListByFlagItemsAsync<UserDB>("User", columnName, StorageAccount.PartitionKey, flag);
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

        public async Task<List<StreamDB>> ListStreamIsActiveItemsAsync(bool isActive)
        {
            return await _tableReader.ListIsActiveItemsAsync<StreamDB>("Stream", StorageAccount.PartitionKey, isActive);
        }

        public async Task<List<StreamDB>> GetStreamsByWalletId(string walletId)
        {            
            return await _tableReader.ListItemsByWalletIdAsync<StreamDB>("Stream", walletId);
        }

        public async Task<List<StreamLP>> GetStreamSessionByStreamId(string streamId)
        {
            //Need to discuss from where to show Stream detail to user , from LP or from DB or update StreamLP every time
            var httpStatus = await _assetManager.GetStreamSession(streamId);

            var getStream = await _tableReader.GetItemsByStreamIDKeyAsync<StreamDB>("Stream", StorageAccount.PartitionKey, true, streamId);

            getStream.StreamInfo = JsonConvert.SerializeObject(httpStatus);

            return httpStatus;
        }

        public async Task<StreamDB> GetStreamByStreamId(string streamId)
        {
            //Need to discuss from where to show Stream detail to user , from LP or from DB or update StreamLP every time
            var httpStatus = await _assetManager.GetStream(streamId);
            var getStream = await _tableReader.GetItemsByStreamIDKeyAsync<StreamDB>("Stream", StorageAccount.PartitionKey,true, streamId);

            if (httpStatus.Id != null)
            {
                getStream.StreamInfo = JsonConvert.SerializeObject(httpStatus);
            }

            return getStream;
        }

        public async Task<HttpResponseMessage> SuspendStream(string streamId, string walletId)
        {

            var httpStatus = await _assetManager.SuspendStream(streamId);

            if (httpStatus.IsSuccessStatusCode)
            {
                //TODO update TableStorage stream status to AssetDB object 
                var stream = await _tableReader.GetItemsByStreamIDKeyAsync<StreamDB>("Stream", StorageAccount.PartitionKey, true, streamId);

                if (stream != null)
                {
                    stream.SuspendStatus = "Suspended";
                    //stream.StreamStatus = "Suspended";
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
                var stream = await _tableReader.GetItemsByStreamIDKeyAsync<StreamDB>("Stream", StorageAccount.PartitionKey, true, streamId);

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
                StreamLP streamLP = new StreamLP { Name = streamProps.Name };

                var streamStatus = await _assetManager.CreateNewStream(streamLP);

                string jsonStreamString = JsonConvert.SerializeObject(streamStatus);

                var payLoadStreamQueues = new
                {
                    walletId = streamProps.WalletId,
                    streamId = streamStatus.Id,
                    RowKey = streamProps.StreamType == StreamType.liveStream.ToString()? streamStatus.Id : streamProps.RowKey,
                    StartDateTime = streamProps.StreamStartDate,
                    EndDateTime = streamProps.StreamEndDate
                };

                string jsonStreamQueuesString = JsonConvert.SerializeObject(payLoadStreamQueues);

                if (streamProps.StreamType == StreamType.relayService.ToString())
                {
                    var twitch = await _twitch.TriggerWrokflow(System.Web.HttpUtility.UrlEncode(streamProps.relayUrl), streamStatus.StreamKey);
                }


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
                    streamProps.Pulled = false;
                    streamProps.SuspendStatus = streamStatus.Suspended ? "Suspended" : "Normal";
                    streamProps.StreamStatus = StreamStatus.Upcoming.ToString();
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

            if (streamProp.StreamType == StreamType.relayService.ToString())
            {
                var getStatus = _assetManager.GetStream(streamProp.StreamID);

                if(getStatus == null)
                {
                    StreamLP streamLP = new StreamLP { Name = streamProp.Name };

                    var streamStatus = await _assetManager.CreateNewStream(streamLP);

                    string jsonStreamString = JsonConvert.SerializeObject(streamStatus);

                    streamProp.StreamID = streamStatus.Id;
                    streamProp.StreamInfo = jsonStreamString;
                    streamProp.PlayBackId = streamStatus.PlayBackId;

                    var twitch = await _twitch.TriggerWrokflow(System.Web.HttpUtility.UrlEncode(streamProp.relayUrl), streamStatus.StreamKey);
                }
            }

            //Not possible to change stream name in livepeer
            var payLoadStreamQueues = new
            {
                walletId = streamProp.WalletId,
                streamId = streamProp.StreamID,
                RowKey = streamProp.RowKey,
                StartDateTime = streamProp.StreamStartDate,
                EndDateTime = streamProp.StreamEndDate
            };

            string jsonStreamQueuesString = JsonConvert.SerializeObject(payLoadStreamQueues);

            await _queuesWriter.AddQueuesMessageAsync("queue-livestream", jsonStreamQueuesString);

            return await _tableWriter.UpdateAsync("Stream", streamProp);
        }

        public async Task<object> UpdateStreamsIsPulled(List<string> streamIds, bool isPulled)
        {
            StreamDB streamLog = null;
            TableBatchOperation entityBatch = new TableBatchOperation();

            foreach (string stream in streamIds)
            {
                streamLog = await _tableReader.GetItemsByStreamIDKeyAsync<StreamDB>("Stream", StorageAccount.PartitionKey, true, streamId);

                if (streamLog != null)
                {
                    streamLog.Pulled = isPulled;
                    streamLog.Active = false;
                    entityBatch.Replace(streamLog);
                }
            }

            if (entityBatch.Count == 0)
            {
                throw new CustomException("Stream id not found");               
            }

            return await _tableWriter.UpdateBatchAsync("Stream", entityBatch);
        }

        public async Task<object> DeleteStream(StreamDB streamProp)
        {
            if (streamProp.StreamType == StreamType.vod.ToString())
            {
                var status = await _tableWriter.UpdateAsync("Stream", streamProp);
                return status;
            }
            else
            {
                var httpStatus = await _assetManager.DeleteStream(streamProp.StreamID);

                var status = await _tableWriter.UpdateAsync("Stream", streamProp);


                return status;                
            }

        }
    
        #endregion
    }
}
