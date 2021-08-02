"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.sameValue = exports.zupaisAndKanjis = exports.kanjiForZupai = exports.digitForZupai = exports.numberToZupai = exports.allTiles = exports.zupais = exports.isShupai = exports.isZupai = exports.nonAkadoraCopy = exports.isAkadora = exports.isPinzu = exports.isSozu = exports.isManzu = exports.shupai = exports.shupaiValue = exports.shupaiType = exports.shupais = exports.sozus = exports.pinzus = exports.manzus = void 0;
const parse_1 = require("./parse");
const manzuSet = new Set();
const pinzuSet = new Set();
const sozuSet = new Set();
const shupaiSet = new Set();
const shupaiValues = new Map();
const akaDoraSet = new Set();
const manzus = () => [...manzuSet];
exports.manzus = manzus;
const pinzus = () => [...pinzuSet];
exports.pinzus = pinzus;
const sozus = () => [...sozuSet];
exports.sozus = sozus;
const shupais = () => [...shupaiSet];
exports.shupais = shupais;
[["m", manzuSet], ["p", pinzuSet], ["s", sozuSet]]
    .map(([char, set]) => {
    for (let i = 1; i <= 9; i++) {
        const tile = `${i}${char}`;
        set.add(tile);
        shupaiSet.add(tile);
        shupaiValues.set(tile, i);
    }
    const akaDora = `0${char}`;
    set.add(akaDora);
    shupaiSet.add(akaDora);
    akaDoraSet.add(akaDora);
    shupaiValues.set(akaDora, 5);
});
function shupaiType(pai) {
    if (manzuSet.has(pai))
        return "m";
    if (pinzuSet.has(pai))
        return "p";
    if (sozuSet.has(pai))
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
function shupai(type, value, aka = false) {
    return `${aka ? 0 : value}${type}`;
}
exports.shupai = shupai;
const isManzu = (pai) => manzuSet.has(pai);
exports.isManzu = isManzu;
const isSozu = (pai) => sozuSet.has(pai);
exports.isSozu = isSozu;
const isPinzu = (pai) => pinzuSet.has(pai);
exports.isPinzu = isPinzu;
function isAkadora(pai) {
    return akaDoraSet.has(pai);
}
exports.isAkadora = isAkadora;
function nonAkadoraCopy(pai) {
    if (!isAkadora(pai)) {
        return pai;
    }
    else {
        switch (shupaiType(pai)) {
            case "m":
                return "5m";
            case "p":
                return "5p";
            case "s":
                return "5s";
        }
    }
}
exports.nonAkadoraCopy = nonAkadoraCopy;
function isZupai(pai) {
    return zupaiSet.has(pai);
}
exports.isZupai = isZupai;
function isShupai(pai) {
    return shupaiSet.has(pai);
}
exports.isShupai = isShupai;
const zupaiKanjiArray = ["東", "南", "西", "北", "白", "発發", "中"];
const zupaiToKanji = new Map();
const zupaiToDigit = new Map();
const zupaiSet = new Set();
for (let i = 1; i <= 7; i++) {
    const zupai = `${i}z`;
    zupaiToKanji.set(zupai, zupaiKanjiArray[i - 1]);
    zupaiToDigit.set(zupai, i);
    zupaiSet.add(zupai);
}
const zupais = () => [...zupaiSet];
exports.zupais = zupais;
const allTiles = () => [...manzuSet, ...pinzuSet, ...sozuSet, ...exports.zupais()];
exports.allTiles = allTiles;
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
function sameValue(pai1, pai2) {
    return pai1 == pai2 || isShupai(pai1) && isShupai(pai2) &&
        shupaiType(pai1) === shupaiType(pai2) &&
        shupaiValue(pai1) === shupaiValue(pai2);
}
exports.sameValue = sameValue;
function validate(tiles) {
    if (tiles.length == 0)
        return true;
    const sorted = tiles.sort(parse_1.compare);
    let previousTile = "invalid";
    let count = 0;
    for (const tile of sorted) {
        if (sameValue(tile, previousTile)) {
            count++;
            if (count > 4 || isAkadora(tile) && count > 1)
                return false;
        }
        else {
            previousTile = tile;
            count = 1;
        }
    }
    return true;
}
exports.validate = validate;
