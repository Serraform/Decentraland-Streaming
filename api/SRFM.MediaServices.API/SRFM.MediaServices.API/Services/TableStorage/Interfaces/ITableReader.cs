using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public interface ITableReader
    {
        public Task<List<T>> ListItemsByWalletIdAsync<T>(string tableName, string rowKey) where T : TableEntity, new();

        public Task<List<T>> ListItemsAsync<T>(string tableName,string partitionKey) where T : TableEntity, new();

        public Task<List<T>> ListIsActiveItemsAsync<T>(string tableName, string partitionKey, bool isActive) where T : TableEntity, new();

        public Task<T> GetItemsByRowKeyAsync<T>(string tableName, string walletId) where T : TableEntity;
    }
}