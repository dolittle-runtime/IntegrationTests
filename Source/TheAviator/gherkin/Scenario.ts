// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '../Constructor';
import { IGiven } from './IGiven';
import { ScenarioContext } from './ScenarioContext';
import { When } from './When';
import { Then } from './Then';
import { BrokenRule } from '@dolittle/rules';
import { ScenarioWithThenSubject } from 'rules';

export class Scenario {
    private _context: ScenarioContext | undefined;
    private _whenMethod: Function | undefined;
    private _whenDescription: When | undefined;
    readonly thens: Then[] = [];

    given: Constructor<IGiven> | undefined;

    constructor() {
    }

    prepare() {
        this.configureWhen();
        this.populateThens();
    }

    get name(): string {
        return this.constructor.name;
    }

    get context(): ScenarioContext | undefined {
        return this._context;
    }

    get contextName(): string {
        return this._context?.name ?? 'UnknownScenarioContext';
    }

    get whenMethod(): Function | undefined {
        return this._whenMethod;
    }

    get whenDescription(): When | undefined {
        return this._whenDescription;
    }

    setContext(context: ScenarioContext) {
        this._context = context;
    }

    async establish() {
    }

    async when() {
        this.throwIfMissingWhenMethod();

        const proto = Object.getPrototypeOf(this);
        const keys: string[] = [];
        Object.getOwnPropertyNames(this).forEach(_ => keys.push(_));
        Object.getOwnPropertyNames(proto).forEach(_ => keys.push(_));

        console.log(`given ${this.given?.name}`);

        console.log(` ${this._whenDescription?.name}`);
        let result: any = null;
        try {
            result = await (this._whenMethod as Function).apply(this);
        } catch (ex) { }

        if (result) {
            this.throwIfResultNotArray(result);

            const resultAsArray = result as any[];
            for (const item of resultAsArray) {
                this.throwIfWhenMethodResultContainsNonMethod(item);

                let andName = item.name;

                if (!andName || andName === '') {
                    const property = keys.filter(_ => (this as any)[_] === item);
                    if (property.length === 1) {
                        andName = property[0];
                    }
                }

                item.actualName = andName;
                this._whenDescription?.addAnds(andName);
            }

            for (const item of resultAsArray) {
                const itemAsFunction = item as Function;
                console.log(`   and ${item.actualName}`);
                await itemAsFunction.apply(this);
            }
        }
    }

    async then() {
        for (const then of this.thens) {
            try {
                await then.method.apply(this);
            } catch (ex) { }
        }
    }

    handleBrokenRules(brokenRules: BrokenRule[]): void {
        for (const brokenRule of brokenRules) {
            const subject = brokenRule.subject as ScenarioWithThenSubject;

            for (const then of this.thens) {
                if (subject.then === then.name) {
                    then.addBrokenRules([brokenRule]);
                }
            }
        }
    }

    private populateThens() {
        const proto = Object.getPrototypeOf(this);
        const keys: string[] = [];
        Object.getOwnPropertyNames(this).forEach(_ => keys.push(_));
        Object.getOwnPropertyNames(proto).forEach(_ => keys.push(_));

        for (const key of keys) {
            if (key.toString().indexOf('then_') === 0) {
                const method = (this as any)[key];
                this.throwIfThenIsNotMethod(method, key);
                this.thens.push(new Then(key, method));
            }
        }
    }

    private throwIfThenIsNotMethod(method: any, key: string) {
        if (!(method instanceof Function)) {
            throw new Error(`Property '${key}' on '${this.name}' is not a method`);
        }
    }

    private configureWhen() {
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
        this._whenMethod = whenMethod;
        this._whenDescription = new When(whenMethod.name);
        this.throwIfMissingWhenMethod();
    }

    private throwIfWhenMethodResultContainsNonMethod(item: any) {
        if (!(item instanceof Function)) {
            throw new Error(`Item in array returned from '${this._whenMethod?.name}' in scenario '${this.name}' is not a method. When methods should only return an array of 'then' methods.`);
        }
    }

    private throwIfResultNotArray(result: any) {
        if (!Array.isArray(result)) {
            throw new Error('');
        }
    }

    private throwIfMissingWhenMethod() {
        if (!this._whenMethod) {
            throw new Error(`Missing 'when' methods on '${this.name}'. Expected method starting with 'when_'.`);
        }
    }

    private throwIfMultipleWhenMethods(whenMethod: any) {
        if (whenMethod) {
            throw new Error(`Found multiple 'when' methods on '${this.name}'. There can only be one (Highlander principle).`);
        }
    }
}
