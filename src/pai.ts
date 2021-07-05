export type Pai = Shupai | Zupai;

export interface Shupai {
  type: ShupaiType;
  value: number;
  aka: boolean;
}

export type ShupaiType = "manzu" | "sozu" | "pinzu";

export type Zupai = Fonpai | Yakuhai;
export type Fonpai = "ton" | "nan" | "sha" | "pe";
export type Yakuhai = "haku" | "hatsu" | "chun";

export function isZupai(pai: Pai): pai is Zupai {
  return typeof pai === 'string';
}

export function isShupai(pai: Pai): pai is Shupai {
  return typeof pai !== 'string';
}

export const yakuhaiCharacters: Map<Pai, string> =
  new Map([
    ["ton", "東"],
    ["nan", "南"],
    ["sha", "西"],
    ["pe", "北"],
    ["haku", "白"],
    ["hatsu", "発發"],
    ["chun", "中"],
  ]);

const yakuhaiDigitArray: [number, Pai][] = [
  [1, "ton"],
  [2, "nan"],
  [3, "sha"],
  [4, "pe"],
  [5, "haku"],
  [6, "hatsu"],
  [7, "chun"],
];

export const reverseYakuhaiDigitArray =
  [...yakuhaiDigitArray.map(e => e.slice().reverse())] as [Zupai, number][];

export const yakuhaiDigits: Map<number, Pai> =
  new Map(yakuhaiDigitArray);

export const reverseYakuhaiDigits = new Map(reverseYakuhaiDigitArray);
