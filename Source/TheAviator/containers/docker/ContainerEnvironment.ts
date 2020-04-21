// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { retry } from 'async';
import Docker from 'dockerode';

import { ContainerOptions, IContainerEnvironment, IContainer } from '../';

import { Container } from './Container';

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

    async removeNetwork(name: string): Promise<void> {
        const network = await this._docker.getNetwork(name);

        try {
            await retry({ times: 10, interval: 200 }, async (callback, results) => {
                const info = await network.inspect();
                if (Object.keys(info.Containers).length !== 0) {
                    callback(new Error('Containers left'));
                }
            });
        } catch (ex) {
            console.log(`Unable to remove network ${name}`);
        }
    }
}
