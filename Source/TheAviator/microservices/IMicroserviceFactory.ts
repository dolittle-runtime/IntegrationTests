// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from './Microservice';
import { MicroserviceConfiguration } from './configuration/MicroserviceConfiguration';

export interface IMicroserviceFactory {
    create(platform: string, workingDirectory: string, configuration: MicroserviceConfiguration): Promise<Microservice>
}
