import { validate, sameValue } from "./pai"
import { parse, parseOne } from "./parse"

describe("sameValue", function() {
  it("should identify identical zupai", function() {
    expect(sameValue(parseOne("3z"), parseOne("3z"))).toBeTrue();
    expect(sameValue(parseOne("5z"), parseOne("5z"))).toBeTrue();
  });

  it ("should distinguish distinct zupai", function() {
    expect(sameValue(parseOne("3z"), parseOne("1z"))).toBeFalse();
    expect(sameValue(parseOne("5z"), parseOne("6z"))).toBeFalse();
  });

  it("should distinguish zupai and shupai", function() {
    expect(sameValue(parseOne("7z"), parseOne("3m"))).toBeFalse();
    expect(sameValue(parseOne("r5p"), parseOne("7z"))).toBeFalse();
  })

  it("should distinguish same-number Shupai from different suits", function() {
    expect(sameValue(parseOne("3m"), parseOne("3p"))).toBeFalse();
  })

  it("should distinguish different-number Shupai from the same suit", function() {
    expect(sameValue(parseOne("4p"), parseOne("3p"))).toBeFalse();
  })

  it("should identify same-number Shupai from the same suit", function() {
    expect(sameValue(parseOne("4p"), parseOne("4p"))).toBeTrue();
  })

  it("should identify same-number Shupai from the same suit, even if one is dora", function() {
    expect(sameValue(parseOne("r5p"), parseOne("5p"))).toBeTrue();
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
