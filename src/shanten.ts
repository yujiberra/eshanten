import { isShupai, isZupai, Pai, Shupai } from "./pai";
import { stringifySingle } from "./parse";

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
      const [v1, v2, v3] = [
        tile.value,
        (partialSet.tiles[0] as Shupai).value,
        (partialSet.tiles[1] as Shupai).value
      ]
      return (Math.max(v1, v2, v3) - Math.min(v1, v2, v3) === 2) &&
        (v1 != v2) && (v2 != v3) && (v3 != v1);
    } else {
      return false;
    }
  }
}

export function shanten(tiles: Pai[]): number {
  return shantenRecurse({partialSets: [], remaining: tiles,
    useless: [], worstCaseShanten: 8});
}

function removeAndCopy<T>(array: T[], ...elements: T[]): T[] {
  const copiedArray = [...array];
  elements.forEach(element =>
    copiedArray.splice(copiedArray.indexOf(element), 1));
  return copiedArray;
}

function shantenRecurse(progress: ShantenProgress): number {
  // base case
  if (progress.remaining.length === 0) {
    return progress.worstCaseShanten;
  }

  // try adding first tile to existing sets
  const tile = progress.remaining[0];
  let tileHasAFriend = false;
  const candidates: ShantenProgress[] = [];
  progress.partialSets.forEach(partialSet => {
    if (fitsInSet(tile, partialSet)) {
      tileHasAFriend = true;
      const newPartialSet = {
        tiles: partialSet.tiles.concat([tile]),
        type: partialSet.type
      }
      const newProgress = {
        partialSets: removeAndCopy(progress.partialSets, partialSet)
          .concat([newPartialSet]),
        remaining: removeAndCopy(progress.remaining, tile),
        useless: [...progress.useless],
        worstCaseShanten: progress.worstCaseShanten - 1
      }
      candidates.push(newProgress);
    }
  })

  // try making new sets with first tile and other tiles
  const otherRemainingTiles = [...progress.remaining];
  otherRemainingTiles.splice(0,1);
  const alreadyUsed = new Set<string>();
  otherRemainingTiles.forEach(otherTile => {
    const newSet = formSet(tile, otherTile);
    const string = stringifySingle(otherTile);
    if (newSet && !alreadyUsed.has(string) &&
        !progress.partialSets.find(partialSet =>
          partialSet.type === "tuple" &&
          sameTile(partialSet.tiles[0], tile))) {
      tileHasAFriend = true;
      alreadyUsed.add(string);

      candidates.push({
        partialSets: [...progress.partialSets].concat([newSet]),
        remaining: removeAndCopy(progress.remaining, tile, otherTile),
        useless: [...progress.useless],
        worstCaseShanten: progress.worstCaseShanten - 1
      });
    }
  })

  // if tile can't combine with anything, give up on using it
  if (!tileHasAFriend) {
    candidates.push({
      partialSets: [...progress.partialSets],
      remaining: removeAndCopy(progress.remaining, tile),
      useless: progress.useless.concat([tile]),
      worstCaseShanten: progress.worstCaseShanten
    })
  }

  return Math.min(...candidates.map(progress => shantenRecurse(progress)));
}
