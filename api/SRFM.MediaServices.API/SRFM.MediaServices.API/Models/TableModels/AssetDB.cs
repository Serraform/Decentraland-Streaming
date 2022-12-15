using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class AssetDB
    {
        public string AssetId { get; set; }

        public string AssetName { get; set; }

        public string WalletId { get; set; }
        //PartitionKey - USA
        // RowKey - AssetId(guid)
        //AssetId
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
