// contracts/AttestationContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AttestationContract {
    struct Attestation {
        address verifier;
        uint256 timestamp;
        bool success;
    }

    mapping(uint256 => Attestation[]) private assetAttestations;

    event AttestationCompleted(
        uint256 indexed assetId,
        address indexed verifier,
        bool success,
        uint256 timestamp
    );

    function createAttestation(uint256 assetId, bool success) public {
        Attestation memory newAttestation = Attestation({
            verifier: msg.sender,
            timestamp: block.timestamp,
            success: success
        });
        assetAttestations[assetId].push(newAttestation);
        emit AttestationCompleted(assetId, msg.sender, success, block.timestamp);
    }

    function getAttestationCount(uint256 assetId) public view returns (uint256) {
        return assetAttestations[assetId].length;
    }

    function getAttestation(
        uint256 assetId,
        uint256 index
    ) public view returns (address verifier, uint256 timestamp, bool success) {
        Attestation storage attestation = assetAttestations[assetId][index];
        return (attestation.verifier, attestation.timestamp, attestation.success);
    }
}
