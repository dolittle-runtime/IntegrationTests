// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System.Net;
using System.Text;
using System.Threading.Tasks;
using Dolittle.Booting;

namespace Head
{
    public class HttpServer : ICanPerformBootProcedure
    {
        HttpListener _listener;
        public bool CanPerform() => true;

        public void Perform()
        {
            _listener = new HttpListener();
            _listener.Prefixes.Add("http://*:80/");
            _listener.Start();

            Task.Run(Server);
        }

        async Task Server()
        {
            while (true)
            {
                try
                {
                    var context = await _listener.GetContextAsync().ConfigureAwait(false);

                    var response = "ok";
                    var responseBytes = Encoding.UTF8.GetBytes(response);

                    context.Response.StatusCode = 200;
                    context.Response.ContentType = "text";
                    context.Response.ContentLength64 = responseBytes.Length;
                    context.Response.OutputStream.Write(responseBytes, 0, responseBytes.Length);
                }
                catch
                {
                }
            }
        }
    }
}
