using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API.Models.Config
{
    public class TwitchConfig
    {
        public string M3U8BaseUrl { get; set; }

        public string M3U8Code { get; set; }

        public string WorkflowBaseUrl { get; set; }

        public string GitHubUserAgent { get; set; }

        public string GitHubKey { get; set; }
    }
}
