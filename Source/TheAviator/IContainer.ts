// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IWaitStrategy } from './IWaitStrategy';
import { ContainerOptions } from './ContainerOptions';

/**
 * Defines the concept of a running instance of a Container.
 */
export interface IContainer {
    readonly options: ContainerOptions;
    readonly outputStream: NodeJS.ReadWriteStream;
    readonly boundPorts: Map<number, number>;

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
     * @returns {Promise<void>}
     */
    stop(...waitStrategies: IWaitStrategy[]): Promise<any>;

    /**
     * Pauses the instance.
     * @returns {Promise<void>}
     */
    pause(...waitStrategies: IWaitStrategy[]): Promise<any>;

    /**
     * Resumes a paused instance.
     * @returns {Promise<void>}
     */
    resume(...waitStrategies: IWaitStrategy[]): Promise<any>;

    /**
     * Kill the instance.
     * @returns {Promise<void>}
     */
    kill(...waitStrategies: IWaitStrategy[]): Promise<any>;

    /**
     * Restart the instance.
     * @returns {Promise<void>}
     */
    restart(...waitStrategies: IWaitStrategy[]): Promise<void>;
}