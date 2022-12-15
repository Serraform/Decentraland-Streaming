using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class AssetLP
    {
        public string Id { get; set; }

        public string PlayBackId { get; set; }

        public string UserId { get; set; }

        public string Name { get; set; }

    }

    public class RequestUpload
    {

        public string Url { get; set; }

        public AssetLP Asset { get; set; }

        public string TusEndPoint { get; set; }

    }
}
