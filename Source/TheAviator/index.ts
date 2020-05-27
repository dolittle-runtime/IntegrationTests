// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import Banner from './Banner';

import teamsIntegration from './integration/teams';
import { AvailableFlights } from './AvailableFlights';

import { setupAPI } from './api';

// https://unicode-table.com/en/

Banner.present();


(async () => {
    await AvailableFlights.main();
    //await AvailableFlights.simulate();
})();

//setupAPI();
