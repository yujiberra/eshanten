export type Pai = string;
export type ShupaiType = "m" | "p" | "s";

const manzus = new Set<Pai>();
const pinzus = new Set<Pai>();
const sozus = new Set<Pai>();
const shupais = new Set<Pai>();
const shupaiValues = new Map<Pai, number>();
const akaDoras = new Set<Pai>();

([["m", manzus], ["p", pinzus], ["s", sozus]] as [ShupaiType, Set<string>][])
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

const zupaiKanjiArray = ["東", "南", "西", "北", "白", "発發", "中"]
const zupaiToKanji = new Map<Pai, string>();
const zupaiToDigit = new Map<Pai, number>();

for (let i = 1; i <= 7; i++) {
  const zupai = `${i}z`;
  zupaiToKanji.set(zupai, zupaiKanjiArray[i-1]);
  zupaiToDigit.set(zupai, i);
}

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
