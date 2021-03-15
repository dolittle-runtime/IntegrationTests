// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IMicroserviceActions } from './IMicroserviceActions';
import { IRuntimeActions } from './runtime/RuntimeActions';
import { IHeadActions } from './head/HeadActions';

export class MicroserviceActions implements IMicroserviceActions {

    constructor(
        readonly runtime: IRuntimeActions,
        readonly head: IHeadActions) {
    }

}
