"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("./parse");
describe("parse/stringify", function () {
    it("should correctly parse manzu", function () {
        const input = "12344r55678m";
        expect(parse_1.stringify(parse_1.parse(input))).toEqual(input);
    });
    it("should correctly parse pinzu", function () {
        const input = "11123577778889p";
        expect(parse_1.stringify(parse_1.parse(input))).toEqual(input);
    });
    it("should correctly parse sozu", function () {
        const input = "111r555666789s";
        expect(parse_1.stringify(parse_1.parse(input))).toEqual(input);
    });
    it("should correctly parse kanji input", function () {
        const input = "東南西北白発中";
        expect(parse_1.stringify(parse_1.parse(input))).toEqual(input);
    });
    it("should correctly parse numerically input zupai", function () {
        const input = "7654321z";
        expect(parse_1.stringify(parse_1.parse(input))).toEqual("東南西北白発中");
    });
    it("should correctly parse combined input", function () {
        const input = "123m4r56p789s東東白白白";
        expect(parse_1.stringify(parse_1.parse(input))).toEqual(input);
    });
    it("should correctly parse and sort out-of-order input", function () {
        const input = "64p987s白東白312mr5p東白";
        const result = "123m4r56p789s東東白白白";
        expect(parse_1.stringify(parse_1.parse(input))).toEqual(result);
    });
});
