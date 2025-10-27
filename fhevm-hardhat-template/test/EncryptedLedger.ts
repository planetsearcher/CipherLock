import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { EncryptedLedger, EncryptedLedger__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("EncryptedLedger")) as EncryptedLedger__factory;
  const encryptedLedgerContract = (await factory.deploy()) as EncryptedLedger;
  const encryptedLedgerContractAddress = await encryptedLedgerContract.getAddress();

  return { encryptedLedgerContract, encryptedLedgerContractAddress };
}

describe("EncryptedLedger", function () {
  let signers: Signers;
  let encryptedLedgerContract: EncryptedLedger;
  let encryptedLedgerContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ encryptedLedgerContract, encryptedLedgerContractAddress } = await deployFixture());
  });

  it("encrypted balance should be uninitialized after deployment", async function () {
    const encryptedBalance = await encryptedLedgerContract.getConfidentialBalance();
    // Expect initial balance to be bytes32(0) after deployment,
    // (meaning the encrypted balance value is uninitialized)
    expect(encryptedBalance).to.eq(ethers.ZeroHash);
  });

  it("secure increment the balance by 1", async function () {
    const encryptedBalanceBeforeInc = await encryptedLedgerContract.getConfidentialBalance();
    expect(encryptedBalanceBeforeInc).to.eq(ethers.ZeroHash);
    const clearBalanceBeforeInc = 0;

    // Encrypt constant 1 as a euint32
    const clearOne = 1;
    const encryptedOne = await fhevm
      .createEncryptedInput(encryptedLedgerContractAddress, signers.alice.address)
      .add32(clearOne)
      .encrypt();

    const tx = await encryptedLedgerContract
      .connect(signers.alice)
      .secureIncrement(encryptedOne.handles[0], encryptedOne.inputProof);
    await tx.wait();

    const encryptedBalanceAfterInc = await encryptedLedgerContract.getConfidentialBalance();
    const clearBalanceAfterInc = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalanceAfterInc,
      encryptedLedgerContractAddress,
      signers.alice,
    );

    expect(clearBalanceAfterInc).to.eq(clearBalanceBeforeInc + clearOne);
  });

  it("secure decrement the balance by 1", async function () {
    // Encrypt constant 1 as a euint32
    const clearOne = 1;
    const encryptedOne = await fhevm
      .createEncryptedInput(encryptedLedgerContractAddress, signers.alice.address)
      .add32(clearOne)
      .encrypt();

    // First increment by 1, balance becomes 1
    let tx = await encryptedLedgerContract
      .connect(signers.alice)
      .secureIncrement(encryptedOne.handles[0], encryptedOne.inputProof);
    await tx.wait();

    // Then decrement by 1, balance goes back to 0
    tx = await encryptedLedgerContract.connect(signers.alice).secureDecrement(encryptedOne.handles[0], encryptedOne.inputProof);
    await tx.wait();

    const encryptedBalanceAfterDec = await encryptedLedgerContract.getConfidentialBalance();
    const clearBalanceAfterInc = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalanceAfterDec,
      encryptedLedgerContractAddress,
      signers.alice,
    );

    expect(clearBalanceAfterInc).to.eq(0);
  });
});
