// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Escrow{
    address private admin;
    address private crypticketsContract;

    constructor(address _cryptickets){
        admin = msg.sender;
        crypticketsContract = _cryptickets;
    }

    function releaseFunds() public payable{
        require(msg.sender == admin, "only admin function");

        payable(crypticketsContract).transfer(address(this).balance);

        
    }
}