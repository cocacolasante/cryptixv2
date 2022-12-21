// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/ICreateShow.sol";
import "./interfaces/IEscrow.sol";
import "./interfaces/ICryptickets.sol";

contract ControlShow{
    address public ticketContract;

    address private creatorContract;
    address private immutable band;
    address private immutable venue;
    
    uint public immutable showNumber;

    bool public showCompleted;

    receive() external payable{}

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

        ICryptickets(ticketContract).setCancelledShow();

        ICryptickets(ticketContract).refundAllTickets();

    }


    function rescheduleShow(uint newShowDate) public {
        require(msg.sender == band || msg.sender == venue , "only band or venue");
        ICryptickets(ticketContract).changeShowDate(newShowDate);
    }




    function setTicketContract(address _ticketContract) public {
        require(msg.sender == creatorContract, "only creator can call");
        ticketContract = _ticketContract;
    }

    function setNewMaxSupply(uint newMaxSup) public{
        require(msg.sender == band || msg.sender == venue , "only band or venue");
        ICryptickets(ticketContract).setMaxSupply(newMaxSup);
    }

    function setNewBaseUri(string memory _baseUri) public{
        require(msg.sender == band || msg.sender == venue , "only band or venue");
        ICryptickets(ticketContract).setBaseUri(_baseUri);
    }


  
}