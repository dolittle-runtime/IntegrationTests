// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Mount } from './Mount';

export class ContainerOptions {
    name: string | undefined;
    friendlyName: string | undefined;
    image: string | undefined;
    tag?: string;
    exposedPorts?: number[] | undefined;
    mounts?: Mount[];
    networkName?: string;
}
