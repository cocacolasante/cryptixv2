// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract CreateProfileNFT is ERC721URIStorage {


    constructor() ERC721("Cryptix", "CTX"){}

    function makeNFT(string memory tokenUri) public {
        
    }
}