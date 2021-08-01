import { isShupai, Pai, shupaiType, shupaiValue, sameValue } from "./pai";
import { stringify } from "./parse";

export interface PartialSet {
  tiles: Pai[],
  type: SetType,
}

export type SetType = "run" | "tuple";

export interface ShantenProgress {
  partialSets: PartialSet[],
  remaining: Pai[];
  useless: Pai[];
}

export function stringifyProgress({ partialSets, remaining, useless }: ShantenProgress): string {
  const sets = partialSets.map(s => stringify(s.tiles));
  const remainingStr = remaining.length > 0 ? `/ Remaining: ${stringify(remaining)} ` : '';
  const uselessStr = stringify(useless);
  return `Sets: ${sets.toString()} / Useless: ${uselessStr} ${remainingStr}/ Shanten = ${useless.length}`
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

export function riipai(input: ShantenProgress | Pai[]): ShantenProgress[] {
  const progress = Array.isArray(input) ?
    {
      partialSets: [],
      remaining: input,
      useless: []
    } :
    input as ShantenProgress;


  // base case
  if (progress.remaining.length === 0) {
    return [progress];
  }

  const roomForMoreRunsAndTriples = progress.partialSets.filter(set =>
    (set.type == "run" || set.tiles.length == 3)).length < 4;

  // try adding first tile to existing sets
  const tile = progress.remaining[0];
  let tileHasAFriend = false;
  const candidates: ShantenProgress[] = [];
  progress.partialSets.forEach(partialSet => {
    // The complex check below is to disallow e.g. adding 2m to 13m,
    // to prevent double-counting (since 12m + 3m happens earlier)
    if (fitsInSet(tile, partialSet) &&
        ((partialSet.type == 'tuple' && ((partialSet.tiles.length == 1)  || roomForMoreRunsAndTriples)) ||
          (isShupai(partialSet.tiles[0]) && Math.max(...partialSet.tiles.map(t => shupaiValue(t))) < shupaiValue(tile)))) {
      tileHasAFriend = true;
      const newPartialSet = {
        tiles: partialSet.tiles.concat([tile]),
        type: partialSet.type
      }
      candidates.push({
        partialSets: removeAndCopy(progress.partialSets, partialSet)
          .concat([newPartialSet]),
        remaining: removeAndCopy(progress.remaining, tile),
        useless: [...progress.useless],
      });
    }
  })

  // try making a new set. only make a run if tuple doesn't exist, to prevent
  // duplication.
  if ((progress.partialSets.length < 5) &&
      (progress.partialSets.filter(set =>
        set.type == "tuple" && sameValue(tile, set.tiles[0])).length == 0)) {
    if (isShupai(tile)) {
      if (roomForMoreRunsAndTriples) {
        candidates.push({
          partialSets: progress.partialSets.concat([{tiles:[tile], type:"run"}]),
          remaining: removeAndCopy(progress.remaining, tile),
          useless: [...progress.useless],
        });
      }
    }
    candidates.push({
      partialSets: progress.partialSets.concat([{tiles:[tile], type:"tuple"}]),
      remaining: removeAndCopy(progress.remaining, tile),
      useless: [...progress.useless],
    });
  }

  // if tile can't combine with anything, give up on using it
  if (!tileHasAFriend) {
    const index = progress.remaining.indexOf(tile);
    const matches = progress.remaining.filter(t => sameValue(t, tile));
    const newRemaining = [...progress.remaining];
    newRemaining.splice(index, matches.length);
    candidates.push({
      partialSets: [...progress.partialSets],
      remaining: newRemaining,
      useless: progress.useless.concat(matches),
    })
  }

  const results = candidates.map(progress => riipai(progress));
  const flattened = results[0].concat(...results.slice(1));
  const minimum = Math.min(...flattened.map(progress => progress.useless.length));
  return flattened.filter(prog => prog.useless.length === minimum);
}
