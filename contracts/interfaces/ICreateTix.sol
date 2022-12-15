// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ICreateTickets {
    function createTicket(string memory _name, string memory _symbol, address _escrowAddress, address _bandAddress, address _venueAddress, uint endDate, uint price) external returns(address);

}