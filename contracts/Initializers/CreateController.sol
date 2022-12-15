// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../ControlShow.sol";
import "../Cryptickets.sol";

contract CreateController{

    function createController(uint showNum, address _band, address _venue, address _ticketContract)public returns(address){
        ControlShow newController = new ControlShow(showNum, _band, _venue);

        newController.setTicketContract(_ticketContract);
        
        return address(newController);

    }

    function createTicket(string memory _name, string memory _symbol, address _escrowAddress, address _bandAddress, address _venueAddress, uint _endDate, uint _price) public returns(address){
        Cryptickets newTicket = new Cryptickets(_name, _symbol,_escrowAddress, _bandAddress, _venueAddress, _endDate,_price );
        newTicket.changeAdmin(msg.sender);

        return address(newTicket);
        
    }

    
}