using Microsoft.WindowsAzure.Storage.Table;
using SRFM.MediaServices.API.Models;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public interface ITableWriter
    {
        public Task<ResponseMessage> UpdateUserAsync(UserDB user);

        public Task<object> AddAsync(string tableName, TableEntity entity);

        //Adds the or update entity
        public Task<object> UpsertAsync(string tableName, TableEntity entity);

        //Updates the entity.
        public Task<object> UpdateAsync(string tableName, TableEntity entity);

        public Task<object> DeleteAsync(string tableName, TableEntity entity);


        public Task<object> UpdateItemsAsync(string tableName, TableEntity entity);
    }
}