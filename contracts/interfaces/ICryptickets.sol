// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ICryptickets{
    function purchaseTickets(uint amount) external payable;
    function returnAllOwners() external view returns(address[] memory);

    function refundAllTickets() external payable;
    function payBandAndVenue() external payable;

    function transferFrom(address from, address to, uint256 tokenId) external;

    function setMaxSupply(uint _maxSupply) external;

    function changeAdmin(address _controller) external;
    function setEndDate(uint newEndDate) external;
    function setTicketPrice(uint newPrice) external;
    function setCancelledShow() external;
    function requestRefund() external;
    function changeShowDate(uint _newShowDate) external;
}