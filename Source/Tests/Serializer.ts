// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ISerializer } from './ISerializer';

export class Serializer implements ISerializer {
    toJSON(input: any): string {
        return JSON.stringify(input, undefined, 4);
    }
    fromJSON(jsonString: string) {
        return JSON.parse(jsonString);
    }
}
