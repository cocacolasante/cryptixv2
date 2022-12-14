// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/ICreateShow.sol";
import "./interfaces/IEscrow.sol";
import "./interfaces/ICryptickets.sol";

contract ControlShow{
    address private ticketContract;

    address private creatorContract;
    address private immutable band;
    address private immutable venue;
    
    uint public immutable showNumber;

    bool public showCompleted;


    modifier onlyVenue {
        require(msg.sender == venue, "only venue");
        _;
        
    }

    constructor(uint _showNumber, address _band, address _venue){
        showNumber = _showNumber;
        band = _band;
        venue = _venue;  
        creatorContract = msg.sender;      
    }

    function completeShow() public onlyVenue{
        
        showCompleted = true;


        ICryptickets(ticketContract).payBandAndVenue();


    }

    function refundShow() public{

        require(msg.sender == band || msg.sender == venue , "only band or venue");

        ICryptickets(ticketContract).refundAllTickets();

    }



    function setTicketContract(address _ticketContract) public {
        require(msg.sender == creatorContract, "only creator can call");
        ticketContract = _ticketContract;
    }


  
}