"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.stringifySingle = exports.parse = exports.parseSingle = void 0;
const pai_1 = require("./pai");
function rank(pai) {
    if (pai_1.isShupai(pai)) {
        let tens;
        switch (pai.type) {
            case "manzu":
                tens = 0;
                break;
            case "pinzu":
                tens = 10;
                break;
            case "sozu":
                tens = 20;
                break;
            default:
                throw new Error("Invalid ShupaiType character"); // shouldn't ever happen
        }
        return tens + pai.value - (pai.aka ? 0.5 : 0);
    }
    else {
        return 30 + (pai_1.reverseYakuhaiDigits.get(pai) || 0);
    }
}
function compare(pai1, pai2) {
    return rank(pai1) - rank(pai2);
}
function parseSingle(input) {
    return parse(input)[0];
}
exports.parseSingle = parseSingle;
function parse(input) {
    var _a;
    const pais = [];
    // parse kanji-represented zupai
    for (const [pai, representation] of pai_1.yakuhaiCharacters) {
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
            pais.push(pai_1.yakuhaiDigits.get(parseInt(char)));
        });
    }
    // parse 数牌
    const colors = input.match(/[0-9r]+[msp]/g);
    colors === null || colors === void 0 ? void 0 : colors.forEach(colorString => {
        const lastChar = colorString[colorString.length - 1];
        let shupaiType;
        switch (lastChar) {
            case "m":
                shupaiType = "manzu";
                break;
            case "s":
                shupaiType = "sozu";
                break;
            case "p":
                shupaiType = "pinzu";
                break;
            default:
                throw new Error("Invalid ShupaiType character"); // shouldn't ever happen
        }
        // extract akadora
        if (colorString.match("r5")) {
            pais.push({
                type: shupaiType,
                value: 5,
                aka: true,
            });
            colorString = colorString.replace(/r5/g, "");
        }
        // parse remaining tiles
        [...colorString.slice(0, -1)].forEach(char => {
            pais.push({
                type: shupaiType,
                value: parseInt(char),
                aka: false
            });
        });
    });
    return pais.sort(compare);
}
exports.parse = parse;
function stringifySingleShupai(pai) {
    return (pai.aka ? "r" : "") + pai.value.toString();
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
                if (currentShupaiType == pai.type) {
                    output += stringifySingleShupai(pai);
                }
                else {
                    output += currentShupaiType.slice(0, 1);
                    currentShupaiType = pai.type;
                    output += stringifySingleShupai(pai);
                }
            }
            else {
                currentShupaiType = pai.type;
                output += stringifySingleShupai(pai);
            }
        }
        else {
            if (currentShupaiType) {
                output += currentShupaiType.slice(0, 1);
                currentShupaiType = undefined;
            }
            output += pais.slice(i).map(pai => {
                const maybeString = pai_1.yakuhaiCharacters.get(pai);
                return maybeString ? maybeString.slice(0, 1) : "";
            }).join('');
            break;
        }
    }
    if (currentShupaiType) {
        output += currentShupaiType.slice(0, 1);
    }
    return output;
}
exports.stringify = stringify;
