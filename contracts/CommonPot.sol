// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CommonPot {

  mapping(address => bool) public ownerMapping;

  event OwnerChange(
    address indexed _owner,
    bool _isOwner
  );

  event PotTransfer(
    address indexed _sender,
    uint _amount,
    uint _total
  );

  event PotWithdraw(
    address indexed _receiver,
    uint _amount,
    uint _total
  );

  constructor(address firstOwner) {
    ownerMapping[firstOwner] = true;
    emit OwnerChange(firstOwner, true);
  }

  modifier restricted {
    require(ownerMapping[msg.sender], "Only an owner can call this function");
    _;
  }

  receive() external payable {
    emit PotTransfer(msg.sender, msg.value, address(this).balance);
  }

  function withdraw(uint _amount, address payable _address) external restricted {
    _address.transfer(_amount);
    emit PotWithdraw(msg.sender, _amount, address(this).balance);

  }

  function withdraw(uint _amount) external restricted {
    this.withdraw(_amount, payable(msg.sender));
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
