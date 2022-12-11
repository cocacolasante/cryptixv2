// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ICryptickets{
    function purchaseTickets(uint amount) external payable;
    function returnAllOwners() external view returns(address[] memory);

    function refundAllTickets() external payable;
    function payBandAndVenue() external payable;

    function transferFrom(address from, address to, uint256 tokenId) external;

    function setMaxSupply(uint _maxSupply) external;
    
}