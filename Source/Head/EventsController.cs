// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using Dolittle.DependencyInversion;
using Dolittle.Events;
using Dolittle.Execution;
using Dolittle.Tenancy;
using Microsoft.AspNetCore.Mvc;

namespace Head
{
    [Route("/api/Events")]
    public class EventsController : Controller
    {
        readonly IExecutionContextManager _executionContextManager;
        readonly FactoryFor<IEventStore> _eventStore;

        public EventsController(IExecutionContextManager executionContextManager, FactoryFor<IEventStore> eventStore)
        {
            _executionContextManager = executionContextManager;
            _eventStore = eventStore;
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
            _executionContextManager.CurrentFor((TenantId)Guid.Parse(tenantId));
            var eventStore = _eventStore();
            var events = new UncommittedEvents();
            events.Append(@event);
            eventStore.Commit(events);
            return Ok();
        }
    }
}
