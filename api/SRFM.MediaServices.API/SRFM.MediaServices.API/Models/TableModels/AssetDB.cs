﻿using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class AssetDB : TableEntity
    {
        public AssetDB(string assetId, string pkey)
        {
            this.PartitionKey = pkey; this.RowKey = assetId;
        }

        public AssetDB() { }

        public string AssetId { get; set; }

        public string AssetName { get; set; }

        public string WalletId { get; set; }

        public string StreamId { get; set; }

        public string StreamFrom { get; set; }

        public string VideoDescription { get; set; }

        public string UploadStatus { get; set; }
        //PartitionKey - USA
        // RowKey - AssetId(guid)
        // AssetId
        // AssetName
        // WalletId 
        // StreamId
        // VideoDescription
        // Timestamp
        // CreatedDate
        // UpdatedDate
        // StreamFrom
        // UploadStatus - web hook data from livepeer
    }
}