// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IEscrow{
    function releaseFunds() external payable;
    function setTicketContract(address _ticketAddress) external;
    function rescheduledRefund(uint refundAmount) external;
}