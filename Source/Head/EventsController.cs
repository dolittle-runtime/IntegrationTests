// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Microsoft.AspNetCore.Mvc;

namespace Head
{
    [Route("/api/Events")]
    public class EventsController : Controller
    {
        [HttpGet]
        public IActionResult Status()
        {
            return Ok("Everything is OK");
        }

        [HttpPost]
        [Route("Single")]
        public IActionResult SingleEvent()
        {
            return Ok();
        }
    }
}
