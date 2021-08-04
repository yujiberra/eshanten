import { isShupai, Pai, shupaiType, shupaiValue, sameValue, nonAkadoraCopy,
         shupai,
         validate} from "./pai";
import { compare, stringify } from "./parse";

export interface PartialSet {
  tiles: Pai[],
  type: SetType,
}

export type SetType = "run" | "tuple";

export type Riipai = {
  partialSets: PartialSet[],
  useless: Pai[];
}

export type RiipaiProgress = [Riipai, Pai[]]

export function stringifyRiipai({ partialSets, useless }: Riipai): string {
  const sets = partialSets.map(s => stringify(s.tiles));
  const uselessStr = stringify(useless);
  return `Sets: ${sets.toString()} / Useless: ${uselessStr} / Shanten = ${useless.length}`
}

export function formSet(tile1: Pai, tile2: Pai): PartialSet | null {
  if (sameValue(tile1, tile2)) {
    return { tiles: [tile1, tile2], type: "tuple" };
  } else if (isShupai(tile1) && isShupai(tile2) &&
             (shupaiType(tile1) === shupaiType(tile2)) &&
             (Math.abs(shupaiValue(tile1) - shupaiValue(tile2)) <= 2)) {
    return { tiles: [tile1, tile2], type: "run" };
  } else {
    return null;
  }
}

export function fitsInSet(tile: Pai, partialSet: PartialSet): boolean {
  if (partialSet.tiles.length > 2) {
    return false;
  } else if (partialSet.type === "tuple") {
    return sameValue(tile, partialSet.tiles[0]);
  } else {
    if (isShupai(tile) && shupaiType(tile) === shupaiType(partialSet.tiles[0])) {
      const allTileValues =
        partialSet.tiles.concat(tile).map(tile => shupaiValue(tile));
      const set = new Set(allTileValues);
      const range = Math.max(...allTileValues) - Math.min(...allTileValues);
      return [...set].length == allTileValues.length && range <= 2;
    } else {
      return false;
    }
  }
}

export function shanten(tiles: Pai[]): number {
  return riipai(tiles)[0].useless.length
}

function removeAndCopy<T>(array: T[], ...elements: T[]): T[] {
  const copiedArray = [...array];
  elements.forEach(element =>
    copiedArray.splice(copiedArray.indexOf(element), 1));
  return copiedArray;
}

export function riipai(input: RiipaiProgress | Pai[], currentTile: Pai = "invalid",
    skippedSets: Set<PartialSet> = new Set(), bestSoFar = { shanten: Number.POSITIVE_INFINITY }): Riipai[] {
  const progress = (typeof(input[0]) == 'string' ?
    [{
      partialSets: [],
      useless: []
    }, input] :
    input) as RiipaiProgress;

  const [{ partialSets, useless }, remaining] = progress;

  if (useless.length > bestSoFar.shanten) {
    return [];
  }

  // base case
  if (remaining.length === 0) {
    if (useless.length < bestSoFar.shanten) {
      bestSoFar.shanten = useless.length;
    }
    return [{ partialSets, useless }];
  }

  const roomForMoreRunsAndTriples = partialSets.filter(set =>
    (set.type == "run" || set.tiles.length == 3)).length < 4;

  // try adding first tile to existing sets
  const tile = remaining[0];
  if (!sameValue(tile, currentTile)) {
    currentTile = tile;
    skippedSets = new Set();
  }
  let tileHasAFriend = false;
  let results: Riipai[] = [];
  partialSets.forEach((partialSet, index) => {
    if (!skippedSets.has(partialSet) && fitsInSet(tile, partialSet)) {

      let shouldPutInSet = false;
      if (partialSet.type == 'tuple') {
        // Don't turn a pair into a triple if there aren't any (potential) doubles left
        shouldPutInSet = ((partialSet.tiles.length == 1)  || roomForMoreRunsAndTriples)
      } else if (Math.max(...partialSet.tiles.map(t => shupaiValue(t))) < shupaiValue(tile)) {
        // We only add a tile to a run if it's bigger than the other tiles in
        // it, to prevent double counting

        // We also only put a tile into a run if no other copies of it have been
        // put into tuples, to prevent double counting (again)
        const tilesInExistingTuples = partialSets.filter(p => p.type == "tuple")
          .map(p => p.tiles).reduce((a, b) => a.concat(b), []);
        shouldPutInSet = !tilesInExistingTuples.find(x => sameValue(x, tile)); // !usedRuns.has(setIdentifier) &&
      }

      if (shouldPutInSet) {
        tileHasAFriend = true;
        const newPartialSet = {
          tiles: partialSet.tiles.concat([tile]),
          type: partialSet.type
        }
        const newPartialSets = [...partialSets];
        newPartialSets[index] = newPartialSet;
        results = results.concat(riipai([{
          partialSets: newPartialSets,
          useless: [...useless],
        }, removeAndCopy(remaining, tile)] as RiipaiProgress, currentTile, skippedSets, bestSoFar));
        skippedSets.add(partialSet);
      }
    }
  })

  // try making a new set. only make a run if tuple doesn't exist, to prevent
  // duplication.
  if ((partialSets.length < 5) &&
      (partialSets.filter(set =>
        set.type == "tuple" && sameValue(tile, set.tiles[0])).length == 0)) {
    if (isShupai(tile)) {
      if (roomForMoreRunsAndTriples) {
        results = results.concat(riipai([{
          partialSets: partialSets.concat([{tiles:[tile], type:"run"}]),
          useless: [...useless],
        }, removeAndCopy(remaining, tile)] as RiipaiProgress, currentTile, skippedSets, bestSoFar));
      }
    }
    results = results.concat(riipai([{
      partialSets: partialSets.concat([{tiles:[tile], type:"tuple"}]),
      useless: [...useless],
    }, removeAndCopy(remaining, tile)] as RiipaiProgress, currentTile, skippedSets, bestSoFar));
  }

  // if tile can't combine with anything, give up on using it
  if (!tileHasAFriend) {
    const index = remaining.indexOf(tile);
    const matches = remaining.filter(t => sameValue(t, tile));
    const newRemaining = [...remaining];
    newRemaining.splice(index, matches.length);
    results = results.concat(riipai([{
      partialSets: [...partialSets],
      useless: useless.concat(matches),
    }, newRemaining] as RiipaiProgress, currentTile, skippedSets, bestSoFar));
  }

  const minimum = Math.min(...results.map(progress => progress.useless.length));
  return results.filter(prog => prog.useless.length === minimum);
}

export function partialSetUkeire(partialSet: PartialSet, isPair = false): Pai[][] {
  if (partialSet.type === 'tuple') {
    const additionalNeeded = (isPair? 2 : 3) - partialSet.tiles.length;
    return [Array(additionalNeeded).fill(nonAkadoraCopy(partialSet.tiles[0]))];
  } else {
    if (isPair) throw new Error("A run can't be a pair");
    if (partialSet.tiles.length === 3) {
      return [[]]
    } else {
      const type = shupaiType(partialSet.tiles[0]);
      if (partialSet.tiles.length === 1) {
        const value = shupaiValue(partialSet.tiles[0]);
        const possibilities = [];
        if (value >= 3) {
          possibilities.push([shupai(type, value - 2), shupai(type, value - 1)]);
        }
        if (value >= 2 && value <= 8) {
          possibilities.push([shupai(type, value - 1), shupai(type, value + 1)]);
        }
        if (value <= 7) {
          possibilities.push([shupai(type, value + 1), shupai(type, value + 2)]);
        }
        return possibilities;
      } else if (partialSet.tiles.length === 2) {
          const [min, max] = partialSet.tiles.map(shupaiValue).sort();
          if (max - min == 2) {
            const neededValue = min + 1;
            return [[shupai(type, neededValue)]];
          } else {
            const possibilities = [];
            if (min >= 2) {
              possibilities.push([shupai(type, min - 1)]);
            }
            if (max <= 8) {
              possibilities.push([shupai(type, max + 1)]);
            }
            return possibilities;
          }
      }
    }
  }
  return [[]]; // shouldn't ever get here
}

export function generatePossibilities(possibilities: Pai[][][], index = 0): Pai[][] {
  if (index >= possibilities.length) {
    return [[]];
  } else {
    const result: string[][] = [];
    const simplerCase = generatePossibilities(possibilities, index + 1);

    possibilities[index].forEach(small => simplerCase.forEach(large => result.push(small.concat(large))));
    return result;
  }
}

export function ukeireSingle(sets: PartialSet[]): Pai[] | undefined {
  const possiblePairIndices: number[] = [];
  sets.forEach((set, index) => {
    if (set.type === "tuple" && set.tiles.length <= 2) {
      possiblePairIndices.push(index);
    }
  });

  const setUkeires = sets.map(s => partialSetUkeire(s));

  // Pai[] = possible completion of a partial set, e.g. "23m" => ["1m"]  - 0 ~ 2 elements
  // Pai[][] = all possible completions of a partial set, e.g. "23m" => [["1m"], ["4m"]] - 1 ~ 3 elements
  // Pai[][][] = all possible completions for all 5 partial sets  - 5 elements
  // Pai[][][][] for each possible choice of pair, a layer 3 object

  const pairConfigurations = possiblePairIndices.map(index => {
    const ukeires = [...setUkeires];
    ukeires[index] = partialSetUkeire(sets[index], true);
    //console.log.log(ukeires);
    return ukeires;
  });

  const potentialCompletions = pairConfigurations.map(configuration => generatePossibilities(configuration))
    .reduce((acc, val) => acc.concat(val), []);

  const allTiles = sets.map(set => set.tiles).reduce((acc, val) => acc.concat(val), []);

  const possibleCompletions = potentialCompletions.filter(newTiles => validate(allTiles.concat(newTiles)));

  if (possibleCompletions.length === 0) {
    return undefined;
  } else {
    return [...new Set(possibleCompletions.reduce((acc, val) => acc.concat(val), []))];
  }
}

export function ukeire(input: Riipai[] | Pai[]): Pai[] {
  const riipais = typeof(input[0]) === "string" ? riipai(input as Pai[]): input as Riipai[];
  const results = riipais.map(riipai => ukeireSingle(riipai.partialSets) || []);
  return [...new Set(results.reduce((acc, val) => acc.concat(val), []))].sort(compare);
}
