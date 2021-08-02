"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ukeire = exports.ukeireSingle = exports.generatePossibilities = exports.partialSetUkeire = exports.riipai = exports.shanten = exports.fitsInSet = exports.formSet = exports.stringifyProgress = void 0;
const pai_1 = require("./pai");
const parse_1 = require("./parse");
function stringifyProgress([{ partialSets, useless }, remaining]) {
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
    const progress = (typeof (input[0]) == 'string' ?
        [{
                partialSets: [],
                useless: []
            }, input] :
        input);
    const [{ partialSets, useless }, remaining] = progress;
    // base case
    if (remaining.length === 0) {
        return [{ partialSets, useless }];
    }
    const roomForMoreRunsAndTriples = partialSets.filter(set => (set.type == "run" || set.tiles.length == 3)).length < 4;
    // try adding first tile to existing sets
    const tile = remaining[0];
    let tileHasAFriend = false;
    const candidates = [];
    partialSets.forEach((partialSet, index) => {
        if (fitsInSet(tile, partialSet)) {
            let shouldPutInSet = false;
            if (partialSet.type == 'tuple') {
                // Don't turn a pair into a triple if there aren't any (potential) doubles left
                shouldPutInSet = ((partialSet.tiles.length == 1) || roomForMoreRunsAndTriples);
            }
            else if (Math.max(...partialSet.tiles.map(t => pai_1.shupaiValue(t))) < pai_1.shupaiValue(tile)) {
                // We only add a tile to a run if it's bigger than the other tiles in
                // it, to prevent double counting
                // We also only put a tile into a run if no other copies of it have been
                // put into tuples, to prevent double counting (again)
                const tilesInExistingTuples = partialSets.filter(p => p.type == "tuple")
                    .map(p => p.tiles).reduce((a, b) => a.concat(b), []);
                shouldPutInSet = (!tilesInExistingTuples.find(x => pai_1.sameValue(x, tile)));
            }
            if (shouldPutInSet) {
                tileHasAFriend = true;
                const newPartialSet = {
                    tiles: partialSet.tiles.concat([tile]),
                    type: partialSet.type
                };
                const newPartialSets = [...partialSets];
                newPartialSets[index] = newPartialSet;
                candidates.push([{
                        partialSets: newPartialSets,
                        useless: [...useless],
                    }, removeAndCopy(remaining, tile)]);
            }
        }
    });
    // try making a new set. only make a run if tuple doesn't exist, to prevent
    // duplication.
    if ((partialSets.length < 5) &&
        (partialSets.filter(set => set.type == "tuple" && pai_1.sameValue(tile, set.tiles[0])).length == 0)) {
        if (pai_1.isShupai(tile)) {
            if (roomForMoreRunsAndTriples) {
                candidates.push([{
                        partialSets: partialSets.concat([{ tiles: [tile], type: "run" }]),
                        useless: [...useless],
                    }, removeAndCopy(remaining, tile)]);
            }
        }
        candidates.push([{
                partialSets: partialSets.concat([{ tiles: [tile], type: "tuple" }]),
                useless: [...useless],
            }, removeAndCopy(remaining, tile)]);
    }
    // if tile can't combine with anything, give up on using it
    if (!tileHasAFriend) {
        const index = remaining.indexOf(tile);
        const matches = remaining.filter(t => pai_1.sameValue(t, tile));
        const newRemaining = [...remaining];
        newRemaining.splice(index, matches.length);
        candidates.push([{
                partialSets: [...partialSets],
                useless: useless.concat(matches),
            }, newRemaining]);
    }
    const results = candidates.map(progress => riipai(progress));
    const flattened = results[0].concat(...results.slice(1));
    const minimum = Math.min(...flattened.map(progress => progress.useless.length));
    return flattened.filter(prog => prog.useless.length === minimum);
}
exports.riipai = riipai;
function partialSetUkeire(partialSet, isPair = false) {
    if (partialSet.type === 'tuple') {
        const additionalNeeded = (isPair ? 2 : 3) - partialSet.tiles.length;
        return [Array(additionalNeeded).fill(pai_1.nonAkadoraCopy(partialSet.tiles[0]))];
    }
    else {
        if (isPair)
            throw new Error("A run can't be a pair");
        if (partialSet.tiles.length === 3) {
            return [[]];
        }
        else {
            const type = pai_1.shupaiType(partialSet.tiles[0]);
            if (partialSet.tiles.length === 1) {
                const value = pai_1.shupaiValue(partialSet.tiles[0]);
                const possibilities = [];
                if (value >= 3) {
                    possibilities.push([pai_1.shupai(type, value - 2), pai_1.shupai(type, value - 1)]);
                }
                if (value >= 2 && value <= 8) {
                    possibilities.push([pai_1.shupai(type, value - 1), pai_1.shupai(type, value + 1)]);
                }
                if (value <= 7) {
                    possibilities.push([pai_1.shupai(type, value + 1), pai_1.shupai(type, value + 2)]);
                }
                return possibilities;
            }
            else if (partialSet.tiles.length === 2) {
                const [min, max] = partialSet.tiles.map(pai_1.shupaiValue).sort();
                if (max - min == 2) {
                    const neededValue = min + 1;
                    return [[pai_1.shupai(type, neededValue)]];
                }
                else {
                    const possibilities = [];
                    if (min >= 2) {
                        possibilities.push([pai_1.shupai(type, min - 1)]);
                    }
                    if (max <= 8) {
                        possibilities.push([pai_1.shupai(type, max + 1)]);
                    }
                    return possibilities;
                }
            }
        }
    }
    return [[]]; // shouldn't ever get here
}
exports.partialSetUkeire = partialSetUkeire;
function generatePossibilities(possibilities, index = 0) {
    if (index >= possibilities.length) {
        return [[]];
    }
    else {
        const result = [];
        const simplerCase = generatePossibilities(possibilities, index + 1);
        possibilities[index].forEach(small => simplerCase.forEach(large => result.push(small.concat(large))));
        return result;
    }
}
exports.generatePossibilities = generatePossibilities;
function ukeireSingle(sets) {
    const possiblePairIndices = [];
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
    const possibleCompletions = potentialCompletions.filter(newTiles => pai_1.validate(allTiles.concat(newTiles)));
    if (possibleCompletions.length === 0) {
        return undefined;
    }
    else {
        return [...new Set(possibleCompletions.reduce((acc, val) => acc.concat(val), []))];
    }
}
exports.ukeireSingle = ukeireSingle;
function ukeire(input) {
    const riipais = typeof (input[0]) === "string" ? riipai(input) : input;
    const results = riipais.map(riipai => ukeireSingle(riipai.partialSets) || []);
    return [...new Set(results.reduce((acc, val) => acc.concat(val), []))].sort(parse_1.compare);
}
exports.ukeire = ukeire;
