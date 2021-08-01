"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riipai = exports.shanten = exports.fitsInSet = exports.formSet = exports.stringifyProgress = void 0;
const pai_1 = require("./pai");
const parse_1 = require("./parse");
function stringifyProgress({ partialSets, remaining, useless }) {
    const sets = partialSets.map(s => parse_1.stringify(s.tiles));
    const remainingStr = remaining.length > 0 ? `/ Remaining: ${parse_1.stringify(remaining)} ` : '';
    const uselessStr = parse_1.stringify(useless);
    return `Sets: ${sets.toString()} / Useless: ${uselessStr} ${remainingStr}/ Shanten = ${useless.length}`;
}
exports.stringifyProgress = stringifyProgress;
function formSet(tile1, tile2) {
    if (pai_1.sameValue(tile1, tile2)) {
        return { tiles: [tile1, tile2], type: "tuple" };
    }
    else if (pai_1.isShupai(tile1) && pai_1.isShupai(tile2) &&
        (pai_1.shupaiType(tile1) === pai_1.shupaiType(tile2)) &&
        (Math.abs(pai_1.shupaiValue(tile1) - pai_1.shupaiValue(tile2)) <= 2)) {
        return { tiles: [tile1, tile2], type: "run" };
    }
    else {
        return null;
    }
}
exports.formSet = formSet;
function fitsInSet(tile, partialSet) {
    if (partialSet.tiles.length > 2) {
        return false;
    }
    else if (partialSet.type === "tuple") {
        return pai_1.sameValue(tile, partialSet.tiles[0]);
    }
    else {
        if (pai_1.isShupai(tile) && pai_1.shupaiType(tile) === pai_1.shupaiType(partialSet.tiles[0])) {
            const allTileValues = partialSet.tiles.concat(tile).map(tile => pai_1.shupaiValue(tile));
            const set = new Set(allTileValues);
            const range = Math.max(...allTileValues) - Math.min(...allTileValues);
            return [...set].length == allTileValues.length && range <= 2;
        }
        else {
            return false;
        }
    }
}
exports.fitsInSet = fitsInSet;
function shanten(tiles) {
    return riipai(tiles)[0].useless.length;
}
exports.shanten = shanten;
function removeAndCopy(array, ...elements) {
    const copiedArray = [...array];
    elements.forEach(element => copiedArray.splice(copiedArray.indexOf(element), 1));
    return copiedArray;
}
function riipai(input) {
    const progress = Array.isArray(input) ?
        {
            partialSets: [],
            remaining: input,
            useless: []
        } :
        input;
    // base case
    if (progress.remaining.length === 0) {
        return [progress];
    }
    const roomForMoreRunsAndTriples = progress.partialSets.filter(set => (set.type == "run" || set.tiles.length == 3)).length < 4;
    // try adding first tile to existing sets
    const tile = progress.remaining[0];
    let tileHasAFriend = false;
    const candidates = [];
    progress.partialSets.forEach(partialSet => {
        // The complex check below is to disallow e.g. adding 2m to 13m,
        // to prevent double-counting (since 12m + 3m happens earlier)
        if (fitsInSet(tile, partialSet) &&
            ((partialSet.type == 'tuple' && ((partialSet.tiles.length == 1) || roomForMoreRunsAndTriples)) ||
                (pai_1.isShupai(partialSet.tiles[0]) && Math.max(...partialSet.tiles.map(t => pai_1.shupaiValue(t))) < pai_1.shupaiValue(tile)))) {
            tileHasAFriend = true;
            const newPartialSet = {
                tiles: partialSet.tiles.concat([tile]),
                type: partialSet.type
            };
            candidates.push({
                partialSets: removeAndCopy(progress.partialSets, partialSet)
                    .concat([newPartialSet]),
                remaining: removeAndCopy(progress.remaining, tile),
                useless: [...progress.useless],
            });
        }
    });
    // try making a new set. only make a run if tuple doesn't exist, to prevent
    // duplication.
    if ((progress.partialSets.length < 5) &&
        (progress.partialSets.filter(set => set.type == "tuple" && pai_1.sameValue(tile, set.tiles[0])).length == 0)) {
        if (pai_1.isShupai(tile)) {
            if (roomForMoreRunsAndTriples) {
                candidates.push({
                    partialSets: progress.partialSets.concat([{ tiles: [tile], type: "run" }]),
                    remaining: removeAndCopy(progress.remaining, tile),
                    useless: [...progress.useless],
                });
            }
        }
        candidates.push({
            partialSets: progress.partialSets.concat([{ tiles: [tile], type: "tuple" }]),
            remaining: removeAndCopy(progress.remaining, tile),
            useless: [...progress.useless],
        });
    }
    // if tile can't combine with anything, give up on using it
    if (!tileHasAFriend) {
        const index = progress.remaining.indexOf(tile);
        const matches = progress.remaining.filter(t => pai_1.sameValue(t, tile));
        const newRemaining = [...progress.remaining];
        newRemaining.splice(index, matches.length);
        candidates.push({
            partialSets: [...progress.partialSets],
            remaining: newRemaining,
            useless: progress.useless.concat(matches),
        });
    }
    const results = candidates.map(progress => riipai(progress));
    const flattened = results[0].concat(...results.slice(1));
    const minimum = Math.min(...flattened.map(progress => progress.useless.length));
    return flattened.filter(prog => prog.useless.length === minimum);
}
exports.riipai = riipai;
