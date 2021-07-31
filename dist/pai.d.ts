export declare type Pai = Shupai | Zupai;
export interface Shupai {
    type: ShupaiType;
    value: number;
    aka: boolean;
}
export declare type ShupaiType = "manzu" | "sozu" | "pinzu";
export declare type Zupai = Fonpai | Yakuhai;
export declare type Fonpai = "ton" | "nan" | "sha" | "pe";
export declare type Yakuhai = "haku" | "hatsu" | "chun";
export declare function isZupai(pai: Pai): pai is Zupai;
export declare function isShupai(pai: Pai): pai is Shupai;
export declare const yakuhaiCharacters: Map<Pai, string>;
export declare const reverseYakuhaiDigitArray: [Zupai, number][];
export declare const yakuhaiDigits: Map<number, Pai>;
export declare const reverseYakuhaiDigits: Map<Zupai, number>;
