// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;

namespace Head
{
    public record EventProcessorId(ClientId Client, Guid EventProcessor);
    public interface IEventProcessorTrackers
    {

    }
    public class EventProcessorTrackers : IEventProcessorTrackers
    {
        
    }
}