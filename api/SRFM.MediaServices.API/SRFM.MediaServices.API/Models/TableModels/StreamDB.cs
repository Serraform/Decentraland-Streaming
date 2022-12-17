using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class StreamDB : TableEntity
    {
        public StreamDB(string walletId, string pkey)
        {
            this.PartitionKey = pkey; this.RowKey = walletId;
        }

        public StreamDB() { }

        public string WalletId { get; set; }


    }
}
