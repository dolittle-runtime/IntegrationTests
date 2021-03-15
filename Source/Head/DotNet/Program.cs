// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Head
{
    static class Program
    {
        public static async Task Main(string[] args) =>
            await CreateHostBuilder(args)
                .Build()
                .RunAsync().ConfigureAwait(false);

        static IHostBuilder CreateHostBuilder(string[] args)
        {
            var appConfig = new ConfigurationBuilder()
                                    .AddJsonFile("appsettings.json")
                                    .Build();
            return Host.CreateDefaultBuilder(args)
                .UseEnvironment("Development")
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                        .UseUrls("http://*:5000")
                        .UseKestrel()
                        .UseStartup(context => new Startup(LoggerFactory.Create(_ =>
                        {
                            _.AddConsole();
                            _.AddConfiguration(appConfig);
                        })));
                });
        }
    }
}
