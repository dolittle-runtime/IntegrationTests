// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from './Microservice';
import { Guid } from '@dolittle/rudiments';

export interface IMicroserviceFactory {
    create(platform: string, name: string, tenants: Guid[], workingDirectory: string): Promise<Microservice>
}
