using Azure.Storage.Queues;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using System.Threading.Tasks;

namespace SRFM.MediaServices.API
{
    public class QueuesWriter : IQueuesWriter
    {
        private CloudQueueClient _queueClient;
        private ILogger<QueuesWriter> _logger;

        public QueuesWriter(CloudQueueClient QueueClient, ILogger<QueuesWriter> logger)
        {
            _queueClient = QueueClient;
            _logger = logger;
        }

        public async Task AddQueuesMessageAsync(string queueName, string message)
        {
            var tableref = _queueClient.GetQueueReference(queueName);

            CloudQueueMessage queueMessage = new CloudQueueMessage(message);
            await tableref.AddMessageAsync(queueMessage);
            _logger.LogInformation($"Message added in Queues: {message}");
        }
    }
}