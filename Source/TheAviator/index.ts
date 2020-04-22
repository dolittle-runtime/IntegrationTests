// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Aviator } from './Aviator';

import { single_event_committed } from './tests/single_event_committed';
import { two_events_with_pause_inbetween_committed } from './tests/two_events_with_pause_inbetween_committed';
import { twenty_events_committed } from './tests/twenty_events_committed';



// https://unicode-table.com/en/

(async () => {
    const aviator = Aviator.getFor('dotnet');
    const flight = await aviator.performFlightWith(
        single_event_committed,
        two_events_with_pause_inbetween_committed,
        twenty_events_committed
    );

    console.log('We are done');

    process.exit();
})();
