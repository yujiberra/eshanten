import { parse, parseSingle as parseOne } from "./parse";
import { fitsInSet, PartialSet, shanten, shantenRecurse } from "./shanten"

describe("fitsInSet", function() {
  it ("should correctly identify what fits into a singleton tuple", function() {
    const nanPair: PartialSet = {tiles:parse("2z"), type:"tuple"};
    expect(fitsInSet(parseOne("1z"), nanPair)).toBeFalse();
    expect(fitsInSet(parseOne("5p"), nanPair)).toBeFalse();
    expect(fitsInSet(parseOne("2z"), nanPair)).toBeTrue();
    const akaPair: PartialSet = {tiles:parse("r5m"), type:"tuple"};
    expect(fitsInSet(parseOne("1z"), akaPair)).toBeFalse();
    expect(fitsInSet(parseOne("5p"), akaPair)).toBeFalse();
    expect(fitsInSet(parseOne("4m"), akaPair)).toBeFalse();
    expect(fitsInSet(parseOne("5m"), akaPair)).toBeTrue();
  });

  it ("should correctly identify what fits into a pair", function() {
    const nanPair: PartialSet = {tiles:parse("22z"), type:"tuple"};
    expect(fitsInSet(parseOne("1z"), nanPair)).toBeFalse();
    expect(fitsInSet(parseOne("5p"), nanPair)).toBeFalse();
    expect(fitsInSet(parseOne("2z"), nanPair)).toBeTrue();
    const akaPair: PartialSet = {tiles:parse("r55m"), type:"tuple"};
    expect(fitsInSet(parseOne("1z"), akaPair)).toBeFalse();
    expect(fitsInSet(parseOne("5p"), akaPair)).toBeFalse();
    expect(fitsInSet(parseOne("4m"), akaPair)).toBeFalse();
    expect(fitsInSet(parseOne("5m"), akaPair)).toBeTrue();
  });

  it ("should correctly identify what fits into a singleton run", function() {
    const run: PartialSet = {tiles:parse("2m"), type:"run"};
    expect(fitsInSet(parseOne("1z"), run)).toBeFalse();
    expect(fitsInSet(parseOne("r5m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("1s"), run)).toBeFalse();
    expect(fitsInSet(parseOne("4p"), run)).toBeFalse();
    expect(fitsInSet(parseOne("1m"), run)).toBeTrue();
    expect(fitsInSet(parseOne("3m"), run)).toBeTrue();
    expect(fitsInSet(parseOne("4m"), run)).toBeTrue();
  });

  it ("should correctly identify what fits into a ryanmen", function() {
    const run: PartialSet = {tiles:parse("23m"), type:"run"};
    expect(fitsInSet(parseOne("1z"), run)).toBeFalse();
    expect(fitsInSet(parseOne("r5m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("1s"), run)).toBeFalse();
    expect(fitsInSet(parseOne("4p"), run)).toBeFalse();
    expect(fitsInSet(parseOne("2m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("3m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("1m"), run)).toBeTrue();
    expect(fitsInSet(parseOne("4m"), run)).toBeTrue();
  });

  it ("should correctly identify what fits into a kanchan", function() {
    const run: PartialSet = {tiles:parse("24m"), type:"run"};
    expect(fitsInSet(parseOne("1z"), run)).toBeFalse();
    expect(fitsInSet(parseOne("r5m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("1m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("3s"), run)).toBeFalse();
    expect(fitsInSet(parseOne("2m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("4m"), run)).toBeFalse();
    expect(fitsInSet(parseOne("3m"), run)).toBeTrue();
  });
});

describe("shantenRecurse", function() {
  it ("should correctly identify multiple interpretations of 3menchan", function() {
    expect(shantenRecurse({partialSets: [], remaining: parse("12345m4r56p789s77z"),
      useless: []}).length).toBe(2);
  });
});

describe("shanten", function() {
  it ("should correctly compute shanten in simple cases", function() {
    expect(shanten(parse("123m4r56p789s1234z"))).toBe(2);
    expect(shanten(parse("123m4r56p789s1134z"))).toBe(1);
    expect(shanten(parse("123m4r56p789s1133z"))).toBe(0);
  });

  it ("should correctly compute shanten for complex waits", function() {
    expect(shanten(parse("12345m4r56p789s77z"))).toBe(0);
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
