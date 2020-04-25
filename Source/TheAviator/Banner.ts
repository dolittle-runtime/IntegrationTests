// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';

let separator = '';
for (let i = 0; i < 42; i += 1) {
    separator = separator + '\u2708 ';
}

export default class {
    static readonly separator = separator;

    static present(): void {
        console.log('\n');
        console.log(fs.readFileSync(path.join(process.cwd(), 'logo.txt')).toString());
        console.log('\n');
        console.log(separator);
        console.log('\n');
        console.log('Welcome to The Aviator - please enjoy the flight.');
        console.log('\n');
    }
}
