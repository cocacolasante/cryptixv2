// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CryptixMarketplace{
    address public admin;


    mapping(address=>Listing) public tixListing;

    struct Listing{
        address _showAddress;
        address owner;
        uint listingPrice;
        uint _numOfTix;
    }

    constructor() {
        admin = msg.sender;
    }

    function listTicket(address showAddress, uint pricePerTicket, uint numOfTix) public {
        tixListing[msg.sender] = Listing(showAddress, msg.sender, pricePerTicket, numOfTix);
        // get nft spend approval
        
        // transfer nft to marketplace


    }
}