// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

export class MicroserviceDefinition {
    readonly identifier: Guid;
    readonly name: string;
    readonly tenants: Guid[];
    readonly producers: MicroserviceDefinition[] = [];

    constructor(name: string, tenants: Guid[]) {
        this.identifier = Guid.create();
        this.name = name;
        this.tenants = tenants;
    }

    addProducer(consumer: MicroserviceDefinition) {
        this.producers.push(consumer);
    }
}
