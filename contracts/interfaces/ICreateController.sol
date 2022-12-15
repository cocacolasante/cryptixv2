// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ICreateController {
    function createController(uint showNum, address _band, address _venue, address tickets)external returns(address);

    function createTicket(string memory _name, string memory _symbol, address _escrowAddress, address _bandAddress, address _venueAddress, uint endDate, uint price) external returns(address);
}