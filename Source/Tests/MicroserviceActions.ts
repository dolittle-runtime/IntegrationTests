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

    sendEvent(artifactId: import("@dolittle/rudiments").Guid, content: any): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    private getHeadBaseUrl() {
        return `http://localhost:${this._microservice.head.boundPorts.get(5000)}`;
    }
}
