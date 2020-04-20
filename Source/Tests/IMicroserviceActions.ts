// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

export interface IMicroserviceActions {
    checkStatus(): Promise<string>;
    commitEvent(artifactId: Guid, content: any): Promise<void>;
    getRuntimeMetrics(): Promise<string>;
}
