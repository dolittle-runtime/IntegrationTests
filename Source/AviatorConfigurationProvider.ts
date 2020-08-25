// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';
import { AviatorConfiguration } from '@dolittle/aviator';

export class AviatorConfigurationProvider {
    static FILE_NAME = 'aviator.json';
    static FILE_PATH = path.join(__dirname, '..', AviatorConfigurationProvider.FILE_NAME);

    provide(): AviatorConfiguration {
        const exists = fs.existsSync(AviatorConfigurationProvider.FILE_PATH);
        if (exists) {
            const fileContent = fs.readFileSync(AviatorConfigurationProvider.FILE_PATH, { encoding: 'utf8'});
            const json = JSON.parse(fileContent);
            return json as AviatorConfiguration;
        }
        return {
            namespace: 'integration-tests'
        };
    }
}
