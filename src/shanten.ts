import { isShupai, isZupai, Pai, Shupai } from "./pai";
import { stringifySingle } from "./parse";

export interface PartialSet {
  tiles: Pai[],
  type: SetType,
}

export type SetType = "run" | "tuple";

export interface ShantenProgress {
  partialSets: PartialSet[],
  remainingTiles: Pai[];
  uselessTiles: Pai[];
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
  return shantenRecurse({partialSets: [], remainingTiles: tiles, uselessTiles: []});
}

function shantenRecurse(progress: ShantenProgress): number {
  // base case
  if (progress.remainingTiles.length === 0) {
    return progress.uselessTiles.length;
  }

  const tile = progress.remainingTiles[0];
  const candidates: ShantenProgress[] = [];
  progress.partialSets.forEach(partialSet => {
    if (fitsInSet(tile, partialSet)) {
      const newPartialSets = [...progress.partialSets];
      newPartialSets.splice(newPartialSets.indexOf(partialSet), 1)

      const newRemainingTiles = [...progress.remainingTiles];
      newRemainingTiles.splice(newRemainingTiles.indexOf(tile), 1);

      const newProgress = {
        partialSets: newPartialSets,
        remainingTiles: newRemainingTiles,
        uselessTiles: [...progress.uselessTiles]
      }
      newProgress.partialSets.push({
        tiles: partialSet.tiles.concat([tile]),
        type: partialSet.type
      });
      candidates.push(newProgress);
    }
  })

  const otherRemainingTiles = [...progress.remainingTiles].splice(0,1);
  const alreadyUsed = new Set<string>();
  otherRemainingTiles.forEach(otherTile => {
    const newSet = formSet(tile, otherTile);
    const string = stringifySingle(otherTile);
    if (newSet && !alreadyUsed.has(string) &&
        !progress.partialSets.find(partialSet =>
          partialSet.type === "tuple" &&
          sameTile(partialSet.tiles[0], tile)
        )) {
      alreadyUsed.add(string);

      const newPartialSets = [...progress.partialSets];
      newPartialSets.push(newSet);
      const newRemainingTiles = [...progress.remainingTiles];
      newRemainingTiles.splice(newRemainingTiles.indexOf(tile), 1);
      newRemainingTiles.splice(newRemainingTiles.indexOf(otherTile), 1);

      const newProgress = {
        partialSets: newPartialSets,
        remainingTiles: newRemainingTiles,
        uselessTiles: [...progress.uselessTiles]
      }

      candidates.push(newProgress);
    }
  })
  const newRemainingTiles = [...progress.remainingTiles];
  newRemainingTiles.splice(newRemainingTiles.indexOf(tile), 1);
  candidates.push({
    partialSets: [...progress.partialSets],
    remainingTiles: newRemainingTiles,
    uselessTiles: [...progress.uselessTiles]
  })
  return Math.min(...candidates.map(progress => shantenRecurse(progress)));
}
