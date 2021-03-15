// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

import { MicroserviceConfiguration } from '..';

import { IConfigurationManager } from './IConfigurationManager';
import { Mount } from '../../containers';

const RuntimeConfig = 'runtime';

export class ConfigurationManager implements IConfigurationManager {
    
    generateForRuntime(configuration: MicroserviceConfiguration, workingDirectory: string): Mount[] {
        return this.generateFiles(configuration, RuntimeConfig, workingDirectory);
    }

    private generateFiles(configuration: MicroserviceConfiguration, target: string, workingDirectory: string) {
        const mounts: Mount[] = [];
        const sourcePath = this.getSourcePathFor(target);
        const files = fs.readdirSync(sourcePath);
        for (const file of files) {
            mounts.push(this.generateFile(configuration, target, file, workingDirectory));
        }
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

    private getSourcePathFor(target: string, file?: string) {
        const sourcePath = path.join(process.cwd(), 'microservices', 'configuration', target);
        if (!file) {
            return sourcePath;
        }
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
