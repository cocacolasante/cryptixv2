// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interfaces/ICryptickets.sol";

contract CheckTix{
    address public validator;
    address public show;

    mapping(uint => bool) public checkedIn;

    constructor(address _showAdd){
        show = _showAdd;
        validator = msg.sender;
    }

    function checkInNft(uint nftNumber) public returns(bool){
        require(msg.sender == validator, "validator");
        require(checkedIn[nftNumber] == false, "already checked in");

        checkedIn[nftNumber] = true;

        return true;
        
    }

    function viewCheckedIn(uint nftNum) public view returns(bool){
        return checkedIn[nftNum];

    }

    function viewListChecked() public view returns(uint[] memory){
        uint[] memory tixRedemed;
        uint maxSup = ICryptickets(show).maxSupply();
        for(uint i; i< maxSup; i++){
            if(checkedIn[i]==true){
                tixRedemed[i] = i;
            }
        }
        return tixRedemed;
    }

    
}