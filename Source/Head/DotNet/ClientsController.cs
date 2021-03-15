using System.Threading;
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using System.Linq;
using System.Threading.Tasks;
using Dolittle.SDK;
using Dolittle.SDK.Events;
using Dolittle.SDK.Events.Filters;
using Dolittle.SDK.Events.Store;
using Dolittle.SDK.Microservices;
using Dolittle.SDK.Tenancy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Head
{
    [Route("/api/Clients")]
    public class ClientsController : Controller
    {
        readonly ILogger<ClientsController> _logger;
        readonly IClients _clients;

        public ClientsController(
            ILogger<ClientsController> logger,
            IClients clients)
        {
            _logger = logger;
            _clients = clients;
        }

        [HttpGet]
        public IActionResult Status()
            => Ok("Everything is OK");

        [HttpPost]
        [Route("Start/{runtimeHost}/{runtimePort}/{microserviceId}")]
        public IActionResult StartClient(string runtimeHost, ushort runtimePort, string microserviceId)
        {
            _logger.LogInformation("Starting client");
            _clients.TryAddAndStart(new ClientId(microserviceId, runtimeHost, runtimePort));
            return Ok();
        }

        [HttpPost]
        [Route("Stop/{runtimeHost}/{runtimePort}/{microserviceId}")]
        public IActionResult StopClient(string runtimeHost, ushort runtimePort, string microserviceId, string tenantId, string eventSource, [FromBody] PublicEvent[] events)
        {
            _logger.LogInformation("Stopping client");
            _clients.RemoveAndStop(new ClientId(microserviceId, runtimeHost, runtimePort));
            return Ok();
        }
    }
}
