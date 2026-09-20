const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of OmCoin to Sepolia...");

  // Get the deployer account from the config
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy the contract
  const OmCoin = await hre.ethers.getContractFactory("OmCoin");
  const omc = await OmCoin.deploy();

  // Wait for the contract to be mined on the blockchain
  await omc.waitForDeployment();

  const address = await omc.getAddress();

  console.log("\n✅ OmCoin Deployed Successfully!");
  console.log("--------------------------------------------------");
  console.log("Contract Address:", address);
  console.log("Network: Sepolia Testnet");
  console.log("--------------------------------------------------");
  console.log("\nNext Steps:");
  console.log("1. Add the address to MetaMask to see your tokens.");
  console.log(`2. View on Etherscan: https://sepolia.etherscan.io/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
