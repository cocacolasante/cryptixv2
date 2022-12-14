// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IEscrow.sol";

import "hardhat/console.sol";

contract Cryptickets is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public baseUri = "SAMPLEBASE";
    uint public maxSupply = 100;

    address private admin;
    address private immutable bandAddress;
    address private immutable venueAddress;
    address private immutable escrowAddress;

    uint public bandPercent = 10;

    uint public ticketPrice;
    uint public ticketLimit = 8;
    uint public endDate;

    bool public showCancelled;
    bool public showCompleted;

    address[] public allOwners;


    mapping(address => uint) public ticketsPurchased;

    event TicketsPurchased(address to, uint amountPurchased);

    receive() external payable{}

    constructor (string memory _name, string memory _symbol, address _escrowAddress, address _bandAddress, address _venueAddress) ERC721(_name, _symbol){
        admin = msg.sender;
        escrowAddress = _escrowAddress;
        bandAddress = _bandAddress;
        venueAddress = _venueAddress;
    }

    // minting function to purchase single or multiple tickets
    function purchaseTickets(uint amount) public payable{
        require(msg.value >= ticketPrice * amount, "pay for tickets");
        require(ticketsPurchased[msg.sender] + amount <= ticketLimit, "max tickets purchased");
        require(_tokenIds.current() + amount <= maxSupply, "sold out");
        require(showCancelled == false || showCompleted == true, "show is not open");

        ticketsPurchased[msg.sender] += amount;
        allOwners.push(msg.sender);
 
        for(uint i; i< amount; i++){
            _tokenIds.increment();

            uint newTokenId = _tokenIds.current();

            _mint(msg.sender, newTokenId);

            string memory newTokenUri = string(abi.encode(baseUri, Strings.toString(newTokenId), ".json"));

            _setTokenURI(newTokenId, newTokenUri);
            
        }

        payable(escrowAddress).transfer(msg.value);

        emit TicketsPurchased(msg.sender, amount);

    }

    // get all current owners
    function returnAllOwners() public view returns(address[] memory){
        require(msg.sender == admin, "only admin");

        address[] memory currentOwners = new address[](allOwners.length);
        uint countIndex;
        for(uint i; i< allOwners.length; i++){
            currentOwners[countIndex] = allOwners[i];
            countIndex++;
        }
        return currentOwners;
    }   

    // refund all the current ticket holders the original purchase price

    function refundAllTickets() public payable {
        require(showCancelled == true, "show not cancelled");
        require(msg.sender == admin, "only admin");
        address[] memory allCurrentOwners = returnAllOwners();

        IEscrow(escrowAddress).releaseFunds();

        for(uint i; i< allOwners.length; i++){
            uint ticketsOwned = balanceOf(allCurrentOwners[i]);
            uint amountToSend = ticketsOwned * ticketPrice;

            payable(allCurrentOwners[i]).transfer(amountToSend);

        }

    }

    // complete show functions

    function payBandAndVenue() public payable {
        showCompleted = true;
        IEscrow(escrowAddress).releaseFunds();

        uint bandAmount = address(this).balance / bandPercent;
        uint adminFee = address(this).balance / bandPercent;

        payable(admin).transfer(adminFee);
        payable(bandAddress).transfer(bandAmount);
        payable(venueAddress).transfer(address(this).balance);

    }




    // override transfer from function to add new address to allOwners array
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");

        allOwners.push(to);

        _transfer(from, to, tokenId);
    }


    // setter function

    function setCancelledShow() public{
        require(msg.sender == admin, "onlyAdmin");
        showCancelled = true;
    }

    function setMaxSupply(uint _maxSupply) public {
        require(msg.sender == admin, "only admin");
        maxSupply = _maxSupply;
    }

    function setEndDate(uint newEndDate) public {
        require(msg.sender == admin, "only admin");
        endDate = newEndDate;
    }

    function setTicketPrice(uint newPrice) public{
        require(msg.sender == admin, "only admin");
        ticketPrice = newPrice;
    }


    // getter functions
    function returnAdmin() public view returns(address){
        return admin;
    }

    function changeAdmin(address _controller) public{
        require(msg.sender == admin, "only admin");
        admin = _controller;
    }

}