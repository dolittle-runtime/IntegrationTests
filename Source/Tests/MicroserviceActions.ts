// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fetch from 'node-fetch';

import { Microservice } from './Microservice';
import { IMicroserviceActions } from './IMicroserviceActions';

export class MicroserviceActions implements IMicroserviceActions {
    constructor(private _microservice: Microservice) {
    }

    async checkStatus(): Promise<string> {
        const url = `${this.getHeadBaseUrl()}/api/Events`;
        const response = await fetch(url);
        const result = await response.text();
        return result;
    }

    async sendEvent(artifactId: import("@dolittle/rudiments").Guid, content: any): Promise<boolean> {
        const url = `${this.getHeadBaseUrl()}/api/Events/Single`;
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(content),
            headers: { 'Content-Type': 'application/json' }
        });
        return response.ok;
    }

    async getRuntimeMetrics(): Promise<string> {
        const url = `http://localhost:${this._microservice.runtime.boundPorts.get(9700)}/metrics`;
        const response = await fetch(url);
        const result = await response.text();
        return result;
    }

    private getHeadBaseUrl() {
        return `http://localhost:${this._microservice.head.boundPorts.get(5000)}`;
    }
}
