import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { EncryptedLedger } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("EncryptedLedgerSepolia", function () {
  let signers: Signers;
  let encryptedLedgerContract: EncryptedLedger;
  let encryptedLedgerContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const encryptedLedgerDeployment = await deployments.get("EncryptedLedger");
      encryptedLedgerContractAddress = encryptedLedgerDeployment.address;
      encryptedLedgerContract = await ethers.getContractAt("EncryptedLedger", encryptedLedgerDeployment.address);
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("secure increment the balance by 1", async function () {
    steps = 10;

    this.timeout(4 * 40000);

    progress("Encrypting '0'...");
    const encryptedZero = await fhevm
      .createEncryptedInput(encryptedLedgerContractAddress, signers.alice.address)
      .add32(0)
      .encrypt();

    progress(
      `Call secureIncrement(0) EncryptedLedger=${encryptedLedgerContractAddress} handle=${ethers.hexlify(encryptedZero.handles[0])} signer=${signers.alice.address}...`,
    );
    let tx = await encryptedLedgerContract
      .connect(signers.alice)
      .secureIncrement(encryptedZero.handles[0], encryptedZero.inputProof);
    await tx.wait();

    progress(`Call EncryptedLedger.getConfidentialBalance()...`);
    const encryptedBalanceBeforeInc = await encryptedLedgerContract.getConfidentialBalance();
    expect(encryptedBalanceBeforeInc).to.not.eq(ethers.ZeroHash);

    progress(`Decrypting EncryptedLedger.getConfidentialBalance()=${encryptedBalanceBeforeInc}...`);
    const clearBalanceBeforeInc = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalanceBeforeInc,
      encryptedLedgerContractAddress,
      signers.alice,
    );
    progress(`Clear EncryptedLedger.getConfidentialBalance()=${clearBalanceBeforeInc}`);

    progress(`Encrypting '1'...`);
    const encryptedOne = await fhevm
      .createEncryptedInput(encryptedLedgerContractAddress, signers.alice.address)
      .add32(1)
      .encrypt();

    progress(
      `Call secureIncrement(1) EncryptedLedger=${encryptedLedgerContractAddress} handle=${ethers.hexlify(encryptedOne.handles[0])} signer=${signers.alice.address}...`,
    );
    tx = await encryptedLedgerContract.connect(signers.alice).secureIncrement(encryptedOne.handles[0], encryptedOne.inputProof);
    await tx.wait();

    progress(`Call EncryptedLedger.getConfidentialBalance()...`);
    const encryptedBalanceAfterInc = await encryptedLedgerContract.getConfidentialBalance();

    progress(`Decrypting EncryptedLedger.getConfidentialBalance()=${encryptedBalanceAfterInc}...`);
    const clearBalanceAfterInc = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedBalanceAfterInc,
      encryptedLedgerContractAddress,
      signers.alice,
    );
    progress(`Clear EncryptedLedger.getConfidentialBalance()=${clearBalanceAfterInc}`);

    expect(clearBalanceAfterInc - clearBalanceBeforeInc).to.eq(1);
  });
});
