using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class AssetDB : TableEntity
    {       

        public string AssetId { get; set; }

        public string AssetName { get; set; }

        public string AssetInfo { get; set; }

        public string WalletId { get; set; }

       // public string StreamId { get; set; }

       // public string StreamFrom { get; set; }

        public string FileName { get; set; }

        public string Url { get; set; }

        public string VideoDescription { get; set; }

        public AssetUploadStatus UploadStatus { get; set; }

        public string UploadAssetStatus { get; set; }

        public string PlayBackId { get; set; }

        public string PlayBackUrl
        {
            get
            {
                if (PlayBackId != null)
                {

                    return $"https://livepeercdn.studio/hls/{PlayBackId}/index.m3u8";
                }

                else
                {
                    return string.Empty;
                }
            }
        }

        public bool Active { get; set; }
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
