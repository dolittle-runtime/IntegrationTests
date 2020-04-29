import { IGiven } from 'gherkin';
import { BehaviorInProcedure } from './BehaviorInProcedure';
import { UnexpectedBehaviorInProcedure } from './UnexpectedBehaviorInProcedure';
export interface IFlightSimulationProcedure<T extends IGiven> {
    readonly behaviors: BehaviorInProcedure<T>[];
    readonly unexpectedBehaviors: UnexpectedBehaviorInProcedure<T>[];
}
