// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';
import { InfrastructureConfiguration } from '@dolittle/aviator.microservices';

export class InfrastructuresConfigurationProvider {
    static FILE_NAME = 'infrastructures.json';
    static FILE_PATH = path.join(__dirname, '..', InfrastructuresConfigurationProvider.FILE_NAME);

    provide(): InfrastructureConfiguration {
        const exists = fs.existsSync(InfrastructuresConfigurationProvider.FILE_PATH);
        if (exists) {
            const fileContent = fs.readFileSync(InfrastructuresConfigurationProvider.FILE_PATH, { encoding: 'utf8'});
            const json = JSON.parse(fileContent);
            return json as InfrastructureConfiguration;
        }
        return {
            dotnet: {
                runtime: 'dolittle/runtime:5.0.1',
                head: 'dolittle/integrationtests-head-dotnet:5.0.0-rc.3',
                mongo: 'dolittle/mongodb:4.2.2'
            }
        };
    }
}
