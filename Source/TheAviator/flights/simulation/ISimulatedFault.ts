export interface ISimulatedFault {
    perform(): Promise<void>;
}
