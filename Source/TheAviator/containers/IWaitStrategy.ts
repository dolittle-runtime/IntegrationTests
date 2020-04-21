// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IContainer } from './IContainer';

export interface IWaitStrategy {
    wait(container: IContainer): Promise<void>;
}
