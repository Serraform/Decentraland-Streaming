using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.WindowsAzure.Storage;
using Microsoft.Extensions.Azure;
using Azure.Storage.Queues;
using Azure.Core.Extensions;
using SRFM.MediaServices.API.Services.LivePeer;
using Microsoft.Extensions.Options;

namespace SRFM.MediaServices.API
{
    public class Startup
    {
        private string AllowedOrigins = "_allowedOrigins";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            //services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);
            //    .AddMicrosoftIdentityWebApi(Configuration.GetSection("AzureAd"));

            services.AddCors(options =>
            {
                options.AddPolicy(AllowedOrigins,
                                policy =>
                                {
                                    policy.WithOrigins("http://127.0.0.1:5500")
                                                        .AllowAnyHeader()
                                                        .AllowAnyMethod();
                                });
            });

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme,
            options => Configuration.Bind("JwtSettings", options));

            services.AddControllers();
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SRFM.MediaServices.API", Version = "v1" });
            });

            services.Configure<LivePeerConfig>(options => Configuration.GetSection("LivePeerConfig").Bind(options));
            services.Configure<MoralisConfig>(options => Configuration.GetSection("MoralisConfig").Bind(options));

            services.AddSingleton<ITableReader, TableReader>();   //ITableWriter
            services.AddSingleton<ITableWriter, TableWriter>();
            services.AddSingleton<IQueuesWriter, QueuesWriter>();
            services.AddSingleton<IAssetManager, AssetManager>();
            services.AddSingleton<IProcess, Process>();

            // add tablestorage as singleton
            services.AddSingleton(factory =>
            {
                string connectionString = Configuration.GetValue<string>("TableConfig:connectionString");                

                var storageAcc = CloudStorageAccount.Parse(connectionString);
                var client = storageAcc.CreateCloudTableClient();

                return client;                

            });

            // add tablestorage as singleton
            services.AddSingleton(factory =>
            {
                string connectionString = Configuration.GetValue<string>("TableConfig:connectionString");

                var storageAcc = CloudStorageAccount.Parse(connectionString);
                var client = storageAcc.CreateCloudQueueClient();

                return client;

            });

            services.AddLogging();
            services.AddHttpClient<LivePeerService>();
            services.AddAzureClients(builder =>
            {
                builder.AddBlobServiceClient(Configuration["TableConfig:connectionString:blob"], preferMsi: true);
                builder.AddQueueServiceClient(Configuration["TableConfig:connectionString:queue"], preferMsi: true);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SRFM.MediaServices.API v1"));
            }

            app.UseHttpsRedirection();

            // Enable CORS policy
            app.UseCors(AllowedOrigins);

            app.UseRouting();
            
            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials()); // allow credentials

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseMiddleware<GlobalErrorHandlingMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            Moralis.MoralisClient.ConnectionData = new Moralis.Models.ServerConnectionData()
            {
                ApiKey = Configuration.GetValue<string>("MoralisConfig:ApiKey")
            };
        }
    }
    internal static class StartupExtensions
    {
        public static IAzureClientBuilder<BlobServiceClient, BlobClientOptions> AddBlobServiceClient(this AzureClientFactoryBuilder builder, string serviceUriOrConnectionString, bool preferMsi)
        {
            if (preferMsi && Uri.TryCreate(serviceUriOrConnectionString, UriKind.Absolute, out Uri serviceUri))
            {
                return builder.AddBlobServiceClient(serviceUri);
            }
            else
            {
                return builder.AddBlobServiceClient(serviceUriOrConnectionString);
            }
        }
        public static IAzureClientBuilder<QueueServiceClient, QueueClientOptions> AddQueueServiceClient(this AzureClientFactoryBuilder builder, string serviceUriOrConnectionString, bool preferMsi)
        {
            if (preferMsi && Uri.TryCreate(serviceUriOrConnectionString, UriKind.Absolute, out Uri serviceUri))
            {
                return builder.AddQueueServiceClient(serviceUri);
            }
            else
            {
                return builder.AddQueueServiceClient(serviceUriOrConnectionString);
            }
        }
    }
}
