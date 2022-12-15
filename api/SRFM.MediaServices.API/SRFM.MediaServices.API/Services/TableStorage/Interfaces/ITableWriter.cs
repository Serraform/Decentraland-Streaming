using SRFM.MediaServices.API.Models;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public interface ITableWriter
    {
        public Task<ResponseMessage> UpdateUserAsync(UserDB user);
    }
}