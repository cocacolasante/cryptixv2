// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./Cryptickets.sol";
import "./Escrow.sol";

contract CreatorContract{
    using Counters for Counters.Counter;
    Counters.Counter private _showNumber;
    address private admin;


    mapping(uint => Show) public allShows;

    struct Show{
        uint numberOfShow;
        address ticketAddress;
        address escrowAddress;
        address band;
        address venue;
        bool completed;
    }

    constructor(){
        admin = msg.sender;
    }


    function createShow(string memory _name, string memory _symbol, address _bandAddress, address _venueAddress) public {
        _showNumber.increment();
        uint newShowNum = _showNumber.current();

        Escrow newEscrow = new Escrow();

        Cryptickets newTickets = new Cryptickets(_name, _symbol, address(newEscrow), _bandAddress, _venueAddress);

        newEscrow.setTicketContract(address(newTickets));


        allShows[newShowNum] = Show(newShowNum, address(newTickets), address(newEscrow), _bandAddress, _venueAddress, false);


    }
}