// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IContainerFactory } from './IContainerFactory';
import { IContainer } from './IContainer';
import { ContainerOptions } from './ContainerOptions';
import { Container } from './Container';

import Docker from 'dockerode';

export class ContainerFactory implements IContainerFactory {
    private _docker: Docker;


    constructor() {
        this._docker = new Docker();
    }

    create(options: ContainerOptions): IContainer {
        return new Container(options, this._docker);
    }
}
