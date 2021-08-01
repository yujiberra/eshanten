"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pai_1 = require("./pai");
const parse_1 = require("./parse");
describe("sameValue", function () {
    it("should identify identical zupai", function () {
        expect(pai_1.sameValue(parse_1.parseSingle("3z"), parse_1.parseSingle("3z"))).toBeTrue();
        expect(pai_1.sameValue(parse_1.parseSingle("5z"), parse_1.parseSingle("5z"))).toBeTrue();
    });
    it("should distinguish distinct zupai", function () {
        expect(pai_1.sameValue(parse_1.parseSingle("3z"), parse_1.parseSingle("1z"))).toBeFalse();
        expect(pai_1.sameValue(parse_1.parseSingle("5z"), parse_1.parseSingle("6z"))).toBeFalse();
    });
    it("should distinguish zupai and shupai", function () {
        expect(pai_1.sameValue(parse_1.parseSingle("7z"), parse_1.parseSingle("3m"))).toBeFalse();
        expect(pai_1.sameValue(parse_1.parseSingle("r5p"), parse_1.parseSingle("7z"))).toBeFalse();
    });
    it("should distinguish same-number Shupai from different suits", function () {
        expect(pai_1.sameValue(parse_1.parseSingle("3m"), parse_1.parseSingle("3p"))).toBeFalse();
    });
    it("should distinguish different-number Shupai from the same suit", function () {
        expect(pai_1.sameValue(parse_1.parseSingle("4p"), parse_1.parseSingle("3p"))).toBeFalse();
    });
    it("should identify same-number Shupai from the same suit", function () {
        expect(pai_1.sameValue(parse_1.parseSingle("4p"), parse_1.parseSingle("4p"))).toBeTrue();
    });
    it("should identify same-number Shupai from the same suit, even if one is dora", function () {
        expect(pai_1.sameValue(parse_1.parseSingle("r5p"), parse_1.parseSingle("5p"))).toBeTrue();
    });
});
describe("validate", function () {
    it("should validate 1111234m11112z", function () {
        expect(pai_1.validate(parse_1.parse("1111234m11112z"))).toBe(true);
    });
    it("should invalidate 111111m", function () {
        expect(pai_1.validate(parse_1.parse("111111m"))).toBe(false);
    });
    it("should invalidate 11111m", function () {
        expect(pai_1.validate(parse_1.parse("11111m"))).toBe(false);
    });
    it("should invalidate r55555m", function () {
        expect(pai_1.validate(parse_1.parse("r55555m"))).toBe(false);
    });
    it("should invalidate ['0m', '0m']", function () {
        expect(pai_1.validate(['0m', '0m'])).toBe(false);
    });
});
