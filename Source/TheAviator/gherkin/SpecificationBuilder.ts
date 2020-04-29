// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ISpecificationBuilder } from './ISpecificationBuilder';
import { Specification } from './Specification';
import { FeatureDefinition } from './FeatureDefinition';
import { When } from './When';
import { BecauseOf } from './BecauseOf';
import { Then } from './Then';
import { MissingWhenMethod } from './MissingWhenMethod';
import { MultipleWhenMethods } from './MultipleWhenMethods';
import { ThenIsNotAMethod } from './ThenIsNotAMethod';
import { IContextDescriptorFor } from './IContextDescriptorFor';

export class SpecificationBuilder implements ISpecificationBuilder {
    static UndefinedFeature: FeatureDefinition = { name: 'Feature not specified', description: '' };

    buildFrom(description: IContextDescriptorFor<any>): Specification {
        const keys = this.getKeysFor(description);
        const specification: Specification = {
            feature: SpecificationBuilder.UndefinedFeature,
            givens: [],
            when: this.getWhenFrom(description, keys),
            ands: this.getAndsFrom(description, keys),
            thens: this.getThensFrom(description, keys),
            children: []
        };

        return specification;
    }

    private getKeysFor(description: IContextDescriptorFor<any>) {
        const proto = Object.getPrototypeOf(description);
        const keys: string[] = [];
        Object.getOwnPropertyNames(description).forEach(_ => keys.push(_));
        Object.getOwnPropertyNames(proto).forEach(_ => keys.push(_));
        return keys;
    }

    private getAndsFrom(description: IContextDescriptorFor<any>, keys: string[]) {
        const ands: BecauseOf[] = [];
        for (const and of description.and()) {

            let andName = and.name;

            if (!andName || andName === '') {
                const properties = keys.filter(_ => (description as any)[_] === and);
                if (properties.length === 1) {
                    andName = properties[0];
                }
            }

            ands.push({ name: this.humanReadable(andName), method: and });
        }
        return ands;
    }

    private getWhenFrom(description: IContextDescriptorFor<any>, keys: string[]) {
        const whenMethods = keys.filter(_ => _.indexOf('when_') === 0);
        this.throwIfMultipleWhenMethods(whenMethods, description);
        let whenMethod: any;
        const method = (description as any)[whenMethods[0]];
        if (method instanceof Function) {
            whenMethod = method;
        }

        this.throwIfMissingWhenMethod(whenMethod, description);
        const whenMethodName = this.humanReadable(whenMethods[0]);
        return new When({ name: whenMethodName, method: whenMethod });
    }

    private getThensFrom(description: any, keys: string[]) {
        const thens: Then[] = [];

        for (const key of keys) {
            if (key.toString().indexOf('then_') === 0) {
                const method = (description as any)[key];
                this.throwIfThenIsNotMethod(method, key, description);

                const thenName = this.humanReadable(key);
                thens.push(new Then(thenName, method));
            }
        }

        return thens;
    }

    private humanReadable(input: string): string {
        return input.split('_').join(' ');
    }

    private throwIfMissingWhenMethod(whenMethod: Function, description: any) {
        if (!whenMethod) {
            throw new MissingWhenMethod(description.constructor.name);
        }
    }

    private throwIfMultipleWhenMethods(whenMethods: string[], description: any) {
        if (whenMethods.length > 1) {
            throw new MultipleWhenMethods(description.constructor.name);
        }
    }

    private throwIfThenIsNotMethod(method: any, key: string, description: any) {
        if (!(method instanceof Function)) {
            throw new ThenIsNotAMethod(key, description.constructor.name);
        }
    }
}
