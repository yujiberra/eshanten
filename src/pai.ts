export type Pai = string;
export type ShupaiType = "m" | "p" | "s";

const manzus = new Set<string>();
const pinzus = new Set<string>();
const sozus = new Set<string>();
const shupais = new Set<string>();
const shupaiValues = new Map<string, number>();
const akaDoras = new Set<string>();

([["m", manzus], ["p", pinzus], ["s", sozus]] as [string, Set<string>][])
  .map(([char, set]) => {
    for (let i = 1; i <= 9; i++) {
      const tile = `${i}${char}`;
      set.add(tile);
      shupais.add(tile);
      shupaiValues.set(tile, i);
    }
    const akaDora = `r5${char}`
    set.add(akaDora);
    shupais.add(akaDora);
    akaDoras.add(akaDora);
    shupaiValues.set(akaDora, 5);
  }
);

const zupaiKanjiArray = ["東", "南", "西", "北", "白", "発發", "中"]
export const zupaiToKanji = new Map<Pai, string>();
export const zupaiToDigit = new Map<Pai, number>();

for (let i = 1; i <= 7; i++) {
  const zupai = `${i}z`;
  zupaiToKanji.set(zupai, zupaiKanjiArray[i-1]);
  zupaiToDigit.set(zupai, i);
}

export function numberToZupai(index: number): string {
  return `${index}z`;
}

export function shupaiType(pai: Pai): ShupaiType {
  if (manzus.has(pai)) return "m";
  if (pinzus.has(pai)) return "p";
  if (sozus.has(pai)) return "s";
  else throw new Error(`Tried to get type of invalid shupai ${pai}`);
}

export function shupaiValue(pai: Pai): number {
  const value = shupaiValues.get(pai);
  if (value !== undefined) return value;
  else throw new Error(`Tried to get value of invalid shupai ${pai}`);
}

export function isAkadora(pai: Pai): boolean {
  return akaDoras.has(pai);
}

export function isZupai(pai: Pai): boolean {
  return !isShupai(pai);
}

export function isShupai(pai: Pai): boolean {
  return shupais.has(pai);
}
