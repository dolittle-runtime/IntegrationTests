// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class FeatureDefinition {
    static unspecified: FeatureDefinition = { name: 'Feature not specified', description: '' };

    name!: string;
    description: string = '';
}
