import { validate, sameValue } from "./pai"
import { parse } from "./parse"

describe("sameValue", function() {
  it("should identify identical zupai", function() {
    expect(sameValue("3z", "3z")).toBeTrue();
    expect(sameValue("5z", "5z")).toBeTrue();
  });

  it ("should distinguish distinct zupai", function() {
    expect(sameValue("3z", "1z")).toBeFalse();
    expect(sameValue("5z", "6z")).toBeFalse();
  });

  it("should distinguish zupai and shupai", function() {
    expect(sameValue("7z", "3m")).toBeFalse();
    expect(sameValue("0p", "7z")).toBeFalse();
  })

  it("should distinguish same-number Shupai from different suits", function() {
    expect(sameValue("3m", "3p")).toBeFalse();
  })

  it("should distinguish different-number Shupai from the same suit", function() {
    expect(sameValue("4p", "3p")).toBeFalse();
  })

  it("should identify same-number Shupai from the same suit", function() {
    expect(sameValue("4p", "4p")).toBeTrue();
  })

  it("should identify same-number Shupai from the same suit, even if one is dora", function() {
    expect(sameValue("0p", "5p")).toBeTrue();
  })
});

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

  it("should invalidate ['0m', '0m']", function() {
    expect(validate(['0m', '0m'])).toBe(false);
  })
});
