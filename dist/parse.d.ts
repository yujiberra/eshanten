import { Pai } from "./pai";
export declare type PaiOrString = Pai | string;
export declare function rank(pai: Pai): number;
export declare function compare(pai1: Pai, pai2: Pai): number;
export declare function parseSingle(input: string): Pai;
export declare function parse(input: string): Pai[];
export declare function stringifySingle(pai: Pai): string;
export declare function stringify(pais: Pai[]): string;
