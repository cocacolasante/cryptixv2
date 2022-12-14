// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ICreateController {
    function createController(uint showNum, address _band, address _venue, address tickets)external returns(address);
}