// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from './Microservice';
import { IContainerFactory } from './IContainerFactory';

export class MicroserviceFactory {

    constructor(containerFactory: IContainerFactory) {
    }

    create(): Microservice {
        throw new Error('Not implemented');
    }
}
