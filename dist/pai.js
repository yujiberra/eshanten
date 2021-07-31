"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseYakuhaiDigits = exports.yakuhaiDigits = exports.reverseYakuhaiDigitArray = exports.yakuhaiCharacters = exports.isShupai = exports.isZupai = void 0;
function isZupai(pai) {
    return typeof pai === 'string';
}
exports.isZupai = isZupai;
function isShupai(pai) {
    return typeof pai !== 'string';
}
exports.isShupai = isShupai;
exports.yakuhaiCharacters = new Map([
    ["ton", "東"],
    ["nan", "南"],
    ["sha", "西"],
    ["pe", "北"],
    ["haku", "白"],
    ["hatsu", "発發"],
    ["chun", "中"],
]);
const yakuhaiDigitArray = [
    [1, "ton"],
    [2, "nan"],
    [3, "sha"],
    [4, "pe"],
    [5, "haku"],
    [6, "hatsu"],
    [7, "chun"],
];
exports.reverseYakuhaiDigitArray = [...yakuhaiDigitArray.map(e => e.slice().reverse())];
exports.yakuhaiDigits = new Map(yakuhaiDigitArray);
exports.reverseYakuhaiDigits = new Map(exports.reverseYakuhaiDigitArray);
