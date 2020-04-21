// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

import { MicroserviceConfiguration } from '..';

import { IConfigurationManager } from './IConfigurationManager';
import { Mount } from '../../containers';

const HeadConfig = 'head';
const RuntimeConfig = 'runtime';

export class ConfigurationManager implements IConfigurationManager {
    generateForHead(configuration: MicroserviceConfiguration, workingDirectory: string): Mount[] {
        const mounts: Mount[] = [];
        mounts.push(this.generateFile(configuration, HeadConfig, 'resources.json', workingDirectory));
        mounts.push(this.generateFile(configuration, HeadConfig, 'tenants.json', workingDirectory));
        mounts.push(this.generateFile(configuration, HeadConfig, 'clients.json', workingDirectory));
        return mounts;
    }

    generateForRuntime(configuration: MicroserviceConfiguration, workingDirectory: string): Mount[] {
        const mounts: Mount[] = [];
        mounts.push(this.generateFile(configuration, RuntimeConfig, 'resources.json', workingDirectory));
        return mounts;
    }

    private generateFile(configuration: MicroserviceConfiguration, target: string, file: string, workingDirectory: string): Mount {
        const source = this.getSourcePathFor(target, file);
        const content = fs.readFileSync(source, 'utf8').toString();
        const template = Handlebars.compile(content);
        const result = template(configuration);
        const destination = this.getAndEnsureHostPathFor(configuration, target, file, workingDirectory);
        fs.writeFileSync(destination, result);

        return {
            host: destination,
            container: `/app/.dolittle/${file}`
        };
    }

    private getSourcePathFor(target: string, file: string) {
        const sourcePath = path.join(process.cwd(), 'microservices', 'configuration', target);
        return path.join(sourcePath, file);
    }

    private getAndEnsureHostPathFor(configuration: MicroserviceConfiguration, target: string, file: string, workingDirectory: string) {
        const hostPath = path.join(workingDirectory, '_microservices', configuration.name, target);
        if (!fs.existsSync(hostPath)) {
            fs.mkdirSync(hostPath, { recursive: true });
        }

        return path.join(hostPath, file);
    }
}
