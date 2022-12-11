// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract Cryptickets is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public baseUri = "SAMPLEBASE";
    uint public maxSupply = 100;

    address private admin;
    address private bandAddress;
    address private venueAddress;
    address private escrowAddress;

    uint public bandPercent;

    uint public ticketPrice;
    uint public ticketLimit = 8;

    bool public showCancelled;

    address[] allOwners;


    mapping(address => uint) public ticketsPurchased;

    event TicketsPurchased(address to, uint amountPurchased);


    constructor (string memory _name, string memory _symbol) ERC721(_name, _symbol){
        admin = msg.sender;
    }


    function purchaseTickets(uint amount) public payable{
        require(msg.value >= ticketPrice * amount, "pay for tickets");
        require(ticketsPurchased[msg.sender] + amount <= ticketLimit, "max tickets purchased");
        require(_tokenIds.current() + amount <= maxSupply, "sold out");
        require(showCancelled == false, "show was cancelled");

        payable(escrowAddress).transfer(msg.value);

        ticketsPurchased[msg.sender] += amount;

        for(uint i; i< amount; i++){
            _tokenIds.increment();

            uint newTokenId = _tokenIds.current();

            _mint(msg.sender, newTokenId);

            string memory newTokenUri = string(abi.encode(baseUri, Strings.toString(newTokenId), ".json"));

            _setTokenURI(newTokenId, newTokenUri);
            
        }
        
        allOwners.push(msg.sender);

        emit TicketsPurchased(msg.sender, amount);

    }





    // getter functions
    function returnAdmin() public view returns(address){
        return admin;
    }

}