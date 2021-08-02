"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("./parse");
const shanten_1 = require("./shanten");
describe("fitsInSet", function () {
    it("should correctly identify what fits into a singleton tuple", function () {
        const nanPair = { tiles: parse_1.parse("2z"), type: "tuple" };
        expect(shanten_1.fitsInSet("1z", nanPair)).toBeFalse();
        expect(shanten_1.fitsInSet("5p", nanPair)).toBeFalse();
        expect(shanten_1.fitsInSet("2z", nanPair)).toBeTrue();
        const akaPair = { tiles: parse_1.parse("r5m"), type: "tuple" };
        expect(shanten_1.fitsInSet("1z", akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet("5p", akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet("4m", akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet("5m", akaPair)).toBeTrue();
    });
    it("should correctly identify what fits into a pair", function () {
        const nanPair = { tiles: parse_1.parse("22z"), type: "tuple" };
        expect(shanten_1.fitsInSet("1z", nanPair)).toBeFalse();
        expect(shanten_1.fitsInSet("5p", nanPair)).toBeFalse();
        expect(shanten_1.fitsInSet("2z", nanPair)).toBeTrue();
        const akaPair = { tiles: parse_1.parse("r55m"), type: "tuple" };
        expect(shanten_1.fitsInSet("1z", akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet("5p", akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet("4m", akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet("5m", akaPair)).toBeTrue();
    });
    it("should correctly identify what fits into a singleton run", function () {
        const run = { tiles: parse_1.parse("2m"), type: "run" };
        expect(shanten_1.fitsInSet("1z", run)).toBeFalse();
        expect(shanten_1.fitsInSet("0m", run)).toBeFalse();
        expect(shanten_1.fitsInSet("1s", run)).toBeFalse();
        expect(shanten_1.fitsInSet("4p", run)).toBeFalse();
        expect(shanten_1.fitsInSet("1m", run)).toBeTrue();
        expect(shanten_1.fitsInSet("3m", run)).toBeTrue();
        expect(shanten_1.fitsInSet("4m", run)).toBeTrue();
    });
    it("should correctly identify what fits into a ryanmen", function () {
        const run = { tiles: parse_1.parse("23m"), type: "run" };
        expect(shanten_1.fitsInSet("1z", run)).toBeFalse();
        expect(shanten_1.fitsInSet("0m", run)).toBeFalse();
        expect(shanten_1.fitsInSet("1s", run)).toBeFalse();
        expect(shanten_1.fitsInSet("4p", run)).toBeFalse();
        expect(shanten_1.fitsInSet("2m", run)).toBeFalse();
        expect(shanten_1.fitsInSet("3m", run)).toBeFalse();
        expect(shanten_1.fitsInSet("1m", run)).toBeTrue();
        expect(shanten_1.fitsInSet("4m", run)).toBeTrue();
    });
    it("should correctly identify what fits into a kanchan", function () {
        const run = { tiles: parse_1.parse("24m"), type: "run" };
        expect(shanten_1.fitsInSet("1z", run)).toBeFalse();
        expect(shanten_1.fitsInSet("0m", run)).toBeFalse();
        expect(shanten_1.fitsInSet("1m", run)).toBeFalse();
        expect(shanten_1.fitsInSet("3s", run)).toBeFalse();
        expect(shanten_1.fitsInSet("2m", run)).toBeFalse();
        expect(shanten_1.fitsInSet("4m", run)).toBeFalse();
        expect(shanten_1.fitsInSet("3m", run)).toBeTrue();
    });
});
describe("riipai", function () {
    it("should correctly identify multiple interpretations of 3menchan", function () {
        expect(shanten_1.riipai(parse_1.parse("12345m4r56p789s77z")).length).toBe(2);
    });
    it("should correctly identify two interpretations of 7899m", function () {
        expect(shanten_1.riipai(parse_1.parse("7899m111222333z")).length).toBe(2);
    });
});
describe("shanten", function () {
    it("should correctly compute shanten in simple cases", function () {
        expect(shanten_1.shanten(parse_1.parse("123m4r56p789s1234z"))).toBe(2);
        expect(shanten_1.shanten(parse_1.parse("123m4r56p789s1134z"))).toBe(1);
        expect(shanten_1.shanten(parse_1.parse("123m4r56p789s1133z"))).toBe(0);
    });
    it("should correctly compute shanten for complex waits", function () {
        expect(shanten_1.shanten(parse_1.parse("12345m4r56p789s77z"))).toBe(0);
    });
    it("should correctly identify that 123m4r56p789s1111z is 1shanten", function () {
        expect(shanten_1.shanten(parse_1.parse("123m4r56p789s1111z"))).toBe(1);
    });
    it("should correctly identify that 123mr55p11112222z is 2shanten", function () {
        expect(shanten_1.shanten(parse_1.parse("123mr55p11112222z"))).toBe(2);
    });
    it("should correctly identify that 123mr55p11119999s is 1shanten", function () {
        expect(shanten_1.shanten(parse_1.parse("123mr55p11119999s"))).toBe(1);
    });
    it("should correctly identify that 1111222233334z is 3shanten", function () {
        expect(shanten_1.shanten(parse_1.parse("1111222233334z"))).toBe(3);
    });
    it("should correctly identify that 1111m3333p5555s1z is 2shanten", function () {
        expect(shanten_1.shanten(parse_1.parse("1111m3333p5555s1z"))).toBe(2);
    });
});
describe("partialSetUkeire", function () {
    it("should correctly generate ukeire for tuples", function () {
        expect(shanten_1.partialSetUkeire({ tiles: ["1z"], type: "tuple" })).toEqual([["1z", "1z"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["1z", "1z"], type: "tuple" })).toEqual([["1z"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["1z", "1z", "1z"], type: "tuple" })).toEqual([[]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["1m"], type: "tuple" })).toEqual([["1m", "1m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["1m", "1m"], type: "tuple" })).toEqual([["1m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["1m", "1m", "1m"], type: "tuple" })).toEqual([[]]);
    });
    it("should correctly generate ukeire for pairs", function () {
        expect(shanten_1.partialSetUkeire({ tiles: ["1z"], type: "tuple" }, true)).toEqual([["1z"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["1z", "1z"], type: "tuple" }, true)).toEqual([[]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["1m"], type: "tuple" }, true)).toEqual([["1m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["1m", "1m"], type: "tuple" }, true)).toEqual([[]]);
    });
    it("should correctly generate ukeire for two-tile runs", function () {
        expect(shanten_1.partialSetUkeire({ tiles: ["1m", "2m"], type: "run" })).toEqual([["3m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["1m", "3m"], type: "run" })).toEqual([["2m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["8m", "9m"], type: "run" })).toEqual([["7m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["4m", "5m"], type: "run" })).toEqual([["3m"], ["6m"]]);
    });
    it("should correctly generate ukeire for one-tile runs", function () {
        expect(shanten_1.partialSetUkeire({ tiles: ["1m"], type: "run" })).toEqual([["2m", "3m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["2m"], type: "run" })).toEqual([["1m", "3m"], ["3m", "4m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["3m"], type: "run" })).toEqual([["1m", "2m"], ["2m", "4m"], ["4m", "5m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["7m"], type: "run" })).toEqual([["5m", "6m"], ["6m", "8m"], ["8m", "9m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["8m"], type: "run" })).toEqual([["6m", "7m"], ["7m", "9m"]]);
        expect(shanten_1.partialSetUkeire({ tiles: ["9m"], type: "run" })).toEqual([["7m", "8m"]]);
    });
    it("should error when a pair isn't possible", function () {
        expect(() => shanten_1.partialSetUkeire({ tiles: ["1m"], type: "run" }, true)).toThrowError();
        expect(() => shanten_1.partialSetUkeire({ tiles: ["1z", "1z", "1z"], type: "tuple" }, true)).toThrowError();
    });
});
describe("ukeireSingle", function () {
    it("should correctly fill out a single pair", function () {
        expect(shanten_1.ukeireSingle([{ tiles: ["1m"], type: "tuple" }])).toEqual(["1m"]);
    });
    it("should correctly fill out a run", function () {
        expect(shanten_1.ukeireSingle([{ tiles: ["2m"], type: "run" }, { tiles: ["3p", "3p"], type: "tuple" }])).toEqual(["1m", "3m", "4m"]);
    });
});
describe("ukeire", function () {
    it("should correctly determine ukeire", function () {
        expect(shanten_1.ukeire(parse_1.parse("123m4r56p789s1134z"))).toEqual(["1z", "3z", "4z"]);
        expect(shanten_1.ukeire(parse_1.parse("123m4r56p789s1133z"))).toEqual(["1z", "3z"]);
        expect(shanten_1.ukeire(parse_1.parse("7899m111222333z"))).toEqual(["6m", "9m"]);
        expect(shanten_1.ukeire(parse_1.parse("1112345678999m"))).toEqual(parse_1.parse("123456789m"));
    });
});
