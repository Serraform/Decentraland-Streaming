using System;
using System.Collections.Generic;
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

        public string StreamKey { get; set; }

        public string PlayBackId { get; set; }
    }
}
