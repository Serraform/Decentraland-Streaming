using Moralis.AuthApi.Models;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using SRFM.MediaServices.API.Services.Moralis;

namespace SRFM.MediaServices.API
{
    public interface IMoralisService
    {
        public Task<ChallengeResponseDto> RequestEVM(StringContent fileName);

        public Task<CompleteChallengeResponseDto> VerifyEVM(StringContent assetId);
    }
}
