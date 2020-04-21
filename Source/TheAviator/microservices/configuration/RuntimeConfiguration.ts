export class RuntimeConfiguration {
    readonly host: string;
    readonly publicPort: number;
    readonly privatePort: number;
    constructor(host: string, publicPort: number, privatePort: number) {
        this.host = host;
        this.publicPort = publicPort;
        this.privatePort = privatePort;
    }
}
