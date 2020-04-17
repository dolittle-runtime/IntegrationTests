// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IContainerEnvironment } from './IContainerEnvironment';
import { IContainer } from './IContainer';
import { ContainerOptions } from './ContainerOptions';
import { Container } from './Container';

import Docker from 'dockerode';

export class ContainerEnvironment implements IContainerEnvironment {
    private _docker: Docker;

    constructor() {
        this._docker = new Docker();
    }

    createContainer(options: ContainerOptions): IContainer {
        return new Container(options, this._docker);
    }

    async createNetwork(name: string) {
        await this._docker.createNetwork({
            Name: name
        });
    }

    async removeNetwork(name: string) {
        const network = await this._docker.getNetwork(name);
        await network.remove();
    }
}
