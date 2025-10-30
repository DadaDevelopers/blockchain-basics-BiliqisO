# Bitcoin Block and Merkle Tree Assignment

## Student Submission

This assignment explores Bitcoin's block structure and demonstrates how Merkle trees efficiently represent transaction data.

---

## Task 1: Block Inspection

### Selected Block: #921500

I used **blockchain.info** to inspect Bitcoin block #921500. This block was chosen as a recent example to demonstrate current Bitcoin network activity.

### Block Details

| Property | Value |
|----------|-------|
| **Block Height** | 921500 |
| **Block Hash** | `0000000000000000000164efcd1383f2f1a1b96e5702545dbdd0a7598183c097` |
| **Previous Block Hash** | `0000000000000000000003ae47311d848bb6544af90a4b812dd0e0b382390dc0` |
| **Merkle Root** | `bb89907babd1051c89aeac9583f3cbe7449b24090005897b5537b970b1ed16d1` |
| **Number of Transactions** | 5,406 |
| **Timestamp** | 1761849697 (Dec 30, 2025, 01:34:57 UTC) |

### Key Observations

1. **Proof-of-Work Evidence**: The block hash starts with 19 leading zeros, demonstrating the computational work required by miners to find a valid hash below the target difficulty.

2. **Immutable Chain**: The Previous Block Hash links this block to #921499, creating an unbreakable chain. Any modification to a previous block would invalidate all subsequent blocks.

3. **Merkle Root Efficiency**: A single 256-bit hash (`bb89907...`) represents all 5,406 transactions in this block.

**Full details:** See [block-inspection.md](block-inspection.md)

**Explorer link:** https://blockchain.info/block/0000000000000000000164efcd1383f2f1a1b96e5702545dbdd0a7598183c097

---

## Task 2: Merkle Tree Visualization

### Approach

I constructed a Merkle tree using **4 real transaction hashes** from block #921500 to demonstrate the hashing process.

### Transaction Hashes Used

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
```

### Calculation Process

**Level 0 - Leaf Pairs:**

1. **Hash(AB)** = SHA256(SHA256(TxA || TxB))
   - Result: `b1ee507e0717600ebe381f4709e419c9a879eba854770738a2dbad8d073306b2`

2. **Hash(CD)** = SHA256(SHA256(TxC || TxD))
   - Result: `767ad613ff5ac13cecaddf079e16709908bb5f511890379f36e39d870db9a078`

**Level 1 - Root:**

3. **Merkle Root** = SHA256(SHA256(Hash(AB) || Hash(CD)))
   - Result: `8cfdbc22c5ec84d6ad3790da9af57522a47785aad7c853367b308575adcb3607`

### Important Notes

- Bitcoin uses **double SHA-256** hashing for all operations
- Hashes are stored in **little-endian** byte order internally
- This example uses only 4 transactions; the actual block #921500 has 5,406 transactions
- The real Merkle root for the full block is: `bb89907babd1051c89aeac9583f3cbe7449b24090005897b5537b970b1ed16d1`

**Full explanation:** See [merkle-tree-explanation.md](merkle-tree-explanation.md)

---

## Code Implementation

I implemented a Merkle tree calculator in **JavaScript** that:
- Calculates the Merkle root from transaction hashes
- Visualizes the tree structure
- Shows step-by-step hash calculations
- Uses Bitcoin's double SHA-256 and byte order conventions

### Running the Code

```bash
cd assignment-submission/code
node merkle_tree.js
```

**Source code:** See [code/merkle_tree.js](code/merkle_tree.js)

---

## What I Learned

### 1. Block Structure
- Blocks are linked through cryptographic hashes
- The previous block hash creates an immutable chain
- Proof-of-Work requires finding hashes with leading zeros

### 2. Merkle Trees
- Efficiently represent thousands of transactions with a single hash
- Enable lightweight clients to verify transactions (SPV)
- Provide logarithmic proof of inclusion (log₂n)
- Changing any transaction invalidates the Merkle root

### 3. Practical Applications
- Mobile wallets use Merkle proofs to verify payments without downloading the entire blockchain
- For 5,406 transactions, only ~13 hashes are needed to prove a transaction exists
- This makes Bitcoin practical for resource-constrained devices

---

## File Structure

```
assignment-submission/
├── README.md                      # This file - main report
├── block-inspection.md            # Task 1 - detailed block analysis
├── merkle-tree-explanation.md     # Task 2 - detailed Merkle tree explanation
└── code/
    └── merkle_tree.js            # JavaScript implementation
```

---

## Resources Used

- **Blockchain Explorer:** https://blockchain.info
- **Block #921500:** https://blockchain.info/block/0000000000000000000164efcd1383f2f1a1b96e5702545dbdd0a7598183c097
- **Bitcoin Developer Guide:** https://developer.bitcoin.org/devguide/block_chain.html
- **Node.js crypto module:** For SHA-256 hashing

---

**Submitted by:** Biliqis Onikoyi
**Date:** October 30, 2025
