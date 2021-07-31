import { validate } from "./pai"
import { parse } from "./parse"

describe("validate", function() {
  it("should validate 1111234m11112z", function() {
    expect(validate(parse("1111234m11112z"))).toBe(true);
  });

  it("should invalidate 111111m", function() {
    expect(validate(parse("111111m"))).toBe(false);
  });

  it("should invalidate 11111m", function() {
    expect(validate(parse("11111m"))).toBe(false);
  });

  it("should invalidate r55555m", function() {
    expect(validate(parse("r55555m"))).toBe(false);
  });

  it("should invalidate ['r5m', 'r5m']", function() {
    expect(validate(['r5m', 'r5m'])).toBe(false);
  })
});
