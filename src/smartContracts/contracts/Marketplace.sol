// contracts/Marketplace.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./usdcContract.sol";
import "./AttestationContract.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace {
    AssetToken public assetToken;
    AttestationContract public attestationContract;
    IERC20 public usdcToken; // USDC token interface

    struct Asset {
        uint256 id;
        address payable owner;
        uint256 price; // Price in USDC (assuming 6 decimals)
        string name;
        string image;
        uint256 year;
        uint256 length; // Represented in integers
        uint8 attestationStatus; // 0: Not Open, 1: Open
    }

    mapping(uint256 => Asset) public assets;
    uint256[] public assetIds;

    event AssetListed(
        uint256 indexed assetId,
        address indexed owner,
        uint256 price,
        string name,
        string image,
        uint256 year,
        uint256 length
    );
    event AssetPurchased(uint256 indexed assetId, address indexed seller, address indexed buyer, uint256 price, uint256 timestamp);
    event AssetAttested(uint256 indexed assetId, address verifier, bool success, uint256 timestamp);

    constructor(
        address _assetTokenAddress,
        address _attestationAddress,
        address _usdcTokenAddress
    ) {
        assetToken = AssetToken(_assetTokenAddress);
        attestationContract = AttestationContract(_attestationAddress);
        usdcToken = IERC20(_usdcTokenAddress);
    }

    function listAsset(
        uint256 tokenId,
        uint256 price,
        string memory name,
        string memory image,
        uint256 year,
        uint256 length
    ) public {
        require(assetToken.ownerOf(tokenId) == msg.sender, "Only owner can list asset");
        assetToken.transferFrom(msg.sender, address(this), tokenId);

        assets[tokenId] = Asset({
            id: tokenId,
            owner: payable(msg.sender),
            price: price,
            name: name,
            image: image,
            year: year,
            length: length,
            attestationStatus: 0
        });

        assetIds.push(tokenId);

        emit AssetListed(tokenId, msg.sender, price, name, image, year, length);
    }

    function getAssetIds() public view returns (uint256[] memory) {
        return assetIds;
    }

    function purchaseAsset(uint256 assetId) public {
        Asset storage asset = assets[assetId];
        require(asset.attestationStatus == 0, "Asset not available for direct purchase");

        // Transfer USDC from buyer to seller
        require(
            usdcToken.transferFrom(msg.sender, asset.owner, asset.price),
            "USDC transfer failed"
        );

        // Transfer NFT to buyer
        assetToken.transferFrom(address(this), msg.sender, assetId);

        emit AssetPurchased(assetId, asset.owner, msg.sender, asset.price, block.timestamp);

        // Remove asset from marketplace
        delete assets[assetId];
        // Remove assetId from assetIds array (left as an exercise)
    }

    function attestAndBuy(uint256 assetId) public {
        Asset storage asset = assets[assetId];
        require(asset.attestationStatus == 0, "Asset already open for attestation");

        // Open asset to attestation
        asset.attestationStatus = 1;

        emit AssetAttested(assetId, msg.sender, true, block.timestamp);
    }

    function verifyAsset(uint256 assetId, bool success) public {
        attestationContract.createAttestation(assetId, success);
        Asset storage asset = assets[assetId];
        asset.attestationStatus = success ? 0 : 1;

        emit AssetAttested(assetId, msg.sender, success, block.timestamp);
    }
}
