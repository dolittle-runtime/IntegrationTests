// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AvailableFlights } from './AvailableFlights';
process.env.AVIATOR_K8S_DEFAULT = 'true';

run();

async function run() {
    await AvailableFlights.main();

}