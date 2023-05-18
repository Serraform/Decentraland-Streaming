using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Concurrent;
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

        public async Task<List<T>> ListItemsByWalletIdAsync<T>(string tableName, string walletId) where T : TableEntity, new()
        {
            var tableref = _tableClient.GetTableReference(tableName);

            // by WelletId
            //TableQuery<T> query = new TableQuery<T>().Where(TableQuery.GenerateFilterCondition("WalletId", QueryComparisons.Equal, walletId));
            string welletIDQuery =TableQuery.GenerateFilterCondition("WalletId", QueryComparisons.Equal, walletId);
            string isActiveQuery = TableQuery.GenerateFilterConditionForBool("Active", QueryComparisons.Equal, true);
            string combinedFilter = TableQuery.CombineFilters(welletIDQuery, TableOperators.And, isActiveQuery);

            TableContinuationToken token = null;
           
            TableQuery<T> query = new TableQuery<T>().Where(combinedFilter);

            TableQuerySegment<T> resultSegment = await tableref.ExecuteQuerySegmentedAsync(query, token);
            var entity = resultSegment.Results;

            return resultSegment.Results as List<T>;
        }

        public async Task<List<T>> ListIsActiveItemsAsync<T>(string tableName, string partitionKey, bool isActive) where T : TableEntity, new()
        {
            var tableref = _tableClient.GetTableReference(tableName);

            string welletIDQuery = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey);
            string isActiveQuery = TableQuery.GenerateFilterConditionForBool("Active", QueryComparisons.Equal, isActive);
            string combinedFilter = TableQuery.CombineFilters(welletIDQuery, TableOperators.And, isActiveQuery);

            TableContinuationToken token = null;

            TableQuery<T> query = new TableQuery<T>().Where(combinedFilter);

            TableQuerySegment<T> resultSegment = await tableref.ExecuteQuerySegmentedAsync(query, token);
            var entity = resultSegment.Results;

            return resultSegment.Results as List<T>;

        }


        public async Task<List<T>> ListByFlagItemsAsync<T>(string tableName, string columnName, string partitionKey, bool isActive) where T : TableEntity, new()
        {
            var tableref = _tableClient.GetTableReference(tableName);

            string welletIDQuery = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey);
            string isActiveQuery = TableQuery.GenerateFilterConditionForBool("Active", QueryComparisons.Equal, isActive);
            string isFlagQuery = TableQuery.GenerateFilterConditionForBool(columnName, QueryComparisons.Equal, isActive);
            string combinedFilter = TableQuery.CombineFilters(TableQuery.CombineFilters(welletIDQuery, TableOperators.And, isActiveQuery), TableOperators.And, isFlagQuery);

            TableContinuationToken token = null;

            TableQuery<T> query = new TableQuery<T>().Where(combinedFilter);

            TableQuerySegment<T> resultSegment = await tableref.ExecuteQuerySegmentedAsync(query, token);
            var entity = resultSegment.Results;

            return resultSegment.Results as List<T>;

        }

        public async Task<List<T>> ListItemsAsync<T>(string tableName, string partitionKey) where T : TableEntity, new()
        {
            var tableref = _tableClient.GetTableReference(tableName);

            // by WelletId
            TableQuery<T> query = new TableQuery<T>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey));
            TableContinuationToken token = null;
            TableQuerySegment<T> resultSegment = await tableref.ExecuteQuerySegmentedAsync(query, token);
            var entity = resultSegment.Results;

            return resultSegment.Results as List<T>;
        }

        public async Task<T> GetItemsByRowKeyAsync<T>(string tableName, string rowKey) where T : TableEntity
        {
            var tableref = _tableClient.GetTableReference(tableName);
            // by partition and rwo keys
            TableOperation retrieveOperation = TableOperation.Retrieve<T>(StorageAccount.PartitionKey, rowKey);
            TableResult result = await tableref.ExecuteAsync(retrieveOperation);
            return result.Result as T;
        }

        public async Task<T> GetItemsByStreamIDKeyAsync<T>(string tableName, string partitionKey, bool isActive, string colValue) where T : TableEntity, new()
        {
            var tableref = _tableClient.GetTableReference(tableName);

            string welletIDQuery = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey);
            string isActiveQuery = TableQuery.GenerateFilterConditionForBool("Active", QueryComparisons.Equal, isActive);
            string isFlagQuery = TableQuery.GenerateFilterCondition("StreamID", QueryComparisons.Equal, colValue);
            string combinedFilter = TableQuery.CombineFilters(TableQuery.CombineFilters(welletIDQuery, TableOperators.And, isActiveQuery), TableOperators.And, isFlagQuery);

            TableContinuationToken token = null;

            TableQuery<T> query = new TableQuery<T>().Where(combinedFilter);

            TableQuerySegment<T> resultSegment = await tableref.ExecuteQuerySegmentedAsync(query, token);
            var entity = resultSegment.Results.FirstOrDefault();
            return entity as T;
        }
    }
}
