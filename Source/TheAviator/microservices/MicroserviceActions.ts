// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fetch from 'node-fetch';
import { Guid } from '@dolittle/rudiments';

import { Microservice } from './Microservice';
import { IMicroserviceActions } from './IMicroserviceActions';


export class MicroserviceActions implements IMicroserviceActions {
    constructor(private _microservice: Microservice) {
    }

    async checkStatus(): Promise<string> {
        try {
            const url = `${this.getHeadBaseUrl()}/api/Events`;
            const response = await fetch(url, { timeout: 1000 });
            const result = await response.text();
            return result;
        } catch (ex) {
            return '';
        }
    }

    async commitEvent(tenantId: Guid, eventSource: Guid, artifactId: Guid, content: any, publicEvent: boolean = false): Promise<void> {
        try {
            const action = publicEvent ? 'SinglePublic' : 'Single';
            const url = `${this.getHeadBaseUrl()}/api/Events/${action}/${tenantId.toString()}/${eventSource.toString()}`;
            await fetch(url, {
                method: 'post',
                body: JSON.stringify(content),
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            });
        } catch (ex) {
        }
    }

    async commitPublicEvent(tenantId: Guid, eventSource: Guid, artifactId: Guid, content: any): Promise<void> {
        await this.commitEvent(tenantId, eventSource, artifactId, content, true);
    }

    async commitAggregateEvent(tenantId: Guid, eventSource: Guid, version: number, artifactId: Guid, content: any): Promise<void> {
        try {
            const url = `${this.getHeadBaseUrl()}/api/Events/SingleAggregate/${tenantId.toString()}/${eventSource.toString()}/${version}`;
            await fetch(url, {
                method: 'post',
                body: JSON.stringify(content),
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            });
        } catch (ex) { }
    }


    async getRuntimeMetrics(): Promise<string> {
        try {
            const url = `http://localhost:${this._microservice.runtime.boundPorts.get(9700)}/metrics`;
            const response = await fetch(url, { timeout: 1000 });
            const result = await response.text();
            return result;
        } catch (ex) {
            return '';
        }
    }

    private getHeadBaseUrl() {
        return `http://localhost:${this._microservice.head.boundPorts.get(5000)}`;
    }
}
