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

    async removeNetwork(name: string): Promise<void> {
        const network = await this._docker.getNetwork(name);

        const attempt = async (): Promise<Boolean> => {
            const info = await network.inspect();
            return Object.keys(info.Containers).length === 0;
        };

        let attempts = 5;
        return new Promise((resolve) => {
            const checkResultAndResolve = (result: Boolean) => {
                attempts -= 1;
                if (attempts <= 0) {
                    network.remove().then(resolve);
                }
                if (result) {
                    network.remove().then(resolve);
                } else {
                    setTimeout(() => attempt().then(checkResultAndResolve), 200);
                }
            };
            attempt().then(checkResultAndResolve);
        });
    }
}
