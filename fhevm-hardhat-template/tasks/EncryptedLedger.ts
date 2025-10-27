import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Tutorial: Deploy and Interact Locally (--network localhost)
 * ===========================================================
 *
 * 1. From a separate terminal window:
 *
 *   npx hardhat node
 *
 * 2. Deploy the EncryptedLedger contract
 *
 *   npx hardhat --network localhost deploy
 *
 * 3. Interact with the EncryptedLedger contract
 *
 *   npx hardhat --network localhost task:decrypt-balance
 *   npx hardhat --network localhost task:secure-increment --value 2
 *   npx hardhat --network localhost task:secure-decrement --value 1
 *   npx hardhat --network localhost task:decrypt-balance
 *
 *
 * Tutorial: Deploy and Interact on Sepolia (--network sepolia)
 * ===========================================================
 *
 * 1. Deploy the EncryptedLedger contract
 *
 *   npx hardhat --network sepolia deploy
 *
 * 2. Interact with the EncryptedLedger contract
 *
 *   npx hardhat --network sepolia task:decrypt-balance
 *   npx hardhat --network sepolia task:secure-increment --value 2
 *   npx hardhat --network sepolia task:secure-decrement --value 1
 *   npx hardhat --network sepolia task:decrypt-balance
 *
 */

/**
 * Example:
 *   - npx hardhat --network localhost task:ledger-address
 *   - npx hardhat --network sepolia task:ledger-address
 */
task("task:ledger-address", "Prints the EncryptedLedger address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;

  const encryptedLedger = await deployments.get("EncryptedLedger");

  console.log("EncryptedLedger address is " + encryptedLedger.address);
});

/**
 * Example:
 *   - npx hardhat --network localhost task:decrypt-balance
 *   - npx hardhat --network sepolia task:decrypt-balance
 */
task("task:decrypt-balance", "Calls the getConfidentialBalance() function of EncryptedLedger Contract")
  .addOptionalParam("address", "Optionally specify the EncryptedLedger contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const encryptedLedgerDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EncryptedLedger");
    console.log(`EncryptedLedger: ${encryptedLedgerDeployment.address}`);

    const signers = await ethers.getSigners();

    const encryptedLedgerContract = await ethers.getContractAt("EncryptedLedger", encryptedLedgerDeployment.address);

    const encryptedBalance = await encryptedLedgerContract.getConfidentialBalance();
    if (encryptedBalance === ethers.ZeroHash) {
      console.log(`encrypted balance: ${encryptedBalance}`);
      console.log("clear balance    : 0");
      return;
    }

    const clearBalance = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalance,
      encryptedLedgerDeployment.address,
      signers[0],
    );
    console.log(`Encrypted balance: ${encryptedBalance}`);
    console.log(`Clear balance    : ${clearBalance}`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:secure-increment --value 1
 *   - npx hardhat --network sepolia task:secure-increment --value 1
 */
task("task:secure-increment", "Calls the secureIncrement() function of EncryptedLedger Contract")
  .addOptionalParam("address", "Optionally specify the EncryptedLedger contract address")
  .addParam("value", "The increment value")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const value = parseInt(taskArguments.value);
    if (!Number.isInteger(value)) {
      throw new Error(`Argument --value is not an integer`);
    }

    await fhevm.initializeCLIApi();

    const encryptedLedgerDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EncryptedLedger");
    console.log(`EncryptedLedger: ${encryptedLedgerDeployment.address}`);

    const signers = await ethers.getSigners();

    const encryptedLedgerContract = await ethers.getContractAt("EncryptedLedger", encryptedLedgerDeployment.address);

    // Encrypt the value passed as argument
    const encryptedValue = await fhevm
      .createEncryptedInput(encryptedLedgerDeployment.address, signers[0].address)
      .add32(value)
      .encrypt();

    const tx = await encryptedLedgerContract
      .connect(signers[0])
      .secureIncrement(encryptedValue.handles[0], encryptedValue.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    const newEncryptedBalance = await encryptedLedgerContract.getConfidentialBalance();
    console.log("Encrypted balance after increment:", newEncryptedBalance);

    console.log(`EncryptedLedger secureIncrement(${value}) succeeded!`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:secure-decrement --value 1
 *   - npx hardhat --network sepolia task:secure-decrement --value 1
 */
task("task:secure-decrement", "Calls the secureDecrement() function of EncryptedLedger Contract")
  .addOptionalParam("address", "Optionally specify the EncryptedLedger contract address")
  .addParam("value", "The decrement value")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const value = parseInt(taskArguments.value);
    if (!Number.isInteger(value)) {
      throw new Error(`Argument --value is not an integer`);
    }

    await fhevm.initializeCLIApi();

    const encryptedLedgerDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EncryptedLedger");
    console.log(`EncryptedLedger: ${encryptedLedgerDeployment.address}`);

    const signers = await ethers.getSigners();

    const encryptedLedgerContract = await ethers.getContractAt("EncryptedLedger", encryptedLedgerDeployment.address);

    // Encrypt the value passed as argument
    const encryptedValue = await fhevm
      .createEncryptedInput(encryptedLedgerDeployment.address, signers[0].address)
      .add32(value)
      .encrypt();

    const tx = await encryptedLedgerContract
      .connect(signers[0])
      .secureDecrement(encryptedValue.handles[0], encryptedValue.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    const newEncryptedBalance = await encryptedLedgerContract.getConfidentialBalance();
    console.log("Encrypted balance after decrement:", newEncryptedBalance);

    console.log(`EncryptedLedger secureDecrement(${value}) succeeded!`);
  });
