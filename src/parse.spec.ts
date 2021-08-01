import { parse, stringify } from "./parse"

describe("parse/stringify", function() {
  it("should correctly parse manzu", function() {
    const input = "12344r55678m";
    expect(stringify(parse(input))).toEqual(input);
  });

  it("should correctly parse pinzu", function() {
    const input = "11123577778889p";
    expect(stringify(parse(input))).toEqual(input);
  });

  it("should correctly parse sozu", function() {
    const input = "111r555666789s";
    expect(stringify(parse(input))).toEqual(input);
  });

  it("should correctly parse kanji input", function() {
    const input = "東南西北白発中";
    expect(stringify(parse(input))).toEqual(input);
  });

  it("should correctly parse numerically input zupai", function() {
    const input = "7654321z"
    expect(stringify(parse(input))).toEqual("東南西北白発中");
  });

  it("should correctly parse akadora represented as 0", function() {
    expect(stringify(parse("111055666789s"))).toEqual("111r555666789s");
  });

  it("should correctly parse combined input", function() {
    const input = "123m4r56p789s東東白白白";
    expect(stringify(parse(input))).toEqual(input);
  });

  it("should correctly parse and sort out-of-order input", function() {
    const input = "64p987s白東白312mr5p東白";
    const result = "123m4r56p789s東東白白白";
    expect(stringify(parse(input))).toEqual(result);
  });
})
