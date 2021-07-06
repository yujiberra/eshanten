import { parse, parseSingle as parseOne } from "./parse";
import { fitsInSet, formSet, PartialSet, sameTile, shanten } from "./shanten"

describe("sameTile", function() {
  it("should identify identical zupai", function() {
    expect(sameTile(parseOne("3z"), parseOne("3z"))).toBeTrue();
    expect(sameTile(parseOne("5z"), parseOne("5z"))).toBeTrue();
  });

  it ("should distinguish distinct zupai", function() {
    expect(sameTile(parseOne("3z"), parseOne("1z"))).toBeFalse();
    expect(sameTile(parseOne("5z"), parseOne("6z"))).toBeFalse();
  });

  it("should distinguish zupai and shupai", function() {
    expect(sameTile(parseOne("7z"), parseOne("3m"))).toBeFalse();
    expect(sameTile(parseOne("r5p"), parseOne("7z"))).toBeFalse();
  })

  it("should distinguish same-number Shupai from different suits", function() {
    expect(sameTile(parseOne("3m"), parseOne("3p"))).toBeFalse();
  })

  it("should distinguish different-number Shupai from the same suit", function() {
    expect(sameTile(parseOne("4p"), parseOne("3p"))).toBeFalse();
  })

  it("should identify same-number Shupai from the same suit", function() {
    expect(sameTile(parseOne("4p"), parseOne("4p"))).toBeTrue();
  })

  it("should identify same-number Shupai from the same suit, even if one is dora", function() {
    expect(sameTile(parseOne("r5p"), parseOne("5p"))).toBeTrue();
  })
});

describe("formSet", function() {
  it ("should not combine distinct zupai", function() {
    expect(formSet(parseOne("7z"), parseOne("1z"))).toBeFalsy();
    expect(formSet(parseOne("5z"), parseOne("6z"))).toBeFalsy();
  });

  it ("should not combine shupai with zupai", function() {
    expect(formSet(parseOne("7z"), parseOne("3m"))).toBeFalsy();
    expect(formSet({ type: "pinzu", value: 5, aka: true }, parseOne("5z"))).toBeFalsy();
  })

  it("should not combine Shupai from different suits", function() {
    expect(formSet(parseOne("3m"),
      parseOne("3p"))).toBeFalsy();
    expect(formSet(parseOne("2m"),
      parseOne("3p"))).toBeFalsy();
    expect(formSet(parseOne("1m"),
      parseOne("3p"))).toBeFalsy();
    expect(formSet(parseOne("9m"),
      parseOne("3p"))).toBeFalsy()
  })

  it("should not combine far-away Shupai from the same suit", function() {
    expect(formSet(parseOne("3m"), parseOne("6m"))).toBeFalsy();
    expect(formSet(parseOne("1m"), parseOne("9m"))).toBeFalsy();
  })

  it ("should combine identical zupai", function() {
    const set = formSet(parseOne("1z"), parseOne("1z"));
    expect(set).toBeTruthy();
    expect(set?.type).toBe("tuple");
  });

  it ("should combine identical shupai", function() {
    const set = formSet(parseOne("5m"), parseOne("r5m"));
    expect(set).toBeTruthy();
    expect(set?.type).toBe("tuple");
  });

  it ("should combine adjacent shupai", function() {
    const set = formSet(parseOne("4m"), parseOne("r5m"));
    expect(set).toBeTruthy();
    expect(set?.type).toBe("run");
  });

  it ("should combine one-gap shupai", function() {
    const set = formSet(parseOne("3m"), parseOne("r5m"));
    expect(set).toBeTruthy();
    expect(set?.type).toBe("run");
  });
});

describe("fitsInSet", function() {
  it ("should correctly identify what fits into a pair", function() {
    const nanPair = formSet(parseOne("2z"), parseOne("2z")) as PartialSet;
    expect(fitsInSet(parseOne("1z"), nanPair)).toBeFalse();
    expect(fitsInSet(parseOne("5p"), nanPair)).toBeFalse();
    expect(fitsInSet(parseOne("2z"), nanPair)).toBeTrue();
    const akaPair = formSet(parseOne("r5m"), parseOne("5m")) as PartialSet;
    expect(fitsInSet(parseOne("1z"), akaPair)).toBeFalse();
    expect(fitsInSet(parseOne("5p"), akaPair)).toBeFalse();
    expect(fitsInSet(parseOne("4m"), akaPair)).toBeFalse();
    expect(fitsInSet(parseOne("5m"), akaPair)).toBeTrue();
  });

  it ("should correctly identify what fits into a ryanmen", function() {
    const run = formSet(parseOne("2m"), parseOne("3m")) as PartialSet;
    expect(fitsInSet(parseOne("1z"), run)).toBeFalse();
    expect(fitsInSet(parseOne("r5m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("1m"), run)).toBeTrue();
    expect(fitsInSet(parseOne("4m"), run)).toBeTrue();
  });

  it ("should correctly identify what fits into a kanchan", function() {
    const run = formSet(parseOne("2m"), parseOne("4m")) as PartialSet;
    expect(fitsInSet(parseOne("1z"), run)).toBeFalse();
    expect(fitsInSet(parseOne("r5m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("1m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("3m"), run)).toBeTrue();
  });
});

describe("shanten", function() {
  it ("should correctly compute shanten in simple cases", function() {
    expect(shanten(parse("123m4r56p789s1234z"))).toBe(2);
    expect(shanten(parse("123m4r56p789s1134z"))).toBe(1);
    expect(shanten(parse("123m4r56p789s1133z"))).toBe(0);
    expect(shanten(parse("123m4r56p789s1133z"))).toBe(0);
  });

  it ("should correctly identify that 123m4r56p789s1111z is 1shanten", function() {
    expect(shanten(parse("123m4r56p789s1111z"))).toBe(1);
  });

  it ("should correctly identify that 123mr55p11112222z is 2shanten", function() {
    expect(shanten(parse("123mr55p11112222z"))).toBe(2);
  });

  it ("should correctly identify that 123mr55p11119999s is 1shanten", function() {
    expect(shanten(parse("123mr55p11119999s"))).toBe(1);
  });

  it ("should correctly identify that 1111222233334z is 3shanten", function() {
    expect(shanten(parse("1111222233334z"))).toBe(3);
  });

  it ("should correctly identify that 1111m3333p5555s1z is 2shanten", function() {
    expect(shanten(parse("1111m3333p5555s1z"))).toBe(2);
  });
});
