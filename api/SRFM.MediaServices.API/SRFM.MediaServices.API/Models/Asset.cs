using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class AssetBase
    {
        public string AssetName { get; set; }

        public string AssetId { get; set; }

        public string AssetDescription { get; set; }

        public string WalletPublicKey { get; set; }

        public DateTime StreamStart { get; set; }


    }

    public class AssetResponse : AssetBase
    {       
        public string UploadStatus { get; set; }
    }
}

