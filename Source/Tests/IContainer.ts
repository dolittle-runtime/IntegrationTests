// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IWaitStrategy } from './IWaitStrategy';

/**
 * Defines the concept of a running instance of a Container.
 */
export interface IContainer {
    readonly outputStream: NodeJS.ReadWriteStream;
    readonly boundPorts: Map<number, number>;

    /**
     * Start the instance.
     * @param waitStrategies {IWaitStrategy[]} Wait strategies, if any.
     * @returns {Promise<any>}
     */
    start(...waitStrategies: IWaitStrategy[]): Promise<any>;

    /**
     * Stop the instance.
     * @returns {Promise<any>}
     */
    stop(): Promise<any>;

    /**
     * Kill the instance.
     * @returns {Promise<any>}
     */
    kill(): Promise<any>;

    /**
     * Restart the instance.
     * @returns {Promise<any>}
     */
    restart(): Promise<any>;
}
