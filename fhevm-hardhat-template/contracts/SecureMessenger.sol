// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint256, externalEuint256} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Enterprise-grade secure messaging platform with FHE encryption
/// @author Privacy Vault Protocol
/// @notice Secure communication platform where users can send encrypted confidential messages
/// @dev Utilizes FHEVM for end-to-end encryption with granular access control
contract SecureMessenger is SepoliaConfig {

    struct ConfidentialMessage {
        address sender;         // Originator address (public)
        address recipient;      // Destination address (public)
        euint256 encryptedData; // Encrypted message payload
        uint256 transmissionTime; // When the message was transmitted
        uint256 messageId;      // Unique transmission identifier
    }

    // Secure storage for all confidential messages
    ConfidentialMessage[] private _secureMessages;

    // Sequential identifier generator
    uint256 private _nextMessageId = 1;

    // Transmission events
    event SecureMessageTransmitted(
        address indexed sender,
        address indexed recipient,
        uint256 indexed messageId,
        uint256 transmissionTime
    );

    /// @notice Transmit an encrypted confidential message to a recipient
    /// @param recipient The destination address
    /// @param encryptedPayload The encrypted message data
    /// @param verificationProof The cryptographic proof for the encrypted payload
    function transmitSecureMessage(
        address recipient,
        externalEuint256 encryptedPayload,
        bytes calldata verificationProof
    ) external {
        require(recipient != address(0), "Invalid destination address");
        require(recipient != msg.sender, "Cannot transmit message to self");

        // Convert external encrypted input to internal encrypted type
        euint256 encryptedData = FHE.fromExternal(encryptedPayload, verificationProof);

        // Create new secure message
        ConfidentialMessage memory newMessage = ConfidentialMessage({
            sender: msg.sender,
            recipient: recipient,
            encryptedData: encryptedData,
            transmissionTime: block.timestamp,
            messageId: _nextMessageId
        });

        _secureMessages.push(newMessage);

        // Grant decryption access to recipient
        FHE.allow(encryptedData, recipient);

        // Retain administrative access for protocol governance
        FHE.allowThis(encryptedData);

        emit SecureMessageTransmitted(msg.sender, recipient, _nextMessageId, block.timestamp);

        _nextMessageId++;
    }

    /// @notice Retrieve the total count of secure messages
    /// @return The total number of transmissions
    function getTotalTransmissions() external view returns (uint256) {
        return _secureMessages.length;
    }

    /// @notice Retrieve transmission metadata without encrypted payload
    /// @param messageId The unique transmission identifier
    /// @return sender Originator address
    /// @return recipient Destination address
    /// @return transmissionTime When the message was transmitted
    function getTransmissionMetadata(uint256 messageId)
        external
        view
        returns (address sender, address recipient, uint256 transmissionTime)
    {
        require(messageId > 0 && messageId < _nextMessageId, "Invalid transmission ID");

        ConfidentialMessage storage message = _secureMessages[messageId - 1];
        return (message.sender, message.recipient, message.transmissionTime);
    }

    /// @notice Retrieve encrypted payload for authorized decryption
    /// @param messageId The unique transmission identifier
    /// @return The encrypted data payload
    function getEncryptedPayload(uint256 messageId) external view returns (euint256) {
        require(messageId > 0 && messageId < _nextMessageId, "Invalid transmission ID");

        ConfidentialMessage storage message = _secureMessages[messageId - 1];
        return message.encryptedData;
    }

    /// @notice Retrieve transmissions addressed to a specific recipient
    /// @param recipient The destination address to query
    /// @return transmissionIds Array of transmission IDs addressed to this recipient
    function getTransmissionsForRecipient(address recipient)
        external
        view
        returns (uint256[] memory transmissionIds)
    {
        // First pass: count transmissions for this recipient
        uint256 count = 0;
        for (uint256 i = 0; i < _secureMessages.length; i++) {
            if (_secureMessages[i].recipient == recipient) {
                count++;
            }
        }

        // Second pass: collect transmission IDs
        transmissionIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < _secureMessages.length; i++) {
            if (_secureMessages[i].recipient == recipient) {
                transmissionIds[index] = _secureMessages[i].messageId;
                index++;
            }
        }

        return transmissionIds;
    }

    /// @notice Retrieve transmissions originated by a specific sender
    /// @param sender The originator address to query
    /// @return transmissionIds Array of transmission IDs originated by this address
    function getTransmissionsBySender(address sender)
        external
        view
        returns (uint256[] memory transmissionIds)
    {
        // First pass: count transmissions from this sender
        uint256 count = 0;
        for (uint256 i = 0; i < _secureMessages.length; i++) {
            if (_secureMessages[i].sender == sender) {
                count++;
            }
        }

        // Second pass: collect transmission IDs
        transmissionIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < _secureMessages.length; i++) {
            if (_secureMessages[i].sender == sender) {
                transmissionIds[index] = _secureMessages[i].messageId;
                index++;
            }
        }

        return transmissionIds;
    }
}
