// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { MicroserviceDefinition } from '../microservices';

export class ScenarioEnvironmentDefinition {
    private _tenants: Guid[] | undefined;
    private _microservicesToPrepare: MicroserviceDefinition[] = [];

    readonly name: string;
    readonly consumerToProducerMap: { [key: string]: MicroserviceDefinition[]} = {};

    constructor(name: string) {
        this.name = name;
    }

    get microservices(): MicroserviceDefinition[] {
        return this._microservicesToPrepare.slice();
    }

    withTenants(tenants: Guid[]): ScenarioEnvironmentDefinition {
        this._tenants = tenants;
        return this;
    }

    withMicroservice(name: string, tenants: Guid[] | undefined): ScenarioEnvironmentDefinition {
        this._microservicesToPrepare.push(new MicroserviceDefinition(name, (tenants ?? this._tenants) ?? []));
        return this;
    }

    connectProducerToConsumer(producerName: string, consumerName: string) {
        const producer = this._microservicesToPrepare.find(_ => _.name === producerName);
        const consumer = this._microservicesToPrepare.find(_ => _.name === consumerName);
        if (producer && consumer) {
            consumer.addProducer(producer);
            this.consumerToProducerMap[consumerName] = this.consumerToProducerMap[consumerName] || [];
            this.consumerToProducerMap[consumerName].push(producer);
        }
    }
}

