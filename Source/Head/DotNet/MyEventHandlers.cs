// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using System.Threading.Tasks;
using Dolittle.SDK.Events;
using Dolittle.SDK.Events.Handling;

namespace Head
{
    [EventHandler("3dbe18b8-c74f-4b57-9c60-f88de4b024a5")]
    public class MyEventHandler
    {
        public Task Handle(Event @event, EventContext context)
        {
            if (@event.Fail) throw new Exception("Failed");
            return Task.CompletedTask;
        }
    }
    
    [EventHandler("2a494827-841c-43c2-b163-238ac9314f4a")]
    public class MyAggregateEventHandler
    {
        public Task Handle(AggregateEvent @event, EventContext context)
        {
            if (@event.Fail) throw new Exception("Failed");
            return Task.CompletedTask;
        }
    }

    [EventHandler("77ab759e-89b2-48c3-bedd-6b7327847f07", inScope: "de594e7b-d160-44e4-9901-ae84fc70424a")]
    public class MyPublicEventHandler
    {
        public Task Handle(PublicEvent @event, EventContext context)
        {
            if (@event.Fail) throw new Exception("Failed");
            return Task.CompletedTask;
        }
    }

    [EventHandler("e2cf3586-6bdc-4824-9a09-7fc1b5a0bb0e", partitioned: false)]
    public class MyUnpartitionedEventHandler
    {
        public Task Handle(Event @event, EventContext context)
        {
            if (@event.Fail) throw new Exception("Failed");
            return Task.CompletedTask;
        }
    }

    [EventHandler("bb3d3253-0f55-4710-b278-64e2fc29646c", partitioned: false)]
    public class MyUnpartitionedAggregateEventHandler
    {
        public Task Handle(AggregateEvent @event, EventContext context)
        {
            if (@event.Fail) throw new Exception("Failed");
            return Task.CompletedTask;
        }
    }

    [EventHandler("80e1032c-6276-409e-961c-217010f84219", partitioned: false, inScope: "de594e7b-d160-44e4-9901-ae84fc70424a")]
    public class MyUnpartitionedPublicEventHandler
    {
        public Task Handle(PublicEvent @event, EventContext context)
        {
            if (@event.Fail) throw new Exception("Failed");
            return Task.CompletedTask;
        }
    }
}