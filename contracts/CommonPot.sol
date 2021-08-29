// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CommonPot {

  mapping(address => bool) public ownerMapping;

  constructor(address firstOwner) {
    ownerMapping[firstOwner] = true;
  }

  modifier restricted {
    require(ownerMapping[msg.sender], "Only an owner can call this function");
    _;
  }

  function isOwner(address person) public view returns (bool) {
    return this.ownerMapping(person);
  }
}
