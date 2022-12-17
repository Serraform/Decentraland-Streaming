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

        public async Task<List<T>> ListItemsAsync<T>(string tableName, string walletId) where T : TableEntity, new()
        {
            var tableref = _tableClient.GetTableReference(tableName);

            // by WelletId
            TableQuery<T> query = new TableQuery<T>().Where(TableQuery.GenerateFilterCondition("WalletId", QueryComparisons.Equal, walletId));
            TableContinuationToken token = null;
            TableQuerySegment<T> resultSegment = await tableref.ExecuteQuerySegmentedAsync(query, token);
            var entity = resultSegment.Results;

            return resultSegment.Results as List<T>;
        }

        public async Task<T> GetItemsAsync<T>(string tableName, string walletId) where T : TableEntity
        {
            var tableref = _tableClient.GetTableReference(tableName);
            // by partition and rwo keys
            TableOperation retrieveOperation = TableOperation.Retrieve<T>("USA", walletId);
            TableResult result = await tableref.ExecuteAsync(retrieveOperation);
            return result.Result as T;
        }
    }
}
