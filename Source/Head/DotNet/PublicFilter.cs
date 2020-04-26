// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System.Threading.Tasks;
using Dolittle.Events;
using Dolittle.Events.Filters;
using Dolittle.Events.Filters.EventHorizon;

namespace Head
{
    [Filter("82f35eaa-8317-4c8b-9bd6-f16c212fda96")]
    public class PublicFilter : ICanFilterPublicEvents
    {
        public Task<FilterResult> Filter(CommittedEvent @event)
        {
            return Task.FromResult(new FilterResult(true));
        }
    }
}