// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Escrow{
    address private admin;
    address private crypticketsContract;

    receive() external payable{}

    constructor(){
        admin = msg.sender;
    }

    function releaseFunds() public payable{
        require(msg.sender == admin, "only admin function");

        payable(crypticketsContract).transfer(address(this).balance);

        
    }

    function setTicketContract(address _ticketAddress) public {
        require(msg.sender == admin, "only admin");
        crypticketsContract = _ticketAddress;
    }
}