# Solidity API

## ReturnFinanceUSDCVault

_EIP 4626 Compliant
This contract allows for deposits and withdrawals of USDC, and manages the allocation of USDC to different DeFi pools._

### poolWeight

```solidity
mapping(address => uint256) poolWeight
```

Represents the weight of each pool in the total allocation of USDC

### whitelist

```solidity
mapping(address => bool) whitelist
```

Represents the whitelist of addresses that can interact with this contract

### VAULT_NAME

```solidity
string VAULT_NAME
```

### VAULT_SYMBOL

```solidity
string VAULT_SYMBOL
```

### USDC

```solidity
address USDC
```

### WETH

```solidity
address WETH
```

### CRV

```solidity
address CRV
```

### CVX

```solidity
address CVX
```

### CNC

```solidity
address CNC
```

### AAVE_V3

```solidity
address AAVE_V3
```

### A_ETH_USDC

```solidity
address A_ETH_USDC
```

### C_USDC_V3

```solidity
address C_USDC_V3
```

### USDC_Y_VAULT

```solidity
address USDC_Y_VAULT
```

### CONIC_OMNI_POOL_USDC

```solidity
address CONIC_OMNI_POOL_USDC
```

### CONIC_REWARD_MANAGER

```solidity
address CONIC_REWARD_MANAGER
```

### CONIC_LP_TOKEN_STAKER

```solidity
address CONIC_LP_TOKEN_STAKER
```

### CNC_WETH_CURVE_POOL

```solidity
address CNC_WETH_CURVE_POOL
```

### CVX_WETH_CURVE_POOL

```solidity
address CVX_WETH_CURVE_POOL
```

### CRV_WETH_CURVE_POOL

```solidity
address CRV_WETH_CURVE_POOL
```

### UNISWAP_ROUTER_V3

```solidity
address UNISWAP_ROUTER_V3
```

### NotInWhitelist

```solidity
error NotInWhitelist(address wrongAddress)
```

_NotInWhitelist Error that is thrown when an address is not in the whitelist_

### UnableToSweep

```solidity
error UnableToSweep(address token)
```

_UnableToSweep Error that is thrown when an attempt to sweep fails_

### DepositFailed

```solidity
error DepositFailed(address depositor, uint256 amount)
```

_DepositFailed Error that is thrown when a deposit fails_

### WithdrawFailed

```solidity
error WithdrawFailed(address depositor, uint256 amount)
```

_WithdrawFailed Error that is thrown when a withdrawal fails_

### IncorrectWeights

```solidity
error IncorrectWeights(uint256 totalWeights)
```

_IncorrectWeights Error that is thrown when the total weights are not correct_

### HighSlippage

```solidity
error HighSlippage(uint256 minAmountOut, uint256 amountOut)
```

_HighSlippage Error that is thrown when the slippage is too high_

### PoolDonation

```solidity
event PoolDonation(address sender, uint256 value)
```

_Emitted when ether is sent to this contract (a "donation")_

### SweepFunds

```solidity
event SweepFunds(address token, uint256 amount, uint256 time)
```

_Emitted when the contract owner sweeps an ERC20 token_

### AddressWhitelisted

```solidity
event AddressWhitelisted(address whitelistedAddress, bool isWhitelisted, uint256 time)
```

_Emitted when an address is added/removed to the whitelist_

### WithdrawFromVault

```solidity
event WithdrawFromVault(address depositor, uint256 amount, uint256 time)
```

_Emitted when a user withdraws assets from the vault_

### DepositToVault

```solidity
event DepositToVault(address depositor, uint256 amount, bytes32 proof, uint256 time)
```

_Emitted when a user deposits assets to the vault_

### ReDepositToPools

```solidity
event ReDepositToPools(uint256 amount, uint256 time)
```

_Emitted when contract's USDC balance is re-depositted to the pools_

### HarvestConicRewards

```solidity
event HarvestConicRewards(uint256 cncAmount, uint256 crvAmount, uint256 cvxAmount, uint256 amountOut, uint256 time)
```

_Emitted when the contract harvests Conic rewards_

### RescueFunds

```solidity
event RescueFunds(uint256 totalAEthUSDC, uint256 totalCUSDCV3, uint256 totalUSDCYVault, uint256 totalConicLpAmount, uint256 time)
```

_Emitted when funds are rescued and withdrawn from pools_

### PoolWeightsUpdated

```solidity
event PoolWeightsUpdated(uint256 aavePoolWeight, uint256 compoundPoolWeight, uint256 yearnPoolWeight, uint256 conicPoolWeight, uint256 time)
```

_Emitted when the contract updates pool weights and rebalances_

### onlyWhitelist

```solidity
modifier onlyWhitelist()
```

Modifier that allows only whitelisted addresses to interact with the contract

### harvestRewards

```solidity
modifier harvestRewards(uint256 minAmountOut)
```

Modifier that harvests Conic rewards and swaps them for the underlying asset

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minAmountOut | uint256 | The minimum amount to be received from the swap |

### constructor

```solidity
constructor(uint256 _aavePoolWeightBps, uint256 _compoundPoolWeightBps, uint256 _yearnPoolWeightBps, uint256 _conicPoolWeightBps) public
```

Constructor for the ReturnFinanceUSDCVault contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _aavePoolWeightBps | uint256 | The weight for the AAVE pool |
| _compoundPoolWeightBps | uint256 | The weight for the Compound pool |
| _yearnPoolWeightBps | uint256 | The weight for the Yearn pool |
| _conicPoolWeightBps | uint256 | The weight for the Conic pool |

### receive

```solidity
receive() external payable
```

Function to receive ether, which emits a donation event

### deposit

```solidity
function deposit(uint256 amount, address receiver, bytes32 proof, uint256 minAmountLpConic, uint256 minAmountHarvest) external returns (uint256 shares)
```

Deposit funds into the vault

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | The amount to deposit |
| receiver | address | The address that will receive the shares |
| proof | bytes32 | A proof of the deposit transaction |
| minAmountLpConic | uint256 | The minimum amount to be deposited into the Conic pool |
| minAmountHarvest | uint256 | The minimum amount of USDC to be received after a swap |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares issued to the receiver |

### withdraw

```solidity
function withdraw(uint256 shares, address receiver, address owner, uint256 minAmountOut, uint256 minAmountHarvest) external returns (uint256 amountOut)
```

Redeem shares for underlying assets

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares to redeem |
| receiver | address | The address that will receive the assets |
| owner | address | The address of the owner of the shares |
| minAmountOut | uint256 |  |
| minAmountHarvest | uint256 | The minimum amount of USDC to be received after a swap |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The amount of underlying assets received |

### updatePoolWeightsAndRebalance

```solidity
function updatePoolWeightsAndRebalance(uint256 newAavePoolWeightBps, uint256 newCompoundPoolWeightBps, uint256 newYearnPoolWeightBps, uint256 newConicPoolWeightBps, uint256 minAmountLpConic) external
```

Update the weights of pools and rebalance the funds accordingly

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newAavePoolWeightBps | uint256 | The new weight for AAVE pool |
| newCompoundPoolWeightBps | uint256 | The new weight for Compound pool |
| newYearnPoolWeightBps | uint256 | The new weight for Yearn pool |
| newConicPoolWeightBps | uint256 | The new weight for Conic pool |
| minAmountLpConic | uint256 | The minimum amount to deposit in the Conic pool |

### sweepFunds

```solidity
function sweepFunds(address token) external
```

Send all tokens or ETH held by the contract to the owner

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | The token to sweep, or 0 for ETH |

### toggleWhitelist

```solidity
function toggleWhitelist(address updatedAddress, bool isWhitelisted) external
```

Allow or disallow an address to interact with the contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| updatedAddress | address | The address to change the whitelist status for |
| isWhitelisted | bool | Whether the address should be whitelisted |

### pause

```solidity
function pause() external
```

Pause the contract, preventing non-owner interactions

### unpause

```solidity
function unpause() external
```

Unpause the contract, allowing non-owner interactions

### deposit

```solidity
function deposit(uint256 amount, address receiver) public returns (uint256 shares)
```

Deposit funds and mint shares

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | The amount of funds to deposit |
| receiver | address | The address to receive the shares |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares minted |

### withdraw

```solidity
function withdraw(uint256 amount, address receiver, address owner) public returns (uint256 shares)
```

Withdraw funds and burn shares

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | The amount of funds to withdraw |
| receiver | address | The address to receive the funds |
| owner | address | The owner of the shares to burn |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares burned |

### redeem

```solidity
function redeem(uint256 shares, address receiver, address owner) public returns (uint256 assets)
```

This is an empty override, please use withdraw

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares to redeem |
| receiver | address | The address to receive the assets |
| owner | address | The owner of the shares |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| assets | uint256 | The amount of assets received |

### mint

```solidity
function mint(uint256 shares, address receiver) public returns (uint256 assets)
```

