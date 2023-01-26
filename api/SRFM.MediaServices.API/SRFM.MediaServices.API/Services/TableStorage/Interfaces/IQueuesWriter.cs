using System.Net.Http;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public interface IQueuesWriter
    {
        public Task AddQueuesMessageAsync(string queueName, string message);
    }
}
