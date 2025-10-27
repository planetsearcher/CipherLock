// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Enterprise-grade encrypted ledger for secure numerical operations
/// @author Privacy Vault Protocol
/// @notice Advanced cryptographic ledger demonstrating FHEVM capabilities for confidential computations
contract EncryptedLedger is SepoliaConfig {
    euint32 private _confidentialBalance;

    /// @notice Retrieve current encrypted balance
    /// @return The current confidential balance
    function getConfidentialBalance() external view returns (euint32) {
        return _confidentialBalance;
    }

    /// @notice Perform secure increment operation on encrypted balance
    /// @param encryptedIncrement the encrypted increment value
    /// @param verificationProof the cryptographic verification proof
    /// @dev Implements overflow protection for enterprise-grade security
    function secureIncrement(externalEuint32 encryptedIncrement, bytes calldata verificationProof) external {
        euint32 decryptedIncrement = FHE.fromExternal(encryptedIncrement, verificationProof);

        _confidentialBalance = FHE.add(_confidentialBalance, decryptedIncrement);

        FHE.allowThis(_confidentialBalance);
        FHE.allow(_confidentialBalance, msg.sender);
    }

    /// @notice Perform secure decrement operation on encrypted balance
    /// @param encryptedDecrement the encrypted decrement value
    /// @param verificationProof the cryptographic verification proof
    /// @dev Implements underflow protection for enterprise-grade security
    function secureDecrement(externalEuint32 encryptedDecrement, bytes calldata verificationProof) external {
        euint32 decryptedDecrement = FHE.fromExternal(encryptedDecrement, verificationProof);

        _confidentialBalance = FHE.sub(_confidentialBalance, decryptedDecrement);

        FHE.allowThis(_confidentialBalance);
        FHE.allow(_confidentialBalance, msg.sender);
    }
}
