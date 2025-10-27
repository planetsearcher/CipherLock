import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedEncryptedLedger = await deploy("EncryptedLedger", {
    from: deployer,
    log: true,
  });

  console.log(`EncryptedLedger contract: `, deployedEncryptedLedger.address);

  const deployedSecureMessenger = await deploy("SecureMessenger", {
    from: deployer,
    log: true,
  });

  console.log(`SecureMessenger contract: `, deployedSecureMessenger.address);
};
export default func;
func.id = "deploy_privacy_vault"; // id required to prevent reexecution
func.tags = ["PrivacyVault"];
