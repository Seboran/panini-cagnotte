const TestCommonPot = artifacts.require('CommonPot')

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('TestCommonPot', (accounts) => {
  it('should create first owner', async function () {
    const instance = await TestCommonPot.deployed()
    const isOwner = await instance.isOwner.call(accounts[0])
    assert.isTrue(isOwner, 'first address should be owner')
    const isNotOwner = await instance.isOwner.call(accounts[1])
    assert.isNotTrue(isNotOwner, 'second address should not be owner')
  })
})
