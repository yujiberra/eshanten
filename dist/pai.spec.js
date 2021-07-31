"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pai_1 = require("./pai");
const parse_1 = require("./parse");
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
    it("should invalidate ['r5m', 'r5m']", function () {
        expect(pai_1.validate(['r5m', 'r5m'])).toBe(false);
    });
});
