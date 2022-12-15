using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class TableReader : ITableReader
    {
        //https://learn.microsoft.com/en-us/azure/storage/common/storage-samples-dotnet#table-samples-v11

        private CloudTableClient _tableClient;
        private ILogger<TableReader> _logger;

        public TableReader(CloudTableClient tableClient, ILogger<TableReader> logger)
        {
            _tableClient = tableClient;
            _logger = logger;
        }

        public async Task<List<T>> GetItemsAsync<T>(string query, string tableName)
        {
            var tableref = _tableClient.GetTableReference("User");
            throw new NotFiniteNumberException();
            return new List<T>();
        }
    }
}
