// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Flight } from './Flight';

export interface IFlightReporter {
    observe(flight: Flight): void;
}