This is an empty override, please use deposit

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| shares | uint256 | The number of shares to mint |
| receiver | address | The address to receive the shares |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| assets | uint256 | The amount of assets that the shares represent |

### harvestConicRewardsAndSwapForUnderlying

```solidity
function harvestConicRewardsAndSwapForUnderlying(uint256 minAmountOut) public returns (uint256 amountOut)
```

Claim and swap Conic rewards for underlying asset

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minAmountOut | uint256 | The minimum amount expected to receive from the swap |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The actual amount received from the swap |

### rescueFunds

```solidity
function rescueFunds(address destination) public
```

Rescue any locked funds from the pools

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| destination | address | The address where the funds should be sent |

### reDepositUnderlyingIntoPools

```solidity
function reDepositUnderlyingIntoPools(uint256 minAmountLpConic) external
```

Re-deposit underlying USDC assets sitting in the contract to the pools
Helper function to use if there is any USDC lying around in the pool

### totalAssets

```solidity
function totalAssets() public view returns (uint256)
```

Calculate total assets of the contract. This does not take into account claimable rewards of CNC, CVX and CRV

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Total assets in the form of uint256 |

### getAaveEthUSDCBalance

```solidity
function getAaveEthUSDCBalance() public view returns (uint256)
```

Get the balance of Aave ETH-USDC held by the contract

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Aave ETH-USDC balance in the form of uint256 |

### getCompoundUSDCV3Balance

```solidity
function getCompoundUSDCV3Balance() public view returns (uint256)
```

Get the balance of Compound USDC V3 held by the contract

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Compound USDC V3 balance in the form of uint256 |

### getYVUSDCBalance

```solidity
function getYVUSDCBalance() public view returns (uint256)
```

Get the balance of Yearn Finance USDC Vault tokens held by the contract

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Yearn Finance USDC Vault balance in the form of uint256 |

### getConicLpTokenBalance

```solidity
function getConicLpTokenBalance() public view returns (uint256)
```

Get the balance of Conic LP tokens for a specific pool held by the contract

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Conic LP token balance in the form of uint256 |

### getUSDCBalance

```solidity
function getUSDCBalance() public view returns (uint256)
```

Get the balance of USDC held by the contract

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | USDC balance in the form of uint256 |

### getClaimableRewardsFromConic

```solidity
function getClaimableRewardsFromConic() public view returns (uint256, uint256, uint256)
```

Get the calimable Rewards from Conic since latest harvest

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The CNC, CRV and CVX amounts |
| [1] | uint256 |  |
| [2] | uint256 |  |

### _depositToPools

```solidity
function _depositToPools(uint256 amount, uint256 minAmountLpConic) internal
```

Deposit the specified amount into each pool, relative to its weight

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | The total amount to deposit |
| minAmountLpConic | uint256 | The minimum amount to deposit in the Conic pool |

### _withdrawFromPools

```solidity
function _withdrawFromPools(uint256 amount) internal
```

Withdraw the specified amount from each pool, relative to its weight

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | The total amount to withdraw |

### _swapRewardTokenForWeth

```solidity
function _swapRewardTokenForWeth(address pool, address token, uint256 amount) internal
```

Swap a reward token for WETH

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| pool | address | The Curve pool address to be used for the swap |
| token | address | The address of the token to be swapped |
| amount | uint256 | The amount of tokens to be swapped |

### _swapWethForUnderlying

```solidity
function _swapWethForUnderlying(address token, uint256 amountIn) internal returns (uint256 amountOut)
```

Swap WETH for the underlying token (USDC)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | The address of the token to be received |
| amountIn | uint256 | The amount of WETH to be swapped |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The amount of tokens received from the swap |

## IAaveV3Pool

### supply

```solidity
function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external
```

### withdraw

```solidity
function withdraw(address asset, uint256 amount, address to) external
```

## ICompoundUSDCV3

### allow

```solidity
function allow(address who, bool status) external
```

### supply

```solidity
function supply(address asset, uint256 amount) external
```

### withdraw

```solidity
function withdraw(address asset, uint256 amount) external
```

### withdrawTo

```solidity
function withdrawTo(address to, address asset, uint256 amount) external
```

## IConicLpTokenStaker

### getUserBalanceForPool

```solidity
function getUserBalanceForPool(address conicPool, address account) external view returns (uint256)
```

## IConicOmniPool

### depositFor

```solidity
function depositFor(address _account, uint256 _amount, uint256 _minLpReceived, bool stake) external returns (uint256)
```

### unstakeAndWithdraw

