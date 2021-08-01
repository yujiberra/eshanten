"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pai_1 = require("./pai");
const parse_1 = require("./parse");
describe("sameValue", function () {
    it("should identify identical zupai", function () {
        expect(pai_1.sameValue("3z", "3z")).toBeTrue();
        expect(pai_1.sameValue("5z", "5z")).toBeTrue();
    });
    it("should distinguish distinct zupai", function () {
        expect(pai_1.sameValue("3z", "1z")).toBeFalse();
        expect(pai_1.sameValue("5z", "6z")).toBeFalse();
    });
    it("should distinguish zupai and shupai", function () {
        expect(pai_1.sameValue("7z", "3m")).toBeFalse();
        expect(pai_1.sameValue("0p", "7z")).toBeFalse();
    });
    it("should distinguish same-number Shupai from different suits", function () {
        expect(pai_1.sameValue("3m", "3p")).toBeFalse();
    });
    it("should distinguish different-number Shupai from the same suit", function () {
        expect(pai_1.sameValue("4p", "3p")).toBeFalse();
    });
    it("should identify same-number Shupai from the same suit", function () {
        expect(pai_1.sameValue("4p", "4p")).toBeTrue();
    });
    it("should identify same-number Shupai from the same suit, even if one is dora", function () {
        expect(pai_1.sameValue("0p", "5p")).toBeTrue();
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
