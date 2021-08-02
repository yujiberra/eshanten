"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.stringifySingle = exports.parse = exports.compare = exports.rank = void 0;
const pai_1 = require("./pai");
function rank(pai) {
    if (pai_1.isShupai(pai)) {
        let tens;
        switch (pai_1.shupaiType(pai)) {
            case "m":
                tens = 0;
                break;
            case "p":
                tens = 10;
                break;
            case "s":
                tens = 20;
                break;
            default:
                throw new Error("Invalid ShupaiType character"); // shouldn't ever happen
        }
        return tens + pai_1.shupaiValue(pai) - (pai_1.isAkadora(pai) ? 0.5 : 0);
    }
    else {
        return 30 + (pai_1.digitForZupai(pai) || 0);
    }
}
exports.rank = rank;
function compare(pai1, pai2) {
    return rank(pai1) - rank(pai2);
}
exports.compare = compare;
function parse(input) {
    var _a;
    const pais = [];
    // parse kanji-represented zupai
    for (const [pai, representation] of pai_1.zupaisAndKanjis()) {
        const regex = new RegExp('[' + representation + ']', 'g');
        const count = ((_a = input.match(regex)) === null || _a === void 0 ? void 0 : _a.length) || 0;
        const additions = new Array(count).fill(pai);
        pais.push(...additions);
        input = input.replace(regex, "");
    }
    // parse numerically represented zupai
    const zupaiMatch = input.match(/[0-9r]+z/);
    if (zupaiMatch) {
        const zupaiString = zupaiMatch[0];
        [...zupaiString.slice(0, -1)].forEach(char => {
            pais.push(pai_1.numberToZupai(parseInt(char)));
        });
    }
    // parse 数牌
    const colors = input.match(/[0-9r]+[msp]/g);
    colors === null || colors === void 0 ? void 0 : colors.forEach(colorString => {
        const lastChar = colorString[colorString.length - 1];
        let shupaiType;
        switch (lastChar) {
            case "m":
                shupaiType = "m";
                break;
            case "s":
                shupaiType = "s";
                break;
            case "p":
                shupaiType = "p";
                break;
            default:
                throw new Error("Invalid ShupaiType character"); // shouldn't ever happen
        }
        // extract akadora
        if (colorString.match("r5")) {
            pais.push(`0${shupaiType}`);
            colorString = colorString.replace(/r5/g, "");
        }
        // parse remaining tiles
        [...colorString.slice(0, -1)].forEach(char => {
            pais.push(`${parseInt(char)}${shupaiType}`);
        });
    });
    return pais.sort(compare);
}
exports.parse = parse;
function stringifySingleShupaiInSequence(pai) {
    return `${pai_1.isAkadora(pai) ? "r" : ""}${pai_1.shupaiValue(pai)}`;
}
function stringifySingle(pai) {
    return stringify([pai]);
}
exports.stringifySingle = stringifySingle;
function stringify(pais) {
    let output = "";
    let currentShupaiType = undefined;
    for (let i = 0; i < pais.length; i++) {
        const pai = pais[i];
        if (pai_1.isShupai(pai)) {
            if (currentShupaiType) {
                if (currentShupaiType == pai_1.shupaiType(pai)) {
                    output += stringifySingleShupaiInSequence(pai);
                }
                else {
                    output += currentShupaiType;
                    currentShupaiType = pai_1.shupaiType(pai);
                    output += stringifySingleShupaiInSequence(pai);
                }
            }
            else {
                currentShupaiType = pai_1.shupaiType(pai);
                output += stringifySingleShupaiInSequence(pai);
            }
        }
        else {
            if (currentShupaiType) {
                output += currentShupaiType;
                currentShupaiType = undefined;
            }
            output += pais.slice(i).map(pai => pai_1.kanjiForZupai(pai)).join('');
            break;
        }
    }
    if (currentShupaiType) {
        output += currentShupaiType;
    }
    return output;
}
exports.stringify = stringify;
//# sourceMappingURL=parse.js.map