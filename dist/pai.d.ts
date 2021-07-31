export declare type Pai = string;
export declare type ShupaiType = "m" | "p" | "s";
export declare function shupaiType(pai: Pai): ShupaiType;
export declare function shupaiValue(pai: Pai): number;
export declare function isAkadora(pai: Pai): boolean;
export declare function isZupai(pai: Pai): boolean;
export declare function isShupai(pai: Pai): boolean;
export declare function numberToZupai(index: number): Pai;
export declare function digitForZupai(pai: Pai): number;
export declare function kanjiForZupai(pai: Pai): string;
export declare function zupaisAndKanjis(): [Pai, string][];
