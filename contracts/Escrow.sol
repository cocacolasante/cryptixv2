// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Escrow{
    address private admin;
    address private crypticketsContract;

    uint public showDate;

    receive() external payable{}

    constructor(){
        admin = msg.sender;
    }

    function releaseFunds() public payable{
        require(msg.sender == crypticketsContract, "only tickets function");

        payable(crypticketsContract).transfer(address(this).balance);

        
    }

    function rescheduledRefund(uint refundAmount) external {
        require(msg.sender == crypticketsContract, "only tickets function");
        payable(address(crypticketsContract)).transfer(refundAmount);
    }

    function setTicketContract(address _ticketAddress) public {
        require(msg.sender == admin, "only admin");
        crypticketsContract = _ticketAddress;
    }

    function setShowDate(uint newDateInSeconds) public {
        require(msg.sender == admin, "only admin function");
        showDate = newDateInSeconds;
    }
}