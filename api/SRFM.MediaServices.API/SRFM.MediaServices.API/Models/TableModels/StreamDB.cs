﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using SRFM.MediaServices.API.Models.LivePeer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class StreamDB : TableEntity
    {

        public string Name { get; set; }

        public string StreamID { get; set; }
                
        public string StreamInfo { get; set; }

        //public StreamLP StreamLP
        //{
        //    get
        //    {
        //        return JsonConvert.DeserializeObject<StreamLP>(StreamInfo);
        //    }
        //}

        public string WalletId { get; set; }        

        public string StreamType { get; set; }

        public string VId { get; set; }

        public string relayUrl { get; set; }

        public bool relayUrlIsVerified { get; set; }

        public string StreamDuration { get; set; }

        public DateTime StreamStartDate { get; set; }

        public DateTime StreamEndDate { get; set; }

        public string Cost { get; set; }

        public string VaultContractId { get; set; }

        public string Attendees { get; set; }           

        public string SuspendStatus { get; set; }

        public string StreamStatus { get; set; }

        public bool Pulled { get; set; }

        public string PlayBackId { get; set; }

        public string PlayBackUrl
        {
            get
            {
                if (PlayBackId != null)
                {

                    if (this.StreamType == "vod")
                    {
                        return $"https://playback.livepeer.studio/asset/hls/{PlayBackId}/index.m3u8?accessKey={RowKey}";
                    }
                    else if(this.StreamType == "relayService")
                    {
                        if (string.IsNullOrEmpty(relayUrl))
                        {
                            return null;
                        }
                        else
                        {
                            return $"https://livepeercdn.studio/hls/{PlayBackId}/index.m3u8";
                        }
                    }
                    else
                    {
                        return $"https://livepeercdn.studio/hls/{PlayBackId}/index.m3u8";
                    }
                }
                else
                {
                    return string.Empty;
                }
            }
        }

        public string RTMPIngestUrl
        {
            get
            {
                return "rtmp://rtmp.livepeer.com/live";
            }
        }

        public bool Active { get; set; }

    }
}
