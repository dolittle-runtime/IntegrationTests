// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Reason } from '@dolittle/rules';

export const EventIsMissing: Reason = Reason.create('ffa82a7b-4dd3-49df-8ab0-08970f7508cc', 'Event is missing');
export const EventsAreMissing: Reason = Reason.create('7198d144-f90c-4089-9035-53558f9d0479', 'Events are missing - looked for {desired}, found {actual}');
