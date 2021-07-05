import { parse, stringify } from "./parse"

describe("parse/stringify", function() {
  it("should correctly parse manzu", function() {
    const input = "12344r55678m";
    expect(stringify(parse(input))).toEqual(input);
  })
})
