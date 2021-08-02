import { Pai } from "./pai";
export interface PartialSet {
    tiles: Pai[];
    type: SetType;
}
export declare type SetType = "run" | "tuple";
export declare type Riipai = {
    partialSets: PartialSet[];
    useless: Pai[];
};
export declare type RiipaiProgress = [Riipai, Pai[]];
export declare function stringifyProgress([{ partialSets, useless }, remaining]: [Riipai, Pai[]]): string;
export declare function formSet(tile1: Pai, tile2: Pai): PartialSet | null;
export declare function fitsInSet(tile: Pai, partialSet: PartialSet): boolean;
export declare function shanten(tiles: Pai[]): number;
export declare function riipai(input: RiipaiProgress | Pai[]): Riipai[];
export declare function partialSetUkeire(partialSet: PartialSet, isPair?: boolean): Pai[][];
export declare function generatePossibilities(possibilities: Pai[][][], index?: number): Pai[][];
export declare function ukeireSingle(sets: PartialSet[]): Pai[] | undefined;
export declare function ukeire(input: Riipai[] | Pai[]): Pai[];
