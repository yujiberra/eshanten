import { isShupai, Pai, reverseYakuhaiDigits, Shupai, ShupaiType, yakuhaiCharacters, yakuhaiDigits, Zupai } from "./pai";

function rank(pai: Pai): number {
  if (isShupai(pai)) {
    let tens;
    switch(pai.type) {
      case "manzu":
        tens = 0;
        break;
      case "pinzu":
        tens = 10;
        break;
      case "sozu":
        tens = 20;
        break;
      default:
          throw new Error("Invalid ShupaiType character"); // shouldn't ever happen
    }
    return tens + pai.value - (pai.aka ? 0.5 : 0);
  } else {
    return 30 + (reverseYakuhaiDigits.get(pai) || 0);
  }
}

function compare(pai1: Pai, pai2: Pai): number {
  return rank(pai1) - rank(pai2);
}

export function parse(input: string): Pai[] {
  const pais: Pai[] = [];

  // parse kanji-represented zupai
  for (const [pai, representation] of yakuhaiCharacters) {
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
      pais.push(yakuhaiDigits.get(parseInt(char)) as Pai);
    })
  }

  // parse 数牌
  const colors = input.match(/[0-9r]+[msp]/g);
  colors?.forEach(colorString => {
    const lastChar = colorString[colorString.length-1];
    let shupaiType: ShupaiType;
    switch(lastChar) {
      case "m":
        shupaiType = "manzu";
        break;
      case "s":
        shupaiType = "sozu";
        break;
      case "p":
        shupaiType = "pinzu";
        break;
      default:
        throw new Error("Invalid ShupaiType character"); // shouldn't ever happen
    }

    // extract akadora
    if (colorString.match("r5")) {
      pais.push({
        type: shupaiType,
        value: 5,
        aka: true,
      });
      colorString = colorString.replace(/r5/g,"");
    }

    // parse remaining tiles
    [...colorString.slice(0,-1)].forEach(char => {
      pais.push({
        type: shupaiType,
        value: parseInt(char),
        aka: false
      })
    })
  })
  return pais.sort(compare);
}

function stringifySingleShupai(pai: Shupai): string {
  return (pai.aka ? "r" : "") + pai.value.toString();
}

export function stringify(pais: Pai[]): string {
  let output = "";
  let currentShupaiType: ShupaiType | undefined = undefined;
  for (let i = 0; i < pais.length; i++) {
    const pai = pais[i];
    if (isShupai(pai)) {
      if (currentShupaiType) {
        if (currentShupaiType == pai.type) {
          output += stringifySingleShupai(pai);
        } else {
          output += currentShupaiType.slice(0,1);
          currentShupaiType = pai.type;
          output += stringifySingleShupai(pai);
        }
      } else {
        currentShupaiType = pai.type;
        output += stringifySingleShupai(pai);
      }
    } else {
      if (currentShupaiType) {
        output += currentShupaiType.slice(0,1);
        currentShupaiType = undefined;
      }
      output += pais.slice(i).map(pai => {
        const maybeString = yakuhaiCharacters.get(pai as Zupai);
        return maybeString ? maybeString.slice(0,1) : "";
      }).join('');
      break;
    }
  }
  if (currentShupaiType) {
    output += currentShupaiType.slice(0,1);
  }
  return output;
}
