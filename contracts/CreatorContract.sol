// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/ICreateController.sol";
import "./interfaces/IControlShow.sol";
import "./Escrow.sol";
import "./interfaces/ICryptickets.sol";
import "./interfaces/ICreateTix.sol";



contract CreatorContract{
    uint public showNumber;
    address public createContAdd;
    address public createTickAdd;

    mapping(uint => Show) public allShows;

    struct Show{
        address ticketAddress;
        address escrowAddress;
        address controllerContract;
        address band;
        address venue;
        bool completed;
    }
    
    receive() external payable{}

    constructor(address _createCon, address _createTickAdd){
        createContAdd = _createCon;
        createTickAdd =_createTickAdd;
    }

    function createShow(string memory _name, string memory _symbol, address _bandAddress, address _venueAddress, uint endDate, uint price) public{
        showNumber++;
        uint newShowNum = showNumber;

        uint endTime = endDate + block.timestamp;

        Escrow newEscrow = new Escrow();

        address newTickets = ICreateTickets(createTickAdd).createTicket(_name, _symbol, address(newEscrow), _bandAddress, _venueAddress, endTime, price);
        
        address newController = ICreateController(createContAdd).createController(newShowNum, _bandAddress, _venueAddress, address(newTickets));

        ICryptickets(newTickets).changeAdmin(newController);

        newEscrow.setTicketContract(address(newTickets));

        allShows[newShowNum] = Show( address(newTickets), address(newEscrow),newController, _bandAddress, _venueAddress, false);
        

    }



}