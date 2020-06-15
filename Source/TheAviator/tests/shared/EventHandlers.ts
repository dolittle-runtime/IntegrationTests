// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

export class EventHandlers {
    static eventHandlerId = Guid.parse('3dbe18b8-c74f-4b57-9c60-f88de4b024a5');
    static unpartitionedEventHandlerId = Guid.parse('e2cf3586-6bdc-4824-9a09-7fc1b5a0bb0e');
    static aggregateEventHandlerId = Guid.parse('2a494827-841c-43c2-b163-238ac9314f4a');
    static unpartitionedAggregateEventHandlerId = Guid.parse('bb3d3253-0f55-4710-b278-64e2fc29646c');
    static publicEventHandlerId = Guid.parse('77ab759e-89b2-48c3-bedd-6b7327847f07');
    static unpartitionedPublicEventHandlerId = Guid.parse('80e1032c-6276-409e-961c-217010f84219');
}
