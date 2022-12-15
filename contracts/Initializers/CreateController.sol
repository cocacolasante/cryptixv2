// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../ControlShow.sol";

contract CreateController{

    function createController(uint showNum, address _band, address _venue, address _ticketContract)public returns(address){
        ControlShow newController = new ControlShow(showNum, _band, _venue);

        newController.setTicketContract(_ticketContract);
        
        return address(newController);

    }



    
}