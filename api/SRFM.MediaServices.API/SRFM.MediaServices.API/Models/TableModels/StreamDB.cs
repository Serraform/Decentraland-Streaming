using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class StreamDB : TableEntity
    {

       
        public string StreamName { get; set; }

        public string WalletId { get; set; }

        public string StreamId { get; set; }

        public string StreamFrom { get; set; }

        public string FileName { get; set; }

        public string Url { get; set; }

        public string VideoDescription { get; set; }

        public AssetUploadStatus UploadStatus { get; set; }

    }
}
