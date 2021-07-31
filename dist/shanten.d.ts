import { Pai } from "./pai";
export interface PartialSet {
    tiles: Pai[];
    type: SetType;
}
export declare type SetType = "run" | "tuple";
export interface ShantenProgress {
    partialSets: PartialSet[];
    remaining: Pai[];
    useless: Pai[];
}
export declare function stringifyProgress({ partialSets, remaining, useless }: ShantenProgress): string;
export declare function sameTile(pai1: Pai, pai2: Pai): boolean;
export declare function formSet(tile1: Pai, tile2: Pai): PartialSet | null;
export declare function fitsInSet(tile: Pai, partialSet: PartialSet): boolean;
export declare function shanten(tiles: Pai[]): number;
export declare function shantenRecurse(progress: ShantenProgress): ShantenProgress[];
