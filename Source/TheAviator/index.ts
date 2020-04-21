// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Aviator } from './Aviator';

import { single_events_committed } from './tests/single_events_committed';

(async () => {
    const aviator = Aviator.getFor('dotnet');
    const flight = await aviator.performFlightWith(
        single_events_committed
    );

    console.log('We are done');

    process.exit();
})();
