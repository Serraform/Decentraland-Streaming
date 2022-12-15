using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class UserDB 
    {
        public string Id { get; set; }

        public string WalletId { get; set; }
        // PartitionKey - USA
        // RowKey - GUID (customerId)
        // Email
        // WalletId
        // PhoneNumber
        // CreatedDate
        // Active
        // Timestamp
    }
}
