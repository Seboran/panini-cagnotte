const truffleAssert = require('truffle-assertions')

const TestCommonPot = artifacts.require('CommonPot')

contract('TestCommonPot', (accounts) => {
  it('should create first owner', async function () {
    const instance = await TestCommonPot.deployed()
    const isOwner = await instance.isOwner.call(accounts[0])
    assert.isTrue(isOwner, 'first address should be owner')
    const isNotOwner = await instance.isOwner.call(accounts[1])
    assert.isNotTrue(isNotOwner, 'second address should not be owner')
  })

  it('should add new owner', async () => {
    const instance = await TestCommonPot.deployed()
    const response = await instance.addOwner(accounts[1], { from: accounts[0] })
    const isOwner = await instance.isOwner.call(accounts[1], {
      from: accounts[0],
    })
    assert.isTrue(isOwner, 'second address should be an owner')
  })

  it('should fire event when adding owner', async () => {
    const instance = await TestCommonPot.deployed()
    const response = await instance.addOwner(accounts[1], { from: accounts[0] })
    const { event, args } = response.logs[0]
    assert.equal(event, 'OwnerChange', 'Invalid event name')
    const { _owner, _isOwner } = args
    assert.equal(_owner, accounts[1], 'Invalid new owner')
    assert.isTrue(_isOwner, 'Invalid new owner event')
  })

  it('should fire event when removing owner', async () => {
    // Initialization
    const instance = await TestCommonPot.deployed()
    await instance.addOwner(accounts[1], { from: accounts[0] })

    // Remove owner
    const response = await instance.removeOwner(accounts[1], {
      from: accounts[0],
    })

    const { event, args } = response.logs[0]
    assert.equal(event, 'OwnerChange', 'Invalid event name')
    const { _owner, _isOwner } = args
    assert.equal(_owner, accounts[1], 'Invalid new owner')
    assert.isFalse(_isOwner, 'Invalid new owner event')
  })

  it('should restrict owner addition to current owners', async () => {
    const instance = await TestCommonPot.deployed()
    await truffleAssert.fails(
      instance.addOwner(accounts[1], { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT,
    )
  })

  it('should restrict owner removal to current owners', async () => {
    const instance = await TestCommonPot.deployed()
    await truffleAssert.fails(
      instance.removeOwner(accounts[0], { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT,
    )
  })
})
