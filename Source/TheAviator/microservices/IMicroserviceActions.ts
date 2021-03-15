// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IHeadActions } from './head/HeadActions';
import { IRuntimeActions } from './runtime/RuntimeActions';

export interface IMicroserviceActions {
    readonly head: IHeadActions;
    readonly runtime: IRuntimeActions;
}
