// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class FailedRuleCause {
    readonly title: string;
    readonly description: string;
    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }
}
