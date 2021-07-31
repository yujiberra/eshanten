"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("./parse");
const shanten_1 = require("./shanten");
describe("sameTile", function () {
    it("should identify identical zupai", function () {
        expect(shanten_1.sameTile(parse_1.parseSingle("3z"), parse_1.parseSingle("3z"))).toBeTrue();
        expect(shanten_1.sameTile(parse_1.parseSingle("5z"), parse_1.parseSingle("5z"))).toBeTrue();
    });
    it("should distinguish distinct zupai", function () {
        expect(shanten_1.sameTile(parse_1.parseSingle("3z"), parse_1.parseSingle("1z"))).toBeFalse();
        expect(shanten_1.sameTile(parse_1.parseSingle("5z"), parse_1.parseSingle("6z"))).toBeFalse();
    });
    it("should distinguish zupai and shupai", function () {
        expect(shanten_1.sameTile(parse_1.parseSingle("7z"), parse_1.parseSingle("3m"))).toBeFalse();
        expect(shanten_1.sameTile(parse_1.parseSingle("r5p"), parse_1.parseSingle("7z"))).toBeFalse();
    });
    it("should distinguish same-number Shupai from different suits", function () {
        expect(shanten_1.sameTile(parse_1.parseSingle("3m"), parse_1.parseSingle("3p"))).toBeFalse();
    });
    it("should distinguish different-number Shupai from the same suit", function () {
        expect(shanten_1.sameTile(parse_1.parseSingle("4p"), parse_1.parseSingle("3p"))).toBeFalse();
    });
    it("should identify same-number Shupai from the same suit", function () {
        expect(shanten_1.sameTile(parse_1.parseSingle("4p"), parse_1.parseSingle("4p"))).toBeTrue();
    });
    it("should identify same-number Shupai from the same suit, even if one is dora", function () {
        expect(shanten_1.sameTile(parse_1.parseSingle("r5p"), parse_1.parseSingle("5p"))).toBeTrue();
    });
});
describe("fitsInSet", function () {
    it("should correctly identify what fits into a singleton tuple", function () {
        const nanPair = { tiles: parse_1.parse("2z"), type: "tuple" };
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1z"), nanPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("5p"), nanPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("2z"), nanPair)).toBeTrue();
        const akaPair = { tiles: parse_1.parse("r5m"), type: "tuple" };
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1z"), akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("5p"), akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("4m"), akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("5m"), akaPair)).toBeTrue();
    });
    it("should correctly identify what fits into a pair", function () {
        const nanPair = { tiles: parse_1.parse("22z"), type: "tuple" };
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1z"), nanPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("5p"), nanPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("2z"), nanPair)).toBeTrue();
        const akaPair = { tiles: parse_1.parse("r55m"), type: "tuple" };
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1z"), akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("5p"), akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("4m"), akaPair)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("5m"), akaPair)).toBeTrue();
    });
    it("should correctly identify what fits into a singleton run", function () {
        const run = { tiles: parse_1.parse("2m"), type: "run" };
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1z"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("r5m"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1s"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("4p"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1m"), run)).toBeTrue();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("3m"), run)).toBeTrue();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("4m"), run)).toBeTrue();
    });
    it("should correctly identify what fits into a ryanmen", function () {
        const run = { tiles: parse_1.parse("23m"), type: "run" };
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1z"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("r5m"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1s"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("4p"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("2m"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("3m"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1m"), run)).toBeTrue();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("4m"), run)).toBeTrue();
    });
    it("should correctly identify what fits into a kanchan", function () {
        const run = { tiles: parse_1.parse("24m"), type: "run" };
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1z"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("r5m"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("1m"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("3s"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("2m"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("4m"), run)).toBeFalse();
        expect(shanten_1.fitsInSet(parse_1.parseSingle("3m"), run)).toBeTrue();
    });
});
describe("shantenRecurse", function () {
    it("should correctly identify multiple interpretations of 3menchan", function () {
        expect(shanten_1.shantenRecurse({ partialSets: [], remaining: parse_1.parse("12345m4r56p789s77z"),
            useless: [] }).length).toBe(2);
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
