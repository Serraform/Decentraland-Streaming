﻿using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class UserDB : TableEntity
    {        

        public string WalletId { get; set; }

        //public string Email { get; set; }

        //public string PhoneNumber { get; set; }

        public string Role { get; set; }

        public bool IsPremium { get; set; }

        public int Discount { get; set; }

        public bool Active { get; set; }

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
