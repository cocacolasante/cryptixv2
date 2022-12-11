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

    address[] public allOwners;


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


    function returnAllOwners() public view returns(address[] memory){
        address[] memory currentOwners = new address[](allOwners.length);
        uint countIndex;
        for(uint i; i< allOwners.length; i++){
            currentOwners[countIndex] = allOwners[i];
            countIndex++;
        }
        return currentOwners;
    }

    function refundAllTickets() public payable {
        require(showCancelled == true, "show not cancelled");
        address[] memory allCurrentOwners = returnAllOwners();

        for(uint i; i< allOwners.length; i++){
            uint ticketsOwned = balanceOf(allCurrentOwners[i]);
            uint amountToSend = ticketsOwned * ticketPrice;

            payable(allCurrentOwners[i]).transfer(amountToSend);

        }

    }



    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");

        allOwners.push(to);

        _transfer(from, to, tokenId);
    }


    // getter functions
    function returnAdmin() public view returns(address){
        return admin;
    }

}