const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const unlockTime = Math.floor(Date.now() / 1000) + 3600; // Unlock in 1 hour

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, {
    value: hre.ethers.parseEther("1.0"),
  }); // Sending 1 ETH for testing

  await lock.waitForDeployment();

  const contractAddress = {
    Lock: lock.target,
  };

  const contractsDir = path.join(__dirname, "../frontend/dapp/src/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(contractAddress, null, 2)
  );

  fs.writeFileSync(
    path.join(contractsDir, "Lock.json"),
    JSON.stringify(await hre.artifacts.readArtifact("Lock"), null, 2)
  );

  console.log(`Lock contract deployed to: ${lock.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
