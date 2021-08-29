// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CommonPot {

  mapping(address => bool) public ownerMapping;

  event OwnerChange(
    address indexed _owner,
    bool _isOwner
  );

  constructor(address firstOwner) {
    ownerMapping[firstOwner] = true;
    emit OwnerChange(firstOwner, true);
  }

  modifier restricted {
    require(ownerMapping[msg.sender], "Only an owner can call this function");
    _;
  }

  function isOwner(address person) public view returns (bool) {
    return this.ownerMapping(person);
  }

  function addOwner(address person) public restricted {
    ownerMapping[person] = true;
    emit OwnerChange(person, true);
  }

  function removeOwner(address person) public restricted {
    ownerMapping[person] = false;
    emit OwnerChange(person, false);
  }
}
