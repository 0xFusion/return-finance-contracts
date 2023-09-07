const hre = require("hardhat");

async function main() {
  console.log("Starting deploy Return Finance USDC Vault...");
  const ReturnFinanceUSDCVault = await hre.ethers.getContractFactory(
    "ReturnFinanceUSDCVault"
  );
  const returnFinanceUSDCVault = await ReturnFinanceUSDCVault.deploy(0,0,0,10000);

  await returnFinanceUSDCVault.deployed();

  console.log(
    `Return Finance USDC Vault deployed to: https://etherscan.io/address/${returnFinanceUSDCVault.address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
