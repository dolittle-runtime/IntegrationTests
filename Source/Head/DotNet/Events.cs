// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.


using Dolittle.SDK.Events;

namespace Head
{
    [EventType("0e984977-1686-4036-98ef-14dc9f55f705")]
    public record Event(string UniqueIdentifier, bool Fail);
    
    [EventType("4d5e9860-d80c-442a-803c-68b324f3c9fe")]
    public record AggregateEvent(string UniqueIdentifier, bool Fail);
    
    [EventType("e317fb1a-40bd-4630-ba9c-f8f92b90b7f4")]
    public record PublicEvent(string UniqueIdentifier, bool Fail);

}
