// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using Dolittle.DependencyInversion;
using Dolittle.Events;
using Dolittle.Execution;
using Dolittle.Logging;
using Dolittle.Tenancy;
using Microsoft.AspNetCore.Mvc;

namespace Head
{
    [Route("/api/Events")]
    public class EventsController : Controller
    {
        readonly IExecutionContextManager _executionContextManager;
        readonly FactoryFor<IEventStore> _eventStore;
        readonly ILogger _logger;

        public EventsController(
            IExecutionContextManager executionContextManager,
            FactoryFor<IEventStore> eventStore,
            ILogger logger)
        {
            _executionContextManager = executionContextManager;
            _eventStore = eventStore;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Status()
        {
            return Ok("Everything is OK");
        }

        [HttpPost]
        [Route("Single/{tenantId}")]
        public IActionResult Single(string tenantId, [FromBody] MyEvent @event)
        {
            try
            {
                _logger.Information($"Committing event for tenant with Id '{tenantId}'");
                _executionContextManager.CurrentFor((TenantId)Guid.Parse(tenantId));
                var eventStore = _eventStore();
                var events = new UncommittedEvents();
                events.Append(@event);
                eventStore.Commit(events);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Problem committing event");
                return Problem(ex.Message, tenantId, 500);
            }
        }
    }
}
