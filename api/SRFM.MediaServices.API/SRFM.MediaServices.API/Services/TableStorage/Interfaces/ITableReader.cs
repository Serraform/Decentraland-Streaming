using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public interface ITableReader
    {
        public Task<List<T>> ListItemsAsync<T>(string tableName, string walletId) where T : TableEntity, new();

        public Task<T> GetItemsAsync<T>(string tableName, string walletId) where T : TableEntity;
    }
}