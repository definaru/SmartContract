/*
This file is miningContract.

The SimpleCrowdsale Contract is free software: you can redistribute it and/or modify it under the terms of the GNU 
lesser General Public License as published by the Free Software Foundation, either version 3 of the License, 
or (at your option) any later version.
The SimpleCrowdsale Contract is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without 
even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU lesser General Public 
License for more details.

You should have received a copy of the GNU lesser General Public License along with the NeuroDAO Contract. If not, 
see <http://www.gnu.org/licenses/>.

@author Inc. Defina <info@defina.ru>
*/

pragma solidity ^0.4.0;

contract owned {

    address public owner;
    address public candidate;

    function owned() payable {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    function changeOwner(address owner) onlyOwner public {
        candidate = _owner;
    }

    function confirmOwner() public {
        require(candidate == msg.sender);
        owner = candidate;
    }

}

contract Crowdsale is owned {
    unit256 public totalSupply;
    mapping (address => unit256) public balanceOf;

    event Transfer(address indexed from, address indexed to, unit256 value);
    
    function Crowdsale() payable owned(){

        totalSupply = 250000000;
        balanceOf[this] = 200000000;
        balanceOf[owned] = totalSupply - balanceOf[this];
        Transfer(this, owner, balanceOf[owner]);
    }

    function () payable {
        require(balanceOf[this] > 0);
        uint256 tokens = 5000 * msg.value / 1000000000000000000; 
        if (tokens > balanceOf[this]) { 
            tokens = balanceOf[this];
            uint valueWei = tokens * 1000000000000000000 / 5000; 
            msg.sender.transfer(msg.value - valueWei);
        }
        require(tokens > 0); 
        balanceOf[msg.sender] += tokens; 
        balanceOf[this] -= tokens;
        Transfer(this, msg.sender, tokens);
    }

    contract Token is Crowdsale {

        string public standard    = 'SC Defina v0.0.2';
        string public name        = 'MyMining';
        string public symbol      = "MMT";
        uint8 public decimals     = 18;

        function Token() payable Crowdsale() {}

        function transfer(address to, uint256 value) public {
            require(balanceOf[msg.sender] >= _value); 
            balanceOf[msg.sender] -= _value; 
            balanceOf[_to] += _value;
            Transfer(msg.sender, _to, _value);
        }
    }


    contract SimpleContract is Token {

        function SimpleContract() payable Token() {}
        
        function wlthdraw() public onlyOwner { 
            // require(balanceOf[this] == 0);
            owner.transfer(this.balance);
        }
        function killMe() public onlyOwner { 
            selfdestruct(owner);
        }
    }

}
