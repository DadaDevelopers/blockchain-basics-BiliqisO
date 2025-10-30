#!/usr/bin/env node
/**
 * Merkle Tree Calculator for Bitcoin Transactions
 * This script demonstrates how Bitcoin calculates the Merkle root from transaction hashes.
 */

const crypto = require('crypto');

/**
 * Perform double SHA-256 hash (as used in Bitcoin)
 * @param {Buffer} data - Data to hash
 * @returns {Buffer} The double SHA-256 hash
 */
function hash256(data) {
    const hash1 = crypto.createHash('sha256').update(data).digest();
    const hash2 = crypto.createHash('sha256').update(hash1).digest();
    return hash2;
}

/**
 * Reverse bytes in a buffer (Bitcoin uses little-endian)
 * @param {Buffer} buffer - Buffer to reverse
 * @returns {Buffer} Reversed buffer
 */
function reverseBuffer(buffer) {
    const reversed = Buffer.from(buffer);
    reversed.reverse();
    return reversed;
}

/**
 * Calculate the Merkle root from a list of transaction hashes
 * @param {string[]} txHashes - Array of transaction hashes (as hex strings)
 * @returns {string} The Merkle root as a hex string
 */
function calculateMerkleRoot(txHashes) {
    // Convert hex strings to buffers (reverse for Bitcoin's little-endian format)
    let currentLevel = txHashes.map(tx => reverseBuffer(Buffer.from(tx, 'hex')));

    console.log(`Starting with ${currentLevel.length} transaction hashes\n`);

    let levelNum = 0;
    while (currentLevel.length > 1) {
        console.log(`Level ${levelNum}:`);
        console.log('-'.repeat(80));

        const nextLevel = [];

        // Process pairs of hashes
        for (let i = 0; i < currentLevel.length; i += 2) {
            const left = currentLevel[i];

            // If odd number of elements, duplicate the last one
            const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : currentLevel[i];

            // Concatenate and hash
            const combined = Buffer.concat([left, right]);
            const parentHash = hash256(combined);
            nextLevel.push(parentHash);

            console.log(`  Pair ${Math.floor(i / 2) + 1}:`);
            console.log(`    Left:   ${reverseBuffer(left).toString('hex')}`);
            console.log(`    Right:  ${reverseBuffer(right).toString('hex')}`);
            console.log(`    Parent: ${reverseBuffer(parentHash).toString('hex')}`);
            console.log();
        }

        currentLevel = nextLevel;
        levelNum++;
    }

    // Return the root (reverse back to big-endian for display)
    return reverseBuffer(currentLevel[0]).toString('hex');
}

/**
 * Create an ASCII visualization of the Merkle tree
 * @param {string[]} txHashes - Array of 4 transaction hashes
 */
function visualizeMerkleTree(txHashes) {
    console.log('\n' + '='.repeat(80));
    console.log('MERKLE TREE VISUALIZATION');
    console.log('='.repeat(80) + '\n');

    // Calculate intermediate hashes
    const txBuffers = txHashes.map(tx => reverseBuffer(Buffer.from(tx, 'hex')));
    const [tx1, tx2, tx3, tx4] = txBuffers;

    // Level 1: Combine pairs
    const hashAB = hash256(Buffer.concat([tx1, tx2]));
    const hashCD = hash256(Buffer.concat([tx3, tx4]));

    // Level 2: Combine to get root
    const merkleRoot = hash256(Buffer.concat([hashAB, hashCD]));

    // Display tree
    const rootDisplay = reverseBuffer(merkleRoot).toString('hex');
    const abDisplay = reverseBuffer(hashAB).toString('hex');
    const cdDisplay = reverseBuffer(hashCD).toString('hex');

    console.log('                         MERKLE ROOT');
    console.log(`                 ${rootDisplay}`);
    console.log('                             |');
    console.log('              +--------------+--------------+');
    console.log('              |                             |');
    console.log('          Hash(AB)                      Hash(CD)');
    console.log(`    ${abDisplay.substring(0, 32)}...`);
    console.log(`                                 ${cdDisplay.substring(0, 32)}...`);
    console.log('              |                             |');
    console.log('         +----+----+                   +----+----+');
    console.log('         |         |                   |         |');
    console.log('       TxA       TxB                 TxC       TxD');
    console.log(`    ${txHashes[0].substring(0, 16)}...  ${txHashes[1].substring(0, 16)}...  ${txHashes[2].substring(0, 16)}...  ${txHashes[3].substring(0, 16)}...`);
    console.log('\n' + '='.repeat(80) + '\n');
}

function main() {
    // Real transaction hashes from Bitcoin block #921500
    const transactionHashes = [
        'b6d1d1ed7d2608ef67e7f8b40731bc5b8b60791cef0f11c7838f28d9ceccdb3e',  // TxA
        '25ea15e5006d5a5dc0fded8366d5a9737798f00013dd806bfef5e1c53b4ea6ce',  // TxB
        '0781d3b667230eb3b39cf4fa19467fb3794ef86145790585456632f761368833',  // TxC
        'b2213ad46af2212709c3c8b53bae8e658315c00e080181db68ce54d749caa9de',  // TxD
    ];

    console.log('BITCOIN MERKLE TREE CALCULATOR');
    console.log('='.repeat(80));
    console.log('\nUsing 4 real transaction hashes from Bitcoin block #921500\n');

    transactionHashes.forEach((txHash, i) => {
        console.log(`Transaction ${i + 1}: ${txHash}`);
    });

    console.log('\n');

    // Visualize the tree structure
    visualizeMerkleTree(transactionHashes);

    // Calculate and show step-by-step process
    const merkleRoot = calculateMerkleRoot(transactionHashes);

    console.log('='.repeat(80));
    console.log(`FINAL MERKLE ROOT: ${merkleRoot}`);
    console.log('='.repeat(80));

    console.log('\nNote: This is the Merkle root for just these 4 transactions.');
    console.log('The actual block #921500 has 5,406 transactions, so the real Merkle root is:');
    console.log('bb89907babd1051c89aeac9583f3cbe7449b24090005897b5537b970b1ed16d1');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { hash256, calculateMerkleRoot, visualizeMerkleTree };
