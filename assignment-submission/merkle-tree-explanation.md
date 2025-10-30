# Merkle Tree Visualization and Explanation

## Overview
This document explains how Bitcoin uses Merkle trees to efficiently represent all transactions in a block with a single hash value (the Merkle root).

## What is a Merkle Tree?

A Merkle tree is a binary tree where:
- **Leaf nodes** contain hashes of individual transactions
- **Internal nodes** contain hashes of their children concatenated together
- **Root node** (Merkle root) represents the entire tree with a single hash

## Example: 4 Transactions from Block #921500

### Transaction Hashes (Leaf Level)

```
TxA: b6d1d1ed7d2608ef67e7f8b40731bc5b8b60791cef0f11c7838f28d9ceccdb3e
TxB: 25ea15e5006d5a5dc0fded8366d5a9737798f00013dd806bfef5e1c53b4ea6ce
TxC: 0781d3b667230eb3b39cf4fa19467fb3794ef86145790585456632f761368833
TxD: b2213ad46af2212709c3c8b53bae8e658315c00e080181db68ce54d749caa9de
```

### Tree Structure

```
                         MERKLE ROOT
                 8cfdbc22c5ec84d6ad3790da9af57522a47785aad7c853367b308575adcb3607
                             |
              +--------------+--------------+
              |                             |
          Hash(AB)                      Hash(CD)
    b1ee507e0717600ebe381f4709e419c9...      767ad613ff5ac13cecaddf079e167099...
              |                             |
         +----+----+                   +----+----+
         |         |                   |         |
       TxA       TxB                 TxC       TxD
    b6d1d1ed...  25ea15e5...         0781d3b6...  b2213ad4...
```

## Step-by-Step Calculation

### Level 0: Pair Leaf Nodes

**Pair 1: Hash(AB)**
- Left: TxA = `b6d1d1ed7d2608ef67e7f8b40731bc5b8b60791cef0f11c7838f28d9ceccdb3e`
- Right: TxB = `25ea15e5006d5a5dc0fded8366d5a9737798f00013dd806bfef5e1c53b4ea6ce`
- Process: Concatenate TxA + TxB, then apply double SHA-256
- Result: `b1ee507e0717600ebe381f4709e419c9a879eba854770738a2dbad8d073306b2`

**Pair 2: Hash(CD)**
- Left: TxC = `0781d3b667230eb3b39cf4fa19467fb3794ef86145790585456632f761368833`
- Right: TxD = `b2213ad46af2212709c3c8b53bae8e658315c00e080181db68ce54d749caa9de`
- Process: Concatenate TxC + TxD, then apply double SHA-256
- Result: `767ad613ff5ac13cecaddf079e16709908bb5f511890379f36e39d870db9a078`

### Level 1: Combine to Root

**Merkle Root**
- Left: Hash(AB) = `b1ee507e0717600ebe381f4709e419c9a879eba854770738a2dbad8d073306b2`
- Right: Hash(CD) = `767ad613ff5ac13cecaddf079e16709908bb5f511890379f36e39d870db9a078`
- Process: Concatenate Hash(AB) + Hash(CD), then apply double SHA-256
- **Final Merkle Root**: `8cfdbc22c5ec84d6ad3790da9af57522a47785aad7c853367b308575adcb3607`

## Key Concepts

### 1. Double SHA-256 Hashing
Bitcoin uses double SHA-256 for all hashing operations:
```javascript
hash = SHA256(SHA256(data))
```

### 2. Little-Endian Byte Order
Bitcoin internally uses little-endian byte order, so transaction hashes are reversed before concatenation.

### 3. Handling Odd Numbers
If there's an odd number of nodes at any level, the last node is duplicated to create a pair.

### 4. Efficiency
With a Merkle tree:
- You can prove a transaction is in a block with only `log2(n)` hashes
- For 5,406 transactions (like block #921500), you only need ~13 hashes to prove inclusion
- Without Merkle trees, you'd need all 5,406 transaction hashes

## Why Merkle Trees Matter

1. **Efficiency**: Lightweight clients can verify transactions without downloading the entire blockchain
2. **Integrity**: Changing any transaction changes the Merkle root, making tampering evident
3. **Proof of Inclusion**: Can prove a transaction exists in a block with minimal data
4. **SPV (Simplified Payment Verification)**: Mobile wallets use Merkle proofs to verify payments

## Note on This Example

This demonstration uses only 4 transactions from block #921500. The actual block contains **5,406 transactions**, resulting in a different Merkle root:

**Actual Merkle Root for Block #921500:**
```
bb89907babd1051c89aeac9583f3cbe7449b24090005897b5537b970b1ed16d1
```

## Running the Code

To calculate the Merkle root yourself:

```bash
cd assignment-submission/code
node merkle_tree.js
```

This will show the complete tree visualization and step-by-step hash calculations.
