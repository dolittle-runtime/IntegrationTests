// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Dolittle.Events.Handling;

namespace Head
{
    [EventHandler("3dbe18b8-c74f-4b57-9c60-f88de4b024a5")]
    public class MyEventHandler : ICanHandleEvents
    {
        public void Handle(MyEvent @event)
        {
        }
    }
}