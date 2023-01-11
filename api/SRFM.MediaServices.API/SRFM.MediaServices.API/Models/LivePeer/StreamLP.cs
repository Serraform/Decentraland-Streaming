using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API.Models.LivePeer
{
    public class StreamLP
    {
        public string Name { get; set; }

        public List<ProfileLP> Profiles { get; set; }

        public bool IsActive { get; set; }

        public bool Record { get; set; }

        public bool Suspended { get; set; }

        public string Id { get; set; }

        public long CreatedAt { get; set; }

        public DateTime CreatedDateUtc
        {
            get
            {
                var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                return epoch.AddMilliseconds(CreatedAt);
            }
        }

        public DateTime CreatedDateLocal
        {
            get
            {
                var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Local);
                return epoch.AddMilliseconds(CreatedAt);
            }
        }

        public long LastSeen { get; set; }

        public DateTime LastSeenDateUtc
        {
            get
            {
                var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                return epoch.AddMilliseconds(LastSeen);
            }
        }

        public DateTime LastSeenDateLocal
        {
            get
            {
                var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Local);
                return epoch.AddMilliseconds(LastSeen);
            }
        }

        public string Duration
        {
            get
            {
                TimeSpan ts = LastSeenDateUtc - CreatedDateUtc;

                return String.Format("{0} days, {1} hours, {2} minutes, {3} seconds", ts.Days, ts.Hours, ts.Minutes, ts.Seconds);
            }
        }


        public string StreamKey { get; set; }

        public string PlayBackId { get; set; }

        public string UserId { get; set; }

        //https://livepeer.studio/blog/streaming-with-rtmp-api
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

        public string RTMPIngestUrl
        {
            get
            {
                return "rtmp://rtmp.livepeer.com/live";
            }
        } 
    }
}

//--Currently not added in StreamLP
//"sourceSegments": 332,
//"transcodedSegments": 1324,
//"sourceSegmentsDuration": 665.9500000000006,
//"transcodedSegmentsDuration": 2655.7919999999796,
//"sourceBytes": 218627832,
//"transcodedBytes": 498726964,
