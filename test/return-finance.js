const { expect } = require("chai");
const { waffle, ethers, upgrades, network } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");
const { loadFixture } = waffle;

const AAVE_POOL_WEIGHT_BPS = 2500;
const COMPOUND_POOL_WEIGHT_BPS = 2500;
const YEARN_POOL_WEIGHT_BPS = 2500;
const CONIC_POOL_WEIGHT_BPS = 2500;

const VAULT_NAME = "Return Finance USDC Vault";
const VAULT_SYMBOL = "rfUSDC";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const CONIC_OMNI_POOL_USDC = "0x07b577f10d4e00f3018542d08a87F255a49175A5";

// Some USDC Whale
const IMPERSONATED_SIGNER_ADDRESS =
  "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";

describe("Return Finance USDC Vault V1", () => {
  const deployedContracts = async () => {
    [deployer] = await ethers.getSigners();
    const ReturnFinanceUSDCVault = await hre.ethers.getContractFactory(
      "ReturnFinanceUSDCVault",
      deployer
    );
    const returnFinanceUSDCVault = await ReturnFinanceUSDCVault.deploy(
      AAVE_POOL_WEIGHT_BPS,
      COMPOUND_POOL_WEIGHT_BPS,
      YEARN_POOL_WEIGHT_BPS,
      CONIC_POOL_WEIGHT_BPS
    );

    await returnFinanceUSDCVault.deployed();

    await helpers.impersonateAccount(IMPERSONATED_SIGNER_ADDRESS);
    const impersonatedSigner = await ethers.getSigner(
      IMPERSONATED_SIGNER_ADDRESS
    );

    await returnFinanceUSDCVault.toggleWhitelist(
      impersonatedSigner.address,
      true
    );

    const usdcContract = await ethers.getContractAt("MockUSDC", USDC_ADDRESS);

    return {
      returnFinanceUSDCVault,
      impersonatedSigner,
      usdcContract,
      deployer,
    };
  };

  it("should successfully deploy Return Finance USDC Vault with correct configuration", async () => {
    const { returnFinanceUSDCVault } = await loadFixture(deployedContracts);

    const vaultName = await returnFinanceUSDCVault.name();
    const vaultSymbol = await returnFinanceUSDCVault.symbol();

    expect(vaultName).to.equal(VAULT_NAME);
    expect(vaultSymbol).to.equal(VAULT_SYMBOL);
  });

  it("should successfully execute a deposit transaction to the vault - only whitelisted", async () => {
    const {
      returnFinanceUSDCVault,
      impersonatedSigner,
      usdcContract,
      deployer,
    } = await loadFixture(deployedContracts);

    // Approve the Return Finance Contract to spend our USDC
    await usdcContract
      .connect(impersonatedSigner)
      .approve(returnFinanceUSDCVault.address, ethers.constants.MaxUint256);

    await expect(
      returnFinanceUSDCVault
        .connect(deployer)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.reverted;

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "DepositToVault");

    const totalAssets = await returnFinanceUSDCVault.totalAssets();

    const shareBalance = await returnFinanceUSDCVault.balanceOf(
      impersonatedSigner.address
    );

    expect(shareBalance).to.equal("20000000000");
  }).timeout(720000);

  it("should successfully execute a withdraw transaction from the vault", async () => {
    const { returnFinanceUSDCVault, impersonatedSigner, usdcContract } =
      await loadFixture(deployedContracts);

    // Approve the Return Finance Contract to spend our USDC
    await usdcContract
      .connect(impersonatedSigner)
      .approve(returnFinanceUSDCVault.address, ethers.constants.MaxUint256);

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "DepositToVault");

    const shareBalance = await returnFinanceUSDCVault.balanceOf(
      impersonatedSigner.address
    );

    expect(shareBalance).to.equal("20000000000");

    await helpers.mineUpTo(17336000);

    // Simulate txn via callStatic to get the minimum amount we can get
    const minAmountOut = await returnFinanceUSDCVault
      .connect(impersonatedSigner)
      .callStatic["withdraw(uint256,address,address,uint256,uint256)"](
        shareBalance,
        impersonatedSigner.address,
        impersonatedSigner.address,
        0,
        0
      );

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["withdraw(uint256,address,address,uint256,uint256)"](
          shareBalance,
          impersonatedSigner.address,
          impersonatedSigner.address,
          minAmountOut,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "WithdrawFromVault");

    const balanceAfter = await returnFinanceUSDCVault.balanceOf(
      impersonatedSigner.address
    );
  }).timeout(720000);

  it("should successfully execute a rescue funds transaction from the vault", async () => {
    const { returnFinanceUSDCVault, impersonatedSigner, usdcContract } =
      await loadFixture(deployedContracts);

    // Approve the Return Finance Contract to spend our USDC
    await usdcContract
      .connect(impersonatedSigner)
      .approve(returnFinanceUSDCVault.address, ethers.constants.MaxUint256);

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "DepositToVault");

    const shareBalance = await returnFinanceUSDCVault.balanceOf(
      impersonatedSigner.address
    );

    expect(shareBalance).to.equal("20000000000");
    await returnFinanceUSDCVault.rescueFunds(returnFinanceUSDCVault.address);

    const contractBalance = await usdcContract.balanceOf(
      returnFinanceUSDCVault.address
    );
  }).timeout(720000);

  it("should successfully update pool weights and rebalance", async () => {
    const { returnFinanceUSDCVault, impersonatedSigner, usdcContract } =
      await loadFixture(deployedContracts);

    // Approve the Return Finance Contract to spend our USDC
    await usdcContract
      .connect(impersonatedSigner)
      .approve(returnFinanceUSDCVault.address, ethers.constants.MaxUint256);

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "DepositToVault");

    const shareBalance = await returnFinanceUSDCVault.balanceOf(
      impersonatedSigner.address
    );

    expect(shareBalance).to.equal("20000000000");

    await helpers.mineUpTo(17336460);

    await expect(
      await returnFinanceUSDCVault.updatePoolWeightsAndRebalance(
        2500,
        2500,
        2500,
        2500,
        0
      )
    ).to.be.emit(returnFinanceUSDCVault, "PoolWeightsUpdated");

    const contractBalance = await usdcContract.balanceOf(
      returnFinanceUSDCVault.address
    );
    expect(contractBalance).to.equal("0");
  }).timeout(720000);

  it("should successfully withdraw after updating pool weights and rebalancing", async () => {
    const { returnFinanceUSDCVault, impersonatedSigner, usdcContract } =
      await loadFixture(deployedContracts);

    // Approve the Return Finance Contract to spend our USDC
    await usdcContract
      .connect(impersonatedSigner)
      .approve(returnFinanceUSDCVault.address, ethers.constants.MaxUint256);

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "DepositToVault");

    await helpers.mineUpTo(17336460);

    await expect(
      await returnFinanceUSDCVault.updatePoolWeightsAndRebalance(
        2500,
        2500,
        2500,
        2500,
        0
      )
    ).to.be.emit(returnFinanceUSDCVault, "PoolWeightsUpdated");

    const contractBalance = await usdcContract.balanceOf(
      returnFinanceUSDCVault.address
    );
    expect(contractBalance).to.equal("0");

    const shareBalance = await returnFinanceUSDCVault.balanceOf(
      impersonatedSigner.address
    );

    expect(shareBalance).to.equal("20000000000");

    // Simulate txn via callStatic to get the minimum amount we can get
    const minAmountOut = await returnFinanceUSDCVault
      .connect(impersonatedSigner)
      .callStatic["withdraw(uint256,address,address,uint256,uint256)"](
        shareBalance,
        impersonatedSigner.address,
        impersonatedSigner.address,
        0,
        0
      );
    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["withdraw(uint256,address,address,uint256,uint256)"](
          shareBalance,
          impersonatedSigner.address,
          impersonatedSigner.address,
          minAmountOut,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "WithdrawFromVault");
  }).timeout(720000);

  it("should successfully re-deposit stale USDC into the pools", async () => {
    const { returnFinanceUSDCVault, impersonatedSigner, usdcContract } =
      await loadFixture(deployedContracts);

    // Approve the Return Finance Contract to spend our USDC
    await usdcContract
      .connect(impersonatedSigner)
      .approve(returnFinanceUSDCVault.address, ethers.constants.MaxUint256);

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "DepositToVault");

    const shareBalance = await returnFinanceUSDCVault.balanceOf(
      impersonatedSigner.address
    );

    expect(shareBalance).to.equal("20000000000");

    await helpers.mineUpTo(17336460);

    // Transfer some USDC directly to the contract
    await usdcContract
      .connect(impersonatedSigner)
      .transfer(returnFinanceUSDCVault.address, "1000000000000");

    const contractUSDCBalanceBefore = await usdcContract.balanceOf(
      returnFinanceUSDCVault.address
    );

    expect(contractUSDCBalanceBefore).to.equal("1000000000000");

    await expect(
      await returnFinanceUSDCVault.reDepositUnderlyingIntoPools(0)
    ).to.be.emit(returnFinanceUSDCVault, "ReDepositToPools");

    const contractBalance = await usdcContract.balanceOf(
      returnFinanceUSDCVault.address
    );
    expect(contractBalance).to.equal("0");
  }).timeout(720000);

  it("should successfully harvest Conic rewards and swap for USDC", async () => {
    const { returnFinanceUSDCVault, impersonatedSigner, usdcContract } =
      await loadFixture(deployedContracts);

    // Approve the Return Finance Contract to spend our USDC
    await usdcContract
      .connect(impersonatedSigner)
      .approve(returnFinanceUSDCVault.address, ethers.constants.MaxUint256);

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "DepositToVault");

    const shareBalance = await returnFinanceUSDCVault.balanceOf(
      impersonatedSigner.address
    );

    expect(shareBalance).to.equal("20000000000");

    await helpers.mineUpTo(17336460);

    const contractUSDCBalanceBefore = await usdcContract.balanceOf(
      returnFinanceUSDCVault.address
    );

    expect(contractUSDCBalanceBefore).to.equal("0");

    const conicPoolWeight = await returnFinanceUSDCVault.poolWeight(
      CONIC_OMNI_POOL_USDC
    );

    // This should be validated only in case Conic's Pool weigth is not 0
    if (conicPoolWeight > 0) {
      // Simulate txn via callStatic to get the minimum amount we can get
      const minAmountOutUSDC = await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        .callStatic["harvestConicRewardsAndSwapForUnderlying(uint256)"](0);

      await expect(
        returnFinanceUSDCVault.harvestConicRewardsAndSwapForUnderlying(0)
      ).to.be.reverted;

      await expect(
        await returnFinanceUSDCVault
          .connect(impersonatedSigner)
          .harvestConicRewardsAndSwapForUnderlying(0)
      ).to.be.emit(returnFinanceUSDCVault, "HarvestConicRewards");

      const contractBalance = await usdcContract.balanceOf(
        returnFinanceUSDCVault.address
      );

      expect(contractBalance).to.be.gt(minAmountOutUSDC);
    }
  }).timeout(720000);

  it("should not harvest Conic rewards and swap for USDC when slippage is too high", async () => {
    const { returnFinanceUSDCVault, impersonatedSigner, usdcContract } =
      await loadFixture(deployedContracts);

    // Approve the Return Finance Contract to spend our USDC
    await usdcContract
      .connect(impersonatedSigner)
      .approve(returnFinanceUSDCVault.address, ethers.constants.MaxUint256);

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "DepositToVault");

    const shareBalance = await returnFinanceUSDCVault.balanceOf(
      impersonatedSigner.address
    );

    expect(shareBalance).to.equal("20000000000");

    await helpers.mineUpTo(17336460);

    const contractUSDCBalanceBefore = await usdcContract.balanceOf(
      returnFinanceUSDCVault.address
    );

    expect(contractUSDCBalanceBefore).to.equal("0");

    const conicPoolWeight = await returnFinanceUSDCVault.poolWeight(
      CONIC_OMNI_POOL_USDC
    );

    if (conicPoolWeight > 0) {
      // Simulate txn via callStatic to get the minimum amount we can get
      const minAmountOutUSDC = await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        .callStatic["harvestConicRewardsAndSwapForUnderlying(uint256)"](0);

      await expect(
        returnFinanceUSDCVault
          .connect(impersonatedSigner)
          .harvestConicRewardsAndSwapForUnderlying(
            BigNumber.from(minAmountOutUSDC).mul(2)
          )
      ).to.be.reverted;

      const contractBalance = await usdcContract.balanceOf(
        returnFinanceUSDCVault.address
      );

      expect(contractBalance).to.equal("0");
    }
  }).timeout(720000);

  it("should successfully sweep funds from contract - only owner", async () => {
    const {
      returnFinanceUSDCVault,
      impersonatedSigner,
      usdcContract,
      deployer,
    } = await loadFixture(deployedContracts);

    // Transfer some USDC directly to the contract
    await usdcContract
      .connect(impersonatedSigner)
      .transfer(returnFinanceUSDCVault.address, "1000000000000");

    await impersonatedSigner.sendTransaction({
      to: returnFinanceUSDCVault.address,
      value: ethers.utils.parseEther("1"),
    });

    const usdcBalanceBeforeSweep = await usdcContract.balanceOf(
      returnFinanceUSDCVault.address
    );
    const ethBalanceBeforeSweep = await ethers.provider.getBalance(
      returnFinanceUSDCVault.address
    );

    expect(usdcBalanceBeforeSweep).to.equal("1000000000000");
    expect(ethBalanceBeforeSweep).to.equal(ethers.utils.parseEther("1"));

    await expect(
      await returnFinanceUSDCVault
        .connect(deployer)
        ["sweepFunds(address)"](usdcContract.address)
    ).to.be.emit(returnFinanceUSDCVault, "SweepFunds");

    await expect(
      await returnFinanceUSDCVault
        .connect(deployer)
        ["sweepFunds(address)"](ethers.constants.AddressZero)
    ).to.be.emit(returnFinanceUSDCVault, "SweepFunds");

    const usdcBalanceAfterSweep = await usdcContract.balanceOf(
      returnFinanceUSDCVault.address
    );
    const ethBalanceAfterSweep = await ethers
      .getDefaultProvider()
      .getBalance(returnFinanceUSDCVault.address);

    expect(usdcBalanceAfterSweep).to.equal("0");
    expect(ethBalanceAfterSweep).to.equal("0");
  }).timeout(720000);

  it("should successfully get claimable rewards from Conic", async () => {
    const {
      returnFinanceUSDCVault,
      impersonatedSigner,
      usdcContract,
      deployer,
    } = await loadFixture(deployedContracts);

    // Approve the Return Finance Contract to spend our USDC
    await usdcContract
      .connect(impersonatedSigner)
      .approve(returnFinanceUSDCVault.address, ethers.constants.MaxUint256);

    await expect(
      await returnFinanceUSDCVault
        .connect(impersonatedSigner)
        ["deposit(uint256,address,bytes32,uint256,uint256)"](
          "20000000000",
          impersonatedSigner.address,
          ethers.constants.HashZero,
          0,
          0
        )
    ).to.be.emit(returnFinanceUSDCVault, "DepositToVault");

    await helpers.mineUpTo(17336460);

    const claimableRewards =
      await returnFinanceUSDCVault.getClaimableRewardsFromConic();

    const conicPoolWeight = await returnFinanceUSDCVault.poolWeight(
      CONIC_OMNI_POOL_USDC
    );

    if (conicPoolWeight > 0) {
      expect(claimableRewards[0]).to.be.gt("0");
      expect(claimableRewards[1]).to.be.gt("0");
      expect(claimableRewards[2]).to.be.gt("0");
    }
  }).timeout(720000);

  it("Only owner should be able to pause and unpause", async () => {
    const {
      returnFinanceUSDCVault,
      impersonatedSigner,
      usdcContract,
      deployer,
    } = await loadFixture(deployedContracts);

    //Try to pause from non-owner
    await expect(returnFinanceUSDCVault.connect(impersonatedSigner).pause()).to
      .be.reverted;

    // Pause from contract owner
    await expect(
      await returnFinanceUSDCVault.connect(deployer).pause()
    ).to.be.emit(returnFinanceUSDCVault, "Paused");

    // Try to unpause from non-owner
    await expect(returnFinanceUSDCVault.connect(impersonatedSigner).unpause())
      .to.be.reverted;

    // Unpause from contract owner
    await expect(
      await returnFinanceUSDCVault.connect(deployer).unpause()
    ).to.be.emit(returnFinanceUSDCVault, "Unpaused");
  }).timeout(720000);

  it("Only owner should be able to whitelist", async () => {
    const {
      returnFinanceUSDCVault,
      impersonatedSigner,
      usdcContract,
      deployer,
    } = await loadFixture(deployedContracts);

    // Try to change whitelist status by non-owner
    await expect(
      returnFinanceUSDCVault
        .connect(impersonatedSigner)
        .toggleWhitelist(impersonatedSigner.address, true)
    ).to.be.reverted;

    // Try to change whitelist status by owner
    await expect(
      await returnFinanceUSDCVault
        .connect(deployer)
        .toggleWhitelist(impersonatedSigner.address, false)
    ).to.be.emit(returnFinanceUSDCVault, "AddressWhitelisted");
  }).timeout(720000);
});
