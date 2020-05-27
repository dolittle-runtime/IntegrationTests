// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BehaviorSubject } from 'rxjs';
import { IWaitStrategy } from './IWaitStrategy';
import { ContainerOptions } from './ContainerOptions';

/**
 * Defines the concept of a running instance of a Container.
 */
export interface IContainer {
    readonly options: ContainerOptions;
    readonly outputStream: BehaviorSubject<NodeJS.ReadWriteStream>;
    readonly boundPorts: Map<number, number>;
    readonly id: string;

    /**
     * Configure all properties and make it ready.
     */
    configure(): Promise<void>;

    /**
     * Start the instance.
     * @param waitStrategies {IWaitStrategy[]} Wait strategies, if any.
     * @returns {Promise<any>}
     */
    start(...waitStrategies: IWaitStrategy[]): Promise<void>;

    /**
     * Stop the instance.
     * @param waitStrategies {IWaitStrategy[]} Wait strategies, if any.
     * @returns {Promise<void>}
     */
    stop(...waitStrategies: IWaitStrategy[]): Promise<any>;

    /**
     * Continue the instance after a stop.
     *
     * When continuing it assumes the container is already in a stopped state.
     * @returns {Promise<void>}
     */
    continue(): Promise<any>;

    /**
     * Pauses the instance.
     * @param waitStrategies {IWaitStrategy[]} Wait strategies, if any.
     * @returns {Promise<void>}
     */
    pause(...waitStrategies: IWaitStrategy[]): Promise<any>;

    /**
     * Resumes a paused instance.
     * @param waitStrategies {IWaitStrategy[]} Wait strategies, if any.
     * @returns {Promise<void>}
     */
    resume(...waitStrategies: IWaitStrategy[]): Promise<any>;

    /**
     * Kill the instance.
     * @param waitStrategies {IWaitStrategy[]} Wait strategies, if any.
     * @returns {Promise<void>}
     */
    kill(...waitStrategies: IWaitStrategy[]): Promise<any>;

    /**
     * Restart the instance. It will use the same wait strategies as for starting.
     * @returns {Promise<void>}
     */
    restart(): Promise<void>;

    /**
     * Execute a command within the container.
     * @param {string[]} command Array representing command to run with arguments
     * @param {ReadableStream} [inputStream] Optional input stream to pass to the exec
     * @param {WriteableStream} [outputStream] Optional input stream to pass to
     * @param {*} [options] Configuration options
     * @param waitStrategies {IWaitStrategy[]} Wait strategies, if any.
     */
    exec(command: string[], inputStream?: ReadableStream, outputStream?: WritableStream, options?: any, ...waitStrategies: IWaitStrategy[]): Promise<void>;

    /**
     * Connect the container to a specific network.
     * @param {string} networkName Name of network.
     */
    connectToNetwork(networkName: string): Promise<void>;

    /**
     * Disconnect the container from a specific network.
     * @param {string} networkName Name of network.
     */
    disconnectFromNetwork(networkName: string): Promise<void>;

    /**
     * Get the IP address for a specific network the container is part of.
     * @param {string} networkName Name of network - default to undefined, which means the first network.
     */
    getIPAddressForNetwork(networkName: string | undefined): string;

    /**
     * Wait for a a container to be stopped
     * @returns {Promise<void>}
     */
    waitForContainerToBeReady(): Promise<void>

    /**
     * Wait for a a container to be stopped
     * @returns {Promise<void>}
     */
    waitForContainerToBeStopped(): Promise<void>
}
