// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

const getPort = require('get-port');
import { retry } from 'async';
import { BehaviorSubject } from 'rxjs';

import { PassThrough } from 'stream';
import * as Docker from 'dockerode';

import { ContainerOptions, IContainer, Mount, IWaitStrategy } from '../';

/**
 * Represents an implementation of {IContainer} for Docker.
 */
export class Container implements IContainer {
    readonly options: ContainerOptions;
    readonly boundPorts: Map<number, number>;

    _outputStream: BehaviorSubject<NodeJS.ReadWriteStream>;
    _startWaitStrategies: IWaitStrategy[] = [];
    _container: Docker.Container | undefined;
    _containerInspectInfo: Docker.ContainerInspectInfo | undefined;
    _connectedNetworks: string[] = [];

    /**
     * Creates an instance of container.
     * @param options {ContainerOptions} The Container options.
     * @param _dockerClient {Docker} The Docker client object.
     */
    constructor(options: ContainerOptions, private _dockerClient: Docker) {
        this.options = options;
        this._outputStream = new BehaviorSubject<NodeJS.ReadWriteStream>(new PassThrough());
        this.boundPorts = new Map<number, number>();
    }

    /** @inheritdoc */
    get id() {
        return this._container?.id ?? '';
    }

    /** @inheritdoc */
    get outputStream(): BehaviorSubject<NodeJS.ReadWriteStream> {
        return this._outputStream;
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
        this._startWaitStrategies = waitStrategies;
        const createOptions = this.getCreateOptions();
        this._container = await this._dockerClient.createContainer(createOptions);

        await this._container.start();
        await this.waitForContainerToBeReady();
        this._containerInspectInfo = await this._container.inspect();
        await this.captureOutputFromContainer();
        await this.waitForStrategies(waitStrategies);
    }

    /** @inheritdoc */
    async stop(...waitStrategies: IWaitStrategy[]) {
        if (!this._container) {
            return;
        }
        const state = await this._container.inspect();
        if (state.State.Running) {
            await this._container.stop();
            await this._container.remove();
            await this.waitForStrategies(waitStrategies);
            this._container = undefined;
        }
    }

    /** @inheritdoc */
    async continue() {
        await this.start(...this._startWaitStrategies);
        for (const networkName of this._connectedNetworks) {
            await this.connectToNetwork(networkName);
        }
    }

    /** @inheritdoc */
    async pause(...waitStrategies: IWaitStrategy[]) {
        if (!this._container) {
            return;
        }
        const state = await this._container.inspect();
        if (state.State.Running) {
            await this._container.pause();
            await this.waitForStrategies(waitStrategies);
        }
    }

    /** @inheritdoc */
    async resume(...waitStrategies: IWaitStrategy[]) {
        if (!this._container) {
            return;
        }
        const state = await this._container.inspect();
        if (state.State.Running) {
            await this._container.unpause();
            await this.waitForContainerToBeReady();
            await this.waitForStrategies(waitStrategies);
        }
    }


    /** @inheritdoc */
    async kill(...waitStrategies: IWaitStrategy[]) {
        if (!this._container) {
            return;
        }
        try {
            const state = await this._container.inspect();
            try {
                await this._container.kill();
                await this.waitForStrategies(waitStrategies);
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
        await this._container.restart();
        await this.waitForContainerToBeReady();
        this._containerInspectInfo = await this._container.inspect();
        await this.captureOutputFromContainer();
        await this.waitForStrategies(this._startWaitStrategies);
    }

    /** @inheritdoc */
    async exec(command: string[], options?: any, ...waitStrategies: IWaitStrategy[]): Promise<void> {
        if (!this._container) {
            return;
        }

        options = options || {};
        options.AttachStdout = true;
        options.AttachStderr = true;
        options.Tty = false;
        options.Cmd = command;

        const exec = await this._container.exec(options);
        const result = await exec.start({ 'Detach': false, 'Tty': false, stream: true, stdout: true, stderr: true });
        result.output.setEncoding('utf8');
        result.output.pipe(this.outputStream.value);

        try {
            await retry({ times: 10, interval: 200 }, async (callback, results) => {
                const info = await exec.inspect();
                if (info.Running) {
                    callback(new Error('Running'));
                } else {
                    callback(null);
                }
            });
        } catch (ex) { }

        await this.waitForStrategies(waitStrategies);
    }


    /** @inheritdoc */
    async connectToNetwork(networkName: string): Promise<void> {
        try {
            const network = await this._dockerClient.getNetwork(networkName);
            await network.connect({ Container: this.id });
            this._connectedNetworks.push(networkName);
        } catch (ex) { }
    }

    /** @inheritdoc */
    async disconnectFromNetwork(networkName: string): Promise<void> {
        try {
            const network = await this._dockerClient.getNetwork(networkName);
            await network.disconnect({ Container: this.id });

            await retry({ times: 5, interval: 100 }, async (callback, results) => {
                const result = await this._container?.inspect();
                if (result) {
                    const keys = Object.keys(result.NetworkSettings.Networks);
                    if (keys.some(_ => _ === networkName)) {
                        callback(new Error('Still connected'));
                    } else {
                        callback(null);
                    }
                }
            });

            const index = this._connectedNetworks.indexOf(networkName);
            if (index > -1) {
                this._connectedNetworks = this._connectedNetworks.splice(index, 1);
            }
        } catch (ex) { }
    }

    /** @inheritdoc */
    getIPAddressForNetwork(networkName: string | undefined): string {
        if (!networkName) {
            if (this.options.networkName) {
                networkName = this.options.networkName;
            }
        }

        if (!networkName) {
            throw new Error("Can't get IP address - no network name specified");
        }
        return this._containerInspectInfo?.NetworkSettings.Networks[networkName].IPAddress || '';
    }

    /** @inheritdoc */
    async waitForContainerToBeReady() {
        try {
            await retry({ times: 5, interval: 100 }, async (callback, results) => {
                const result = await this._container?.inspect();
                if (result?.State.Running) {
                    callback(null);
                } else {
                    callback(new Error('Not Ready'));
                }
            });
        } catch (ex) {
            console.log(`Container ${this.id} is unresponsive - not getting ready`);
        }
    }

    /** @inheritdoc */
    async waitForContainerToBeStopped() {
        try {
            await retry({ times: 5, interval: 100 }, async (callback, results) => {
                const result = await this._container?.inspect();
                if (result?.State.Dead) {
                    callback(null);
                } else {
                    callback(new Error('Not Stopped'));
                }
            });
        } catch (ex) {
            console.log(`Container ${this.id} is unresponsive - not stopping`);
        }
    }


    private async captureOutputFromContainer() {
        if (this._container) {
            this._outputStream.next(new PassThrough());
            const stream = await this._container.attach({ stream: true, stdout: true, stderr: true });
            stream.setEncoding('utf8');
            stream.pipe(this.outputStream.value);
        }
    }

    private async waitForStrategies(waitStrategies: IWaitStrategy[]) {
        for (const strategy of waitStrategies) {
            try {
                await strategy.wait(this);
            }
            catch (ex) { }
        }
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
