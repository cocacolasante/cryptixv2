// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./Cryptickets.sol";
import "./interfaces/ICreateController.sol";
import "./interfaces/IControlShow.sol";
import "./Escrow.sol";



contract CreatorContract{
    uint public showNumber;
    address public createControllerAddress;

    mapping(uint => Show) public allShows;

    struct Show{
        uint numberOfShow;
        address ticketAddress;
        address escrowAddress;
        address band;
        address venue;
        bool completed;
    }

    constructor(address _createController){
        createControllerAddress = _createController;
    }

    function createShow(string memory _name, string memory _symbol, address _bandAddress, address _venueAddress, uint endDateInSeconds, uint price) public returns(address){
        showNumber++;
        uint newShowNum = showNumber;

        uint endTime = endDateInSeconds + block.timestamp;

        Escrow newEscrow = new Escrow();

        Cryptickets newTickets = new Cryptickets(_name, _symbol, address(newEscrow), _bandAddress, _venueAddress);
        newTickets.setEndDate(endTime);
        newTickets.setTicketPrice(price);

        address newController = ICreateController(createControllerAddress).createController(newShowNum, _bandAddress, _venueAddress, address(newTickets));


        

        newEscrow.setTicketContract(address(newTickets));

        allShows[newShowNum] = Show(newShowNum, address(newTickets), address(newEscrow), _bandAddress, _venueAddress, false);

        return address(newController);
    }



}