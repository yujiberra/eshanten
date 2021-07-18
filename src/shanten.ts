import { isShupai, isZupai, Pai, Shupai } from "./pai";
import { stringify, stringifySingle } from "./parse";

export interface PartialSet {
  tiles: Pai[],
  type: SetType,
}

export type SetType = "run" | "tuple";

export interface ShantenProgress {
  partialSets: PartialSet[],
  remaining: Pai[];
  useless: Pai[];
  worstCaseShanten: number;
}

export function stringifyProgress({ partialSets, remaining, useless,
    worstCaseShanten }: ShantenProgress): string {
  const sets = partialSets.map(s => stringify(s.tiles));
  const remainingStr = remaining.length > 0 ? `/ Remaining: ${stringify(remaining)} ` : '';
  const uselessStr = stringify(useless);
  return `Sets: ${sets.toString()} / Useless: ${uselessStr} ${remainingStr}/ Shanten = ${worstCaseShanten}`
}

export function sameTile(pai1: Pai, pai2: Pai): boolean {
  if (isZupai(pai1)) {
    return isZupai(pai2) && pai1 === pai2;
  } else {
    return isShupai(pai2) && pai1.type === pai2.type &&
      pai1.value === pai2.value;
  }
}

export function formSet(tile1: Pai, tile2: Pai): PartialSet | null {
  if (sameTile(tile1, tile2)) {
    return { tiles: [tile1, tile2], type: "tuple" };
  } else if (isShupai(tile1) && isShupai(tile2) && (tile1.type === tile2.type) &&
             (Math.abs(tile1.value - tile2.value) <= 2)) {
    return { tiles: [tile1, tile2], type: "run" };
  } else {
    return null;
  }
}

export function fitsInSet(tile: Pai, partialSet: PartialSet): boolean {
  if (partialSet.tiles.length > 2) {
    return false;
  } else if (partialSet.type === "tuple") {
    return sameTile(tile, partialSet.tiles[0]);
  } else {
    if (isShupai(tile) && tile.type === (partialSet.tiles[0] as Shupai).type) {
      const allTiles = partialSet.tiles.concat(tile).map(tile => (tile as Shupai).value);
      const set = new Set(allTiles);
      const range = Math.max(...allTiles) - Math.min(...allTiles);
      return [...set].length == allTiles.length && range <= 2;
    } else {
      return false;
    }
  }
}

export function shanten(tiles: Pai[]): number {
  const results = shantenRecurse({partialSets: [], remaining: tiles,
    useless: [], worstCaseShanten: 8});
  return results[0].worstCaseShanten
}

function removeAndCopy<T>(array: T[], ...elements: T[]): T[] {
  const copiedArray = [...array];
  elements.forEach(element =>
    copiedArray.splice(copiedArray.indexOf(element), 1));
  return copiedArray;
}

function shantenRecurse(progress: ShantenProgress): ShantenProgress[] {
  // base case
  if (progress.remaining.length === 0) {
    progress.worstCaseShanten = progress.useless.length;
    return [progress];
  }

  // try adding first tile to existing sets
  const tile = progress.remaining[0];
  let tileHasAFriend = false;
  const candidates: ShantenProgress[] = [];
  progress.partialSets.forEach(partialSet => {
    // The complex check below is to disallow e.g. adding 2m to 13m,
    // to prevent double-counting (since 12m + 3m happens earlier)
    if (fitsInSet(tile, partialSet) &&
        (isZupai(tile) || (partialSet.type == 'tuple' ||
          Math.max(...partialSet.tiles.map(tile => (tile as Shupai).value)) < (tile as Shupai).value))) {
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
        worstCaseShanten: progress.worstCaseShanten - 1
      });
    }
  })

  // try making new sets with first tile and other tiles
  if (progress.partialSets.length < 5) {
    if (progress.partialSets.filter(set =>
        set.type == "tuple" && sameTile(tile, set.tiles[0])).length == 0) {
      candidates.push({
        partialSets: progress.partialSets.concat([{tiles:[tile], type:"tuple"}]),
        remaining: removeAndCopy(progress.remaining, tile),
        useless: [...progress.useless],
        worstCaseShanten: progress.worstCaseShanten
      });
    }
    if (isShupai(tile)) {
      candidates.push({
        partialSets: progress.partialSets.concat([{tiles:[tile], type:"run"}]),
        remaining: removeAndCopy(progress.remaining, tile),
        useless: [...progress.useless],
        worstCaseShanten: progress.worstCaseShanten
      });
    }
  }

  // if tile can't combine with anything, give up on using it
  if (!tileHasAFriend) {
    candidates.push({
      partialSets: [...progress.partialSets],
      remaining: removeAndCopy(progress.remaining, tile),
      useless: progress.useless.concat([tile]),
      worstCaseShanten: progress.worstCaseShanten
    })
  }

  const results = candidates.map(progress => shantenRecurse(progress));
  const flattened = results[0].concat(...results.slice(1));
  const minimum = Math.min(...flattened.map(progress => progress.worstCaseShanten));
  return flattened.filter(prog => prog.worstCaseShanten === minimum);
}
