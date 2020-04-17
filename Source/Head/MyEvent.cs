// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using Dolittle.Events;

namespace Head
{
    public class MyEvent : IEvent
    {
        public string UniqueIdentifier { get; set; }
    }
}
