import { digitForZupai, isAkadora, isShupai, kanjiForZupai, numberToZupai, Pai, shupaiType, ShupaiType,
  shupaiValue,
  zupaisAndKanjis} from "./pai";

export type PaiOrString = Pai | string;

export function rank(pai: Pai): number {
  if (isShupai(pai)) {
    let tens;
    switch(shupaiType(pai)) {
      case "m":
        tens = 0;
        break;
      case "p":
        tens = 10;
        break;
      case "s":
        tens = 20;
        break;
      default:
          throw new Error("Invalid ShupaiType character"); // shouldn't ever happen
    }
    return tens + shupaiValue(pai) - (isAkadora(pai) ? 0.5 : 0);
  } else {
    return 30 + (digitForZupai(pai) || 0);
  }
}

export function compare(pai1: Pai, pai2: Pai): number {
  return rank(pai1) - rank(pai2);
}

export function parseOne(input: string): Pai {
  return parse(input)[0];
}

export function parse(input: string): Pai[] {
  const pais: Pai[] = [];

  // parse kanji-represented zupai
  for (const [pai, representation] of zupaisAndKanjis()) {
    const regex = new RegExp('[' + representation + ']', 'g');
    const count = input.match(regex)?.length || 0;
    const additions = new Array<Pai>(count).fill(pai);
    pais.push(...additions);
    input = input.replace(regex, "");
  }

  // parse numerically represented zupai
  const zupaiMatch = input.match(/[0-9r]+z/);
  if (zupaiMatch) {
    const zupaiString = zupaiMatch[0];
    [...zupaiString.slice(0,-1)].forEach(char => {
      pais.push(numberToZupai(parseInt(char)));
    })
  }

  // parse 数牌
  const colors = input.match(/[0-9r]+[msp]/g);
  colors?.forEach(colorString => {
    const lastChar = colorString[colorString.length-1];
    let shupaiType: ShupaiType;
    switch(lastChar) {
      case "m":
        shupaiType = "m";
        break;
      case "s":
        shupaiType = "s";
        break;
      case "p":
        shupaiType = "p";
        break;
      default:
        throw new Error("Invalid ShupaiType character"); // shouldn't ever happen
    }

    // extract akadora
    if (colorString.match("r5")) {
      pais.push(`0${shupaiType}`);
      colorString = colorString.replace(/r5/g,"");
    }

    // parse remaining tiles
    [...colorString.slice(0,-1)].forEach(char => {
      pais.push(`${parseInt(char)}${shupaiType}`)
    })
  })
  return pais.sort(compare);
}

function stringifySingleShupaiInSequence(pai: Pai): string {
  return `${isAkadora(pai) ? "r" : ""}${shupaiValue(pai)}`;
}

export function stringifySingle(pai: Pai): string {
  return stringify([pai]);
}

export function stringify(pais: Pai[]): string {
  let output = "";
  let currentShupaiType: ShupaiType | undefined = undefined;
  for (let i = 0; i < pais.length; i++) {
    const pai = pais[i];
    if (isShupai(pai)) {
      if (currentShupaiType) {
        if (currentShupaiType == shupaiType(pai)) {
          output += stringifySingleShupaiInSequence(pai);
        } else {
          output += currentShupaiType;
          currentShupaiType = shupaiType(pai);
          output += stringifySingleShupaiInSequence(pai);
        }
      } else {
        currentShupaiType = shupaiType(pai);
        output += stringifySingleShupaiInSequence(pai);
      }
    } else {
      if (currentShupaiType) {
        output += currentShupaiType;
        currentShupaiType = undefined;
      }
      output += pais.slice(i).map(pai => kanjiForZupai(pai)).join('');
      break;
    }
  }
  if (currentShupaiType) {
    output += currentShupaiType;
  }
  return output;
}
