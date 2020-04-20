// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PassThrough } from 'stream';

const getPort = require('get-port');

import * as Docker from 'dockerode';

import { ContainerInspectInfo } from 'dockerode';

import { IContainer } from './IContainer';
import { ContainerOptions } from './ContainerOptions';
import { Mount } from './Mount';
import { IWaitStrategy } from './IWaitStrategy';

/**
 * Represents an implementation of {IContainer} for Docker.
 */
export class Container implements IContainer {
    readonly options: ContainerOptions;
    readonly outputStream: NodeJS.ReadWriteStream;
    readonly boundPorts: Map<number, number>;

    _container: Docker.Container | undefined;

    /**
     * Creates an instance of container.
     * @param options {ContainerOptions} The Container options.
     * @param _dockerClient {Docker} The Docker client object.
     */
    constructor(options: ContainerOptions, private _dockerClient: Docker) {
        this.options = options;
        this.outputStream = new PassThrough();
        this.boundPorts = new Map<number, number>();
    }

    /** @inheritdoc */
    async configure() {
        if (this.options.exposedPorts) {
            for (const port of this.options.exposedPorts) {
                this.boundPorts.set(port, await getPort());
            }
        }
    }

    /** @inheritdoc */
    async start(...waitStrategies: IWaitStrategy[]) {
        const createOptions = this.getCreateOptions();
        this._container = await this._dockerClient.createContainer(createOptions);

        console.log(`Starting '${this.options.friendlyName}'`);
        await this._container.start();
        this._container.attach({ stream: true, stdout: true, stderr: true }, (err, stream) => {
            stream?.pipe(this.outputStream);
        });

        for (const strategy of waitStrategies) {
            try {
                await strategy.wait(this);
            } catch (ex) { }
        }
    }

    /** @inheritdoc */
    async stop() {
        if (!this._container) {
            return;
        }
        console.log(`Stopping '${this.options.friendlyName}'`);
        const state = await this._container.inspect();
        if (state.State.Running) {
            this._container.stop();
        }
    }

    /** @inheritdoc */
    async pause() {
        if (!this._container) {
            return;
        }
        console.log(`Pausing '${this.options.friendlyName}'`);
        const state = await this._container.inspect();
        if (state.State.Running) {
            this._container.stop();
        }
    }

    /** @inheritdoc */
    async resume() {
        if (!this._container) {
            return;
        }
        console.log(`Resume '${this.options.friendlyName}'`);
        const state = await this._container.inspect();
        if (state.State.Running) {
            this._container.stop();
        }
    }


    /** @inheritdoc */
    async kill() {
        if (!this._container) {
            return;
        }
        console.log(`Killing '${this.options.friendlyName}'`);
        try {
            const state = await this._container.inspect();
            try {
                await this._container.kill();
            } catch (kex) {
            }

            for (const mount of state.Mounts) {
                if (mount.Name) {
                    const volume = this._dockerClient.getVolume(mount.Name);
                    if (volume) {
                        await volume.remove();
                    }
                }
            }

            await this._container.remove();
        } catch (ex) {
        }
    }

    /** @inheritdoc */
    async restart() {
        if (!this._container) {
            return;
        }
        await this._container.stop();
        await this._container.start();
    }


    private getCreateOptions(): Docker.ContainerCreateOptions {
        return {
            name: this.options.name,
            Image: this.getImageName(),
            AttachStdout: true,
            AttachStderr: true,
            AttachStdin: false,
            ExposedPorts: this.getExposedPorts(),
            HostConfig: {
                PortBindings: this.getPortBindings(),
                Binds: this.getBinds(),
                RestartPolicy: {
                    Name: 'always'
                },
                NetworkMode: this.options.networkName ?? 'bridge'
            }
        };
    }

    private getVolumes() {
        const volumes: any = {};
        this.options.mounts?.forEach(mount => {
            volumes[mount.container] = {};
        });
        return volumes;
    }

    private getBinds() {
        return this.options.mounts?.map((mount: Mount) => {
            return `${mount.host}:${mount.container}:rw`;
        }) ?? [];
    }

    private getExposedPorts() {
        const exposedPorts: any = {};
        this.options.exposedPorts?.forEach(port => {
            exposedPorts[`${port}/tcp`] = {};
        });

        return exposedPorts;
    }

    private getPortBindings() {
        const boundPorts: any = {};
        this.boundPorts.forEach((hostPort, port) => {
            boundPorts[`${port}/tcp`] = [
                {
                    HostPort: `${hostPort}`
                }];
        });
        return boundPorts;
    }

    private getImageName() {
        if (this.options.tag) {
            return `${this.options.image}:${this.options.tag}`;
        }
        return this.options.image;
    }
}
