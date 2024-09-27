// contracts/AssetToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AssetToken is ERC721URIStorage {
    uint256 public tokenCounter;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {
        tokenCounter = 0;
    }

    event AssetTokenCreated(uint256 indexed tokenId, address owner);

    function createAssetToken(address owner, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = tokenCounter;
        _safeMint(owner, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter += 1;

        emit AssetTokenCreated(newItemId, owner);

        return newItemId;
    }
}
