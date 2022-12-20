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

        public async Task<object> AddAsync(string tableName, TableEntity entity)
        {
            var tableref = _tableClient.GetTableReference(tableName);

            TableOperation insertOperation = TableOperation.Insert(entity);
            TableResult result = await tableref.ExecuteAsync(insertOperation).ConfigureAwait(false);

            return result.Result;
        }

        public async Task<object> UpsertAsync(string tableName, TableEntity entity)
        {
            var tableref = _tableClient.GetTableReference(tableName);
            //Adds the or update entity
            TableOperation insertOrReplaceOperation = TableOperation.InsertOrReplace(entity);
            TableResult result = await tableref.ExecuteAsync(insertOrReplaceOperation).ConfigureAwait(false);

            return result.Result;
        }

        public async Task<object> UpdateAsync(string tableName, TableEntity entity)
        {
            var tableref = _tableClient.GetTableReference(tableName);
            // Updates the entity.
            TableOperation replaceOperation = TableOperation.Replace(entity);
            TableResult result = await tableref.ExecuteAsync(replaceOperation).ConfigureAwait(false);

            return result.Result;
        }

        public async Task<object> DeleteAsync(string tableName, TableEntity entity)
        {
            var tableref = _tableClient.GetTableReference(tableName);

            TableOperation deleteOperation = TableOperation.Delete(entity);
            TableResult result = await tableref.ExecuteAsync(deleteOperation).ConfigureAwait(false);

            return result.Result;
        }

        public async Task<object> UpdateItemsAsync(string tableName, TableEntity entity)
        {
            var tableref = _tableClient.GetTableReference(tableName);
            // by partition and rwo keys
            TableOperation retrieveOperation = TableOperation.Merge(entity);
            TableResult result = await tableref.ExecuteAsync(retrieveOperation);
            return result.Result;
        }
    }
}
