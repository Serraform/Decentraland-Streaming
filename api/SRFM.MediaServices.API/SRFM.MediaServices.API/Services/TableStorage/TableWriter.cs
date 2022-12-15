using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using SRFM.MediaServices.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class TableWriter : ITableWriter
    {

        private CloudTableClient _tableClient;
        private ILogger<TableWriter> _logger;

        public TableWriter(CloudTableClient tableClient, ILogger<TableWriter> logger)
        {
            _tableClient = tableClient;
            _logger = logger;
        }

        public Task<ResponseMessage> UpdateUserAsync(UserDB user)
        {
            throw new NotImplementedException();
        }
    }
}
