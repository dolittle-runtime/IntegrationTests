
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using System.Threading.Tasks;
using Dolittle.SDK;
using Dolittle.SDK.Microservices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Head
{
    [Route("/api/Events")]
    public class EventsController : Controller
    {
        readonly IClients _clients;
        readonly ILogger<EventsController> _logger;

        public EventsController(
            IClients clients,
            ILogger<EventsController> logger)
        {
            _clients = clients;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Status()
            => Ok("Everything is OK");

        [HttpPost]
        [Route("{runtimeHost}/{runtimePort}/{microserviceId}/{tenantId}/{eventSource}")]
        public async Task<IActionResult> Event(string runtimeHost, ushort runtimePort, string microserviceId, string tenantId, string eventSource, [FromBody] Event[] events)
        {
            var client = GetClient(microserviceId, runtimeHost, runtimePort);
            try
            {
                _logger.LogInformation($"Committing events for tenant with Id '{tenantId}'");
                var committed = await client.EventStore
                    .ForTenant(tenantId)
                    .Commit(_ =>
                    {
                        foreach (var evt in events) _.CreateEvent(evt).FromEventSource(eventSource);
                    }).ConfigureAwait(false);
                foreach (var evt in committed) Console.WriteLine($"Committed event {evt.Content}");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Problem committing event");
                return Problem(ex.Message, tenantId, 500);
            }
        }

        [HttpPost]
        [Route("Public/{runtimeHost}/{runtimePort}/{microserviceId}/{tenantId}/{eventSource}")]
        public async Task<IActionResult> Public(string runtimeHost, ushort runtimePort, string microserviceId, string tenantId, string eventSource, [FromBody] PublicEvent[] events)
        {
            var client = GetClient(microserviceId, runtimeHost, runtimePort);
            try
            {
                _logger.LogInformation($"Committing public events for tenant with Id '{tenantId}'");
                var committed = await client.EventStore
                    .ForTenant(tenantId)
                    .Commit(_ =>
                    {
                        foreach (var evt in events) _.CreatePublicEvent(evt).FromEventSource(eventSource);
                    }).ConfigureAwait(false);
                foreach (var evt in committed) Console.WriteLine($"Committed event {evt.Content}");

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Problem committing public event");
                return Problem(ex.Message, tenantId, 500);
            }
        }

        [HttpPost]
        [Route("Aggregate/{runtimeHost}/{runtimePort}/{microserviceId}/{tenantId}/{eventSource}/{version}")]
        public async Task<IActionResult> Aggregate(
            string runtimeHost,
            ushort runtimePort,
            string microserviceId, 
            string tenantId,
            string eventSource,
            ulong version,
            [FromBody] AggregateEvent[] events)
        {
            var client = GetClient(microserviceId, runtimeHost, runtimePort);
            try
            {
                _logger.LogInformation($"Committing aggregate events for tenant with Id '{tenantId}'");
                // await client
                //     .AggregateOf<MyAggregate>(eventSource, _ => _.ForTenant(tenantId))
                //     .Perform(_ =>
                //     {
                //         foreach (var evt in events) _.Apply(evt);
                //     }).ConfigureAwait(false);
                var committed = await client.EventStore
                    .ForTenant(tenantId)
                    .ForAggregate("b2f756c2-b4bb-4546-8cb3-33a4eaa2bbda")
                    .WithEventSource(eventSource)
                    .ExpectVersion(version)
                    .Commit(_ =>
                    {
                        foreach (var evt in events) _.CreateEvent(evt);
                    }).ConfigureAwait(false);
                
                foreach (var evt in committed) Console.WriteLine($"Committed event {evt.Content}");

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Problem committing aggregate event");
                return Problem(ex.Message, tenantId, 500);
            }
        }

        Client GetClient(MicroserviceId microservice, string runtimeHost, ushort runtimePort)
        {
            var clientId = new ClientId(microservice, runtimeHost, runtimePort);
            if (_clients.TryGetDolittleClient(clientId, out var client)) return client;
            throw new Exception($"Could not get client {clientId}");
        }
    }
}
