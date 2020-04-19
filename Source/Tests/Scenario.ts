// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from './Constructor';
import { IGiven } from './IGiven';
import { ScenarioContext } from './ScenarioContext';
import { When } from './When';

export class Scenario {
    context: ScenarioContext | undefined;
    given: Constructor<IGiven> | undefined;
    whenMethod: Function | undefined;
    whenDescription: When | undefined;

    constructor() {
        this.configure();
    }

    get name() {
        return this.constructor.name;
    }

    async when() {
        this.throwIfMissingWhenMethod();
        const result = await (this.whenMethod as Function).apply(this);
        if (result) {
            this.throwIfResultNotArray(result);

            const resultAsArray = result as any[];
            for (const item of resultAsArray) {
                this.throwIfWhenMethodResultContainsNonMethod(item);
                this.whenDescription?.addAnds(item.name);
            }

            for (const item of resultAsArray) {
                await (item as Function).apply(this);
            }
        }
    }

    async then() {
        const proto = Object.getPrototypeOf(this);
        const keys: string[] = [];
        Object.getOwnPropertyNames(this).forEach(_ => keys.push(_));
        Object.getOwnPropertyNames(proto).forEach(_ => keys.push(_));

        for (const key of keys) {
            if (key.toString().indexOf('then_') === 0) {
                const method = (this as any)[key];
                this.throwIfThenIsNotMethod(method, key);

                await (method as Function).apply(this);
            }
        }
    }

    private throwIfThenIsNotMethod(method: any, key: string) {
        if (!(method instanceof Function)) {
            throw new Error(`Property '${key}' on '${this.name}' is not a method`);
        }
    }

    private configure() {
        const proto = Object.getPrototypeOf(this);
        const keys: string[] = [];
        Object.getOwnPropertyNames(this).forEach(_ => keys.push(_));
        Object.getOwnPropertyNames(proto).forEach(_ => keys.push(_));

        let whenMethod: any = null;
        keys.forEach(key => {
            if (key.toString().indexOf('when_') === 0) {
                this.throwIfMultipleWhenMethods(whenMethod);
                const method = (this as any)[key];
                if (method instanceof Function) {
                    whenMethod = method;
                }
            }
        });
        this.whenMethod = whenMethod;
        this.whenDescription = new When(whenMethod.name);
        this.throwIfMissingWhenMethod();
    }

    private throwIfWhenMethodResultContainsNonMethod(item: any) {
        if (!(item instanceof Function)) {
            throw new Error(`Item in array returned from '${this.whenMethod?.name}' in scenario '${this.name}' is not a method. When methods should only return an array of 'then' methods.`);
        }
    }

    private throwIfResultNotArray(result: any) {
        if (!Array.isArray(result)) {
            throw new Error('');
        }
    }

    private throwIfMissingWhenMethod() {
        if (!this.whenMethod) {
            throw new Error(`Missing 'when' methods on '${this.name}'. Expected method starting with 'when_'.`);
        }
    }

    private throwIfMultipleWhenMethods(whenMethod: any) {
        if (whenMethod) {
            throw new Error(`Found multiple 'when' methods on '${this.name}'. There can only be one (Highlander principle).`);
        }
    }
}
