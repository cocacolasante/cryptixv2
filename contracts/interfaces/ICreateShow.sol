// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ICreateShow {

    struct Show{
        uint numberOfShow;
        address ticketAddress;
        address escrowAddress;
        address band;
        address venue;
        bool completed;
    }
    
    function returnShow(uint showNum) external view returns(Show memory);

    
}