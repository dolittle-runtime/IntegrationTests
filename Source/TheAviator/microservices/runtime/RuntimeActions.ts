import fetch from 'node-fetch';
import { Microservice } from "microservices/Microservice";

export interface IRuntimeActions {

    getMetrics(): Promise<string>;
}
export class RuntimeActions implements IRuntimeActions {
    constructor(private readonly _microservice: Microservice) {
    }
    async getMetrics(): Promise<string> {
        try {
            const url = `http://localhost:${this._microservice.runtime.boundPorts.get(9700)}/metrics`;
            const response = await fetch(url, { timeout: 1000 });
            const result = await response.text();
            return result;
        } catch (ex) {
            return '';
        }
    }
}
