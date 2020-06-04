// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
            ILogger<EventsController> logger)
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
        [Route("Single/{tenantId}/{eventSource}")]
        public async Task<IActionResult> Single(string tenantId, string eventSource, [FromBody] MyEvent @event)
        {
            try
            {
                _logger.Information($"Committing event for tenant with Id '{tenantId}'");
                await CommitEvents(Guid.Parse(tenantId), Guid.Parse(eventSource), @event).ConfigureAwait(false);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Problem committing event");
                return Problem(ex.Message, tenantId, 500);
            }
        }

        [HttpPost]
        [Route("Multiple/{tenantId}/{eventSource}")]
        public async Task<IActionResult> Multiple(string tenantId, string eventSource, [FromBody] IEnumerable<MyEvent> events)
        {
            try
            {
                _logger.Information($"Committing event for tenant with Id '{tenantId}'");
                await CommitEvents(Guid.Parse(tenantId), Guid.Parse(eventSource), events.ToArray()).ConfigureAwait(false);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Problem committing event");
                return Problem(ex.Message, tenantId, 500);
            }
        }

        [HttpPost]
        [Route("SinglePublic/{tenantId}/{eventSource}")]
        public async Task<IActionResult> SinglePublic(string tenantId, string eventSource, [FromBody] MyPublicEvent @event)
        {
            try
            {
                _logger.Information($"Committing event for tenant with Id '{tenantId}'");
                await CommitEvents(Guid.Parse(tenantId), Guid.Parse(eventSource), @event).ConfigureAwait(false);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Problem committing event");
                return Problem(ex.Message, tenantId, 500);
            }
        }

        [HttpPost]
        [Route("MultiplePublic/{tenantId}/{eventSource}")]
        public async Task<IActionResult> MultiplePublic(string tenantId, string eventSource, [FromBody] IEnumerable<MyPublicEvent> events)
        {
            try
            {
                _logger.Information($"Committing event for tenant with Id '{tenantId}'");
                await CommitEvents(Guid.Parse(tenantId), Guid.Parse(eventSource), events.ToArray()).ConfigureAwait(false);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Problem committing event");
                return Problem(ex.Message, tenantId, 500);
            }
        }

        [HttpPost]
        [Route("SingleAggregate/{tenantId}/{eventSource}/{version}")]
        public async Task<IActionResult> SingleAggregate(string tenantId, string eventSource, ulong version, [FromBody] MyAggregateEvent @event)
        {
            try
            {
                _logger.Information($"Committing event for tenant with Id '{tenantId}'");
                await CommitAggregateEvents(Guid.Parse(tenantId), Guid.Parse(eventSource), typeof(MyAggregate), version, @event).ConfigureAwait(false);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Problem committing event");
                return Problem(ex.Message, tenantId, 500);
            }
        }

        [HttpPost]
        [Route("MultipleAggregate/{tenantId}/{eventSource}/{version}")]
        public async Task<IActionResult> MultipleAggregate(string tenantId, string eventSource, ulong version, [FromBody] IEnumerable<MyAggregateEvent> events)
        {
            try
            {
                _logger.Information($"Committing event for tenant with Id '{tenantId}'");
                await CommitAggregateEvents(Guid.Parse(tenantId), Guid.Parse(eventSource), typeof(MyAggregate), version, events.ToArray()).ConfigureAwait(false);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Problem committing event");
                return Problem(ex.Message, tenantId, 500);
            }
        }

        Task<CommittedEvents> CommitEvents(TenantId tenantId, EventSourceId eventSource, params IEvent[] events)
        {
            _executionContextManager.CurrentFor(tenantId);
            var eventStore = _eventStore();
            var uncommittedEvents = new UncommittedEvents();
            foreach (var @event in events)
            {
                uncommittedEvents.Append(new EventSourceId(eventSource), @event);
            }
            return eventStore.Commit(uncommittedEvents);
        }

        Task<CommittedAggregateEvents> CommitAggregateEvents(TenantId tenantId, EventSourceId eventSource, Type aggregateRootType, AggregateRootVersion version, params IEvent[] events)
        {
            _executionContextManager.CurrentFor(tenantId);
            var eventStore = _eventStore();
            var uncommittedEvents = new UncommittedAggregateEvents(eventSource, aggregateRootType, version);
            foreach (var @event in events)
            {
                uncommittedEvents.Append(@event);
            }
            return eventStore.CommitForAggregate(uncommittedEvents);
        }
    }
}
