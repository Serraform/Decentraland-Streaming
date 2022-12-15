using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class AssetStatusLP : AssetLP
    {
        public AssetUploadStatus Status { get; set; }

        public string PlaybackUrl { get; set; }

        public string DownloadUrl { get; set; }
    }

    public class AssetUploadStatus
    {
        public string Phase { get; set; }

        public string updatedAt { get; set; }

        public string Progress { get; set; }

        public string ErrorMessage { get; set; }
    }
}
