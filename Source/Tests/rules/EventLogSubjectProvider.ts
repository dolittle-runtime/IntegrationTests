// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ISubjectProvider, IRuleContext } from '@dolittle/rules';

export class EventLogSubjectProvider implements ISubjectProvider {
    constructor() {
    }

    provide(ruleContext: IRuleContext) {
        return { blah: 42 };
    }
}
