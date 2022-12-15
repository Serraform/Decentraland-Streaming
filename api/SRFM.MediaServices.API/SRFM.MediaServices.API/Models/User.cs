using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class User
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string WalletPublicKey { get; set; }

        public bool Active { get; set; }
    }
}