```solidity
function unstakeAndWithdraw(uint256 _conicLpAmount, uint256 _minUnderlyingReceived) external returns (uint256)
```

### exchangeRate

```solidity
function exchangeRate() external view returns (uint256)
```

## IConicRewardManager

### claimEarnings

```solidity
function claimEarnings() external returns (uint256, uint256, uint256)
```

### claimableRewards

```solidity
function claimableRewards(address account) external view returns (uint256, uint256, uint256)
```

## ICurvePoolV2

### token

```solidity
function token() external view returns (address)
```

### coins

```solidity
function coins(uint256 i) external view returns (address)
```

### factory

```solidity
function factory() external view returns (address)
```

### exchange

```solidity
function exchange(uint256 i, uint256 j, uint256 dx, uint256 min_dy, bool use_eth, address receiver) external
```

### exchange_underlying

```solidity
function exchange_underlying(uint256 i, uint256 j, uint256 dx, uint256 min_dy, address receiver) external returns (uint256)
```

### add_liquidity

```solidity
function add_liquidity(uint256[2] amounts, uint256 min_mint_amount, bool use_eth, address receiver) external returns (uint256)
```

### add_liquidity

```solidity
function add_liquidity(uint256[2] amounts, uint256 min_mint_amount) external returns (uint256)
```

### add_liquidity

```solidity
function add_liquidity(uint256[3] amounts, uint256 min_mint_amount, bool use_eth, address receiver) external returns (uint256)
```

### add_liquidity

```solidity
function add_liquidity(uint256[3] amounts, uint256 min_mint_amount) external returns (uint256)
```

### remove_liquidity

```solidity
function remove_liquidity(uint256 _amount, uint256[2] min_amounts, bool use_eth, address receiver) external
```

### remove_liquidity

```solidity
function remove_liquidity(uint256 _amount, uint256[2] min_amounts) external
```

### remove_liquidity

```solidity
function remove_liquidity(uint256 _amount, uint256[3] min_amounts, bool use_eth, address receiver) external
```

### remove_liquidity

```solidity
function remove_liquidity(uint256 _amount, uint256[3] min_amounts) external
```

### remove_liquidity_one_coin

```solidity
function remove_liquidity_one_coin(uint256 token_amount, uint256 i, uint256 min_amount, bool use_eth, address receiver) external returns (uint256)
```

### get_dy

```solidity
function get_dy(uint256 i, uint256 j, uint256 dx) external view returns (uint256)
```

### calc_token_amount

```solidity
function calc_token_amount(uint256[] amounts) external view returns (uint256)
```

### calc_withdraw_one_coin

```solidity
function calc_withdraw_one_coin(uint256 token_amount, uint256 i) external view returns (uint256)
```

### get_virtual_price

```solidity
function get_virtual_price() external view returns (uint256)
```

## ISwapRouter

### ExactInputSingleParams

```solidity
struct ExactInputSingleParams {
  address tokenIn;
  address tokenOut;
  uint24 fee;
  address recipient;
  uint256 deadline;
  uint256 amountIn;
  uint256 amountOutMinimum;
  uint160 sqrtPriceLimitX96;
}
```

### exactInputSingle

```solidity
function exactInputSingle(struct ISwapRouter.ExactInputSingleParams params) external payable returns (uint256 amountOut)
```

Swaps amountIn of one token for as much as possible of another token

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| params | struct ISwapRouter.ExactInputSingleParams | The parameters necessary for the swap, encoded as ExactInputSingleParams in calldata |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The amount of the received token |

### ExactInputParams

```solidity
struct ExactInputParams {
  bytes path;
  address recipient;
  uint256 deadline;
  uint256 amountIn;
  uint256 amountOutMinimum;
}
```

### exactInput

```solidity
function exactInput(struct ISwapRouter.ExactInputParams params) external payable returns (uint256 amountOut)
```

Swaps amountIn of one token for as much as possible of another along the specified path

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| params | struct ISwapRouter.ExactInputParams | The parameters necessary for the multi-hop swap, encoded as ExactInputParams in calldata |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The amount of the received token |

## IYearnVault

### deposit

```solidity
function deposit(uint256 _amount) external
```

### withdraw

```solidity
function withdraw(uint256 maxShares) external
```

### withdraw

```solidity
function withdraw(uint256 maxShares, address recipient) external
```

### pricePerShare

```solidity
function pricePerShare() external view returns (uint256)
```

### decimals

```solidity
function decimals() external view returns (uint256)
```

## MockUSDC

### constructor

```solidity
constructor() public
```

