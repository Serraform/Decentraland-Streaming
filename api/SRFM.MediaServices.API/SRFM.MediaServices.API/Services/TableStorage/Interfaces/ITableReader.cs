using System.Collections.Generic;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public interface ITableReader
    {
        public Task<List<T>> GetItemsAsync<T>(string query, string tableName);
    }
}