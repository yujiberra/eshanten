"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zupaisAndKanjis = exports.kanjiForZupai = exports.digitForZupai = exports.numberToZupai = exports.isShupai = exports.isZupai = exports.isAkadora = exports.shupaiValue = exports.shupaiType = void 0;
const manzus = new Set();
const pinzus = new Set();
const sozus = new Set();
const shupais = new Set();
const shupaiValues = new Map();
const akaDoras = new Set();
[["m", manzus], ["p", pinzus], ["s", sozus]]
    .map(([char, set]) => {
    for (let i = 1; i <= 9; i++) {
        const tile = `${i}${char}`;
        set.add(tile);
        shupais.add(tile);
        shupaiValues.set(tile, i);
    }
    const akaDora = `r5${char}`;
    set.add(akaDora);
    shupais.add(akaDora);
    akaDoras.add(akaDora);
    shupaiValues.set(akaDora, 5);
});
function shupaiType(pai) {
    if (manzus.has(pai))
        return "m";
    if (pinzus.has(pai))
        return "p";
    if (sozus.has(pai))
        return "s";
    else
        throw new Error(`Tried to get type of invalid shupai ${pai}`);
}
exports.shupaiType = shupaiType;
function shupaiValue(pai) {
    const value = shupaiValues.get(pai);
    if (value !== undefined)
        return value;
    else
        throw new Error(`Tried to get value of invalid shupai ${pai}`);
}
exports.shupaiValue = shupaiValue;
function isAkadora(pai) {
    return akaDoras.has(pai);
}
exports.isAkadora = isAkadora;
function isZupai(pai) {
    return !isShupai(pai);
}
exports.isZupai = isZupai;
function isShupai(pai) {
    return shupais.has(pai);
}
exports.isShupai = isShupai;
const zupaiKanjiArray = ["東", "南", "西", "北", "白", "発發", "中"];
const zupaiToKanji = new Map();
const zupaiToDigit = new Map();
for (let i = 1; i <= 7; i++) {
    const zupai = `${i}z`;
    zupaiToKanji.set(zupai, zupaiKanjiArray[i - 1]);
    zupaiToDigit.set(zupai, i);
}
function numberToZupai(index) {
    return `${index}z`;
}
exports.numberToZupai = numberToZupai;
function digitForZupai(pai) {
    const value = zupaiToDigit.get(pai);
    if (value == undefined) {
        throw new Error(`Tried to get digit for invalid zupai ${pai}`);
    }
    return value;
}
exports.digitForZupai = digitForZupai;
function kanjiForZupai(pai) {
    const value = zupaiToKanji.get(pai);
    if (value == undefined) {
        throw new Error(`Tried to get kanji for invalid zupai ${pai}`);
    }
    return value.slice(0, 1);
}
exports.kanjiForZupai = kanjiForZupai;
function zupaisAndKanjis() {
    return [...zupaiToKanji];
}
exports.zupaisAndKanjis = zupaisAndKanjis;
