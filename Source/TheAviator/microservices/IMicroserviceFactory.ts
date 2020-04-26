// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from './Microservice';
import { MicroserviceDefinition } from './MicroserviceDefinition';

export interface IMicroserviceFactory {
    create(platform: string, workingDirectory: string, definition: MicroserviceDefinition): Promise<Microservice>
}
