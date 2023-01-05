using Microsoft.WindowsAzure.Storage.Table;
using SRFM.MediaServices.API.Models.LivePeer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class StreamDB : TableEntity
    {

        public string Name { get; set; }

        public string StreamID { get; set; }

        public StreamLP StreamLP { get; set; }

        public string StreamInfo { get; set; }

        public string WalletId { get; set; }

        //public string StreamFrom { get; set; }       

        public string StreamType { get; set; }

        public string StreamDuration { get; set; }

        public DateTime StreamStartDate { get; set; }

        public DateTime StreamEndDate { get; set; }

        public string Attendees { get; set; }

        //public string VideoDescription { get; set; }       

        public string SuspendStatus { get; set; }

        public bool Active { get; set; }

    }
}
