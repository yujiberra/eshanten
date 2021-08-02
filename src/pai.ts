import { compare } from "./parse";

export type Pai = string;
export type ShupaiType = "m" | "p" | "s";

const manzuSet = new Set<Pai>();
const pinzuSet = new Set<Pai>();
const sozuSet = new Set<Pai>();
const shupaiSet = new Set<Pai>();
const shupaiValues = new Map<Pai, number>();
const akaDoraSet = new Set<Pai>();

export const manzus = (): string[] => [...manzuSet];
export const pinzus = (): string[] => [...pinzuSet];
export const sozus = (): string[] => [...sozuSet];
export const shupais = (): string[] => [...shupaiSet];

([["m", manzuSet], ["p", pinzuSet], ["s", sozuSet]] as [ShupaiType, Set<string>][])
  .map(([char, set]) => {
    for (let i = 1; i <= 9; i++) {
      const tile = `${i}${char}`;
      set.add(tile);
      shupaiSet.add(tile);
      shupaiValues.set(tile, i);
    }
    const akaDora = `0${char}`
    set.add(akaDora);
    shupaiSet.add(akaDora);
    akaDoraSet.add(akaDora);
    shupaiValues.set(akaDora, 5);
  }
);

export function shupaiType(pai: Pai): ShupaiType {
  if (manzuSet.has(pai)) return "m";
  if (pinzuSet.has(pai)) return "p";
  if (sozuSet.has(pai)) return "s";
  else throw new Error(`Tried to get type of invalid shupai ${pai}`);
}

export function shupaiValue(pai: Pai): number {
  const value = shupaiValues.get(pai);
  if (value !== undefined) return value;
  else throw new Error(`Tried to get value of invalid shupai ${pai}`);
}

export function shupai(type: ShupaiType, value: number, aka = false): Pai {
  return `${aka ? 0 : value}${type}`;
}

export const isManzu = (pai: Pai): boolean => manzuSet.has(pai);
export const isSozu = (pai: Pai): boolean => sozuSet.has(pai);
export const isPinzu = (pai: Pai): boolean => pinzuSet.has(pai);

export function isAkadora(pai: Pai): boolean {
  return akaDoraSet.has(pai);
}

export function nonAkadoraCopy(pai: Pai): Pai {
  if (!isAkadora(pai)) {
    return pai;
  } else {
    switch(shupaiType(pai)) {
      case "m":
        return "5m";
      case "p":
        return "5p";
      case "s":
        return "5s";
    }
  }
}

export function isZupai(pai: string): boolean {
  return zupaiSet.has(pai);
}

export function isShupai(pai: string): boolean {
  return shupaiSet.has(pai);
}

const zupaiKanjiArray = ["東", "南", "西", "北", "白", "発發", "中"]
const zupaiToKanji = new Map<Pai, string>();
const zupaiToDigit = new Map<Pai, number>();
const zupaiSet = new Set<Pai>();

for (let i = 1; i <= 7; i++) {
  const zupai = `${i}z`;
  zupaiToKanji.set(zupai, zupaiKanjiArray[i-1]);
  zupaiToDigit.set(zupai, i);
  zupaiSet.add(zupai);
}

export const zupais = (): string[] => [...zupaiSet]
export const allTiles = (): string[] => [...manzuSet, ...pinzuSet, ...sozuSet, ...zupais()];

export function numberToZupai(index: number): Pai {
  return `${index}z`;
}

export function digitForZupai(pai: Pai): number {
  const value = zupaiToDigit.get(pai);
  if (value == undefined) {
    throw new Error(`Tried to get digit for invalid zupai ${pai}`);
  }
  return value;
}

export function kanjiForZupai(pai: Pai): string {
  const value = zupaiToKanji.get(pai);
  if (value == undefined) {
    throw new Error(`Tried to get kanji for invalid zupai ${pai}`);
  }
  return value.slice(0,1);
}

export function zupaisAndKanjis(): [Pai, string][] {
  return [...zupaiToKanji];
}

export function sameValue(pai1: Pai, pai2: Pai): boolean {
  return pai1 == pai2 || isShupai(pai1) && isShupai(pai2) &&
    shupaiType(pai1) === shupaiType(pai2) &&
    shupaiValue(pai1) === shupaiValue(pai2);
}

export function validate(tiles: Pai[]): boolean {
  if (tiles.length == 0) return true;

  const sorted = tiles.sort(compare)

  let previousTile = "invalid";
  let count = 0;
  for (const tile of sorted) {
    if (sameValue(tile, previousTile)) {
      count++;
      if (count > 4 || isAkadora(tile) && count > 1) return false;
    } else {
      previousTile = tile;
      count = 1;
    }
  }
  return true;
}
