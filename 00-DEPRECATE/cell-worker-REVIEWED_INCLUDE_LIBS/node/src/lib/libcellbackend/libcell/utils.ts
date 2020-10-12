/*

    Calculates minihashes

*/

import { sha256 } from "js-sha256";

export function getHash(seed: string): string {
    return sha256(seed);
}


export function getMiniHash(hash: string, hashes: string[]): string {

    // Check if hashes is null
    if (hashes === null) { return hash.substring(0, 1); }

    // Iterate from mini hash lengths 1 to full hash
    for (let l = 1 ; l < 64 ; l++) {

        let miniHash = hash.substring(0, l);

        // Check if subhash exists
        if (hashes.indexOf(miniHash) === -1) {
            return miniHash;
        }
    }

}



/*

    Gets type and ID from a Redis key

*/

export function decomposeKey(key: string): { type: string, id: string } {

    const split = key.split(":");

    if (split.length !== 2) {
        throw Error(`Bad Redis key ${key}`);
    } else {
        return { type: split[0], id: split[1] };
    }

}
