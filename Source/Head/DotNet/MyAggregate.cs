// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Dolittle.SDK.Aggregates;
using Dolittle.SDK.Events;

namespace Head
{
    [AggregateRoot("b2f756c2-b4bb-4546-8cb3-33a4eaa2bbda")]
    public class MyAggregate : AggregateRoot
    {
        public MyAggregate(EventSourceId eventSourceId) : base(eventSourceId) {}
    }
}
