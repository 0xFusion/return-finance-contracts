# Return Finance USDC Vault

## Overview

`ReturnFinanceUSDCVault` uses the ERC-4626 Vault Standard, utlizing Aave V3, Compound, Yearn and Conic Finance protocols on Ethereum mainnet.

### ERC4626 Tokenised Vault Standard Usage

The contract leverages the ERC4626 Tokenised Vault Standard.

### Asset Allocation Across Multiple Pools

The assets under management are divided among four distinct pools, each with a specific weightage: Aave, Compound, Yearn, and Conic.

### Challenges and Solutions in Total Asset Calculation

The `totalAssets()` function presents the most considerable computational challenge, since the USDC assets aren't actually stored within the vault but are instead placed in various pools. To calculate `totalAssets()`, factoring in the accumulated yield, we must acquire the USDC equivalent of all LP tokens.

Additionally, rewards from CNC, CVX, and CRV claims contribute to the total. However, there is no efficient method for calculating their USDC equivalent. Consequently, our strategy involves claiming and swapping the earned rewards before every deposit or withdrawal. This ensures `totalAssets()` provides a precise value just before any transaction, thus guaranteeing the user receives the accurate amotount of LP tokens.

### Swap Process Involving Curve Pools

The swap process involves the use of Curve pools for WETH, which is subsequently swapped for USDC. This method is chosen over alternatives such as 1Inch, as the most liquid pools reside on Curve, and 1Inch lacks Curve integration.

### Installation

```console
$ yarn
```

### Compile

```console
$ yarn compile
```

This task will compile all smart contracts in the `contracts` directory.
ABI files will be automatically exported in `artifacts` directory.

### Testing

```console
$ yarn test
```

### Code coverage

```console
$ yarn coverage
```

The report will be printed in the console and a static website containing full report will be generated in `coverage` directory.

### Code style

```console
$ yarn prettier
```

### Verify & Publish contract source code

```console
$ npx hardhat  verify --network mainnet $CONTRACT_ADDRESS $CONSTRUCTOR_ARGUMENTS
```
