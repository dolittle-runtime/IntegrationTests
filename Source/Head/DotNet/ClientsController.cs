// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using Dolittle.SDK.EventHorizon;
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
        public IActionResult StopClient(string runtimeHost, ushort runtimePort, string microserviceId)
        {
            _logger.LogInformation("Stopping client");
            _clients.RemoveAndStop(new ClientId(microserviceId, runtimeHost, runtimePort));
            return Ok();
        }


        [HttpPost]
        [Route("Subscribe/{runtimeHost}/{runtimePort}/{microserviceId}")]
        public IActionResult SubscribeToEventHorizon(string runtimeHost, ushort runtimePort, string microserviceId, [FromBody]SubscriptionRequestBody body)
        {
            _logger.LogInformation("Subscribing to event horizon");
            var clientId = new ClientId(microserviceId, runtimeHost, runtimePort);
            if (_clients.TryGetDolittleClient(clientId, out var client))
            {
                client.EventHorizons.Subscribe(new Subscription(
                    body.ConsumerTenant,
                    body.ProducerMicroservice,
                    body.ProducerTenant,
                    body.ProducerStream,
                    body.ProducerPartition,
                    body.ConsumerScope));
                return Ok();
            }
            throw new Exception($"Client {clientId} does not exist");
        }

        public record SubscriptionRequestBody(
            Guid ConsumerTenant,
            Guid ProducerMicroservice,
            Guid ProducerTenant,
            Guid ProducerStream,
            Guid ProducerPartition,
            Guid ConsumerScope);
    }
}
