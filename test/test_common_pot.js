const truffleAssert = require('truffle-assertions')

const TestCommonPot = artifacts.require('CommonPot')

contract('TestCommonPot', (accounts) => {
  contract('Test ownership', () => {
    contract('First owner', () => {
      it('should create first owner', async function () {
        const instance = await TestCommonPot.deployed()
        const isOwner = await instance.isOwner.call(accounts[0])
        assert.isTrue(isOwner, 'first address should be owner')
        const isNotOwner = await instance.isOwner.call(accounts[1])
        assert.isNotTrue(isNotOwner, 'second address should not be owner')
      })
    })
    contract('Add new owner', () => {
      it('should add new owner', async () => {
        const instance = await TestCommonPot.deployed()
        await instance.addOwner(accounts[1], {
          from: accounts[0],
        })
        const isOwner = await instance.isOwner.call(accounts[1], {
          from: accounts[0],
        })
        assert.isTrue(isOwner, 'second address should be an owner')
      })
    })
    contract('Get right to add new owner', () => {
      it('should allow to add a new owner', async () => {
        const instance = await TestCommonPot.deployed()
        await instance.addOwner(accounts[1], {
          from: accounts[0],
        })
        await instance.addOwner(accounts[2], {
          from: accounts[1],
        })
        const isOwner = await instance.isOwner.call(accounts[2], {
          from: accounts[0],
        })
        assert.isTrue(isOwner, 'third address should be an owner')
      })
    })

    contract('Remove owner', () => {
      it('should remove owner', async () => {
        const instance = await TestCommonPot.deployed()
        await instance.addOwner(accounts[1], { from: accounts[0] })
        await instance.removeOwner(accounts[1], { from: accounts[0] })
        const isOwner = await instance.isOwner.call(accounts[1], {
          from: accounts[0],
        })
        assert.isFalse(isOwner, 'second address should be an owner')
      })
    })

    contract('Remove owner', () => {
      it('should fire event when adding owner', async () => {
        const instance = await TestCommonPot.deployed()
        const response = await instance.addOwner(accounts[1], {
          from: accounts[0],
        })
        const { event, args } = response.logs[0]
        assert.equal(event, 'OwnerChange', 'Invalid event name')
        const { _owner, _isOwner } = args
        assert.equal(_owner, accounts[1], 'Invalid new owner')
        assert.isTrue(_isOwner, 'Invalid new owner event')
      })
    })

    contract('Fire event removing', () => {
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
    })
  })

  contract('Restrict owner addition', () => {
    it('should restrict owner addition to current owners', async () => {
      const instance = await TestCommonPot.deployed()
      await truffleAssert.fails(
        instance.addOwner(accounts[1], { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT,
      )
      const isOwner = await instance.isOwner.call(accounts[1], {
        from: accounts[0],
      })
      assert.isFalse(isOwner, 'Rejected account should not be owner')
    })
  })

  contract('Restrict owner removal', (accounts) => {
    it('should restrict owner removal to current owners', async () => {
      const instance = await TestCommonPot.deployed()
      await truffleAssert.fails(
        instance.removeOwner(accounts[0], { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT,
      )
      const isOwner = await instance.isOwner.call(accounts[0], {
        from: accounts[0],
      })
      assert.isTrue(isOwner, 'First address should still has ownership')
    })
  })

  contract('Payment', (accounts) => {
    it('should accept payments and fire events', async () => {
      const instance = await TestCommonPot.deployed()
      const gweiToSend = 100000000000
      const response = await instance.send(gweiToSend, {
        from: accounts[0],
      })

      // Check event
      const { event, args } = response.logs[0]
      assert.equal(event, 'PotTransfer', 'Invalid event name')
      const { _sender, _amount, _total } = args
      assert.equal(_sender, accounts[0], 'Invalid sender')
      assert.equal(_amount, gweiToSend, 'Invalid gwei amount')
      assert.equal(_total, gweiToSend, 'Invalid total')

      // Check total balance
      const contractBalance = await web3.eth.getBalance(instance.address)
      assert.equal(contractBalance, gweiToSend, 'Invalid balance')
    })
  })

  contract('Withdrawal', (accounts) => {
    it('should restrict withdrawals', async () => {
      const instance = await TestCommonPot.deployed()
      const gweiToSend = 10
      await instance.send(gweiToSend, {
        from: accounts[0],
      })

      //
      const gweiToWithdraw = 5
      await truffleAssert.fails(
        instance.methods['withdraw(uint256)'](gweiToWithdraw, {
          from: accounts[1],
        }),
        truffleAssert.ErrorType.REVERT,
      )
    })
  })

  contract('Withdrawal', (accounts) => {
    it('should allow withdrawals', async () => {
      const instance = await TestCommonPot.deployed()
      const gweiToSend = "1000000000000000000"
      const account1Balance = await web3.eth.getBalance(accounts[1])
      await instance.send(gweiToSend, {
        from: accounts[0],
      })

      await instance.addOwner(accounts[1], { from: accounts[0] })

      const gweiToWithdraw = "100000000000000000"

      const response = await instance.methods['withdraw(uint256)'](
        gweiToWithdraw,
        {
          from: accounts[1],
          gasPrice: 0,
        },
      )


      // Check event
      const { event, args } = response.logs[0]
      assert.equal(event, 'PotWithdraw', 'Invalid event name')
      const { _receiver, _amount, _total } = args
      assert.equal(_receiver, accounts[1], 'Invalid sender')
      assert.equal(_amount, gweiToWithdraw, 'Invalid gwei amount')
      assert.equal(_total, gweiToSend - gweiToWithdraw, 'Invalid total')

      // Check balance
      const newAccount1Balance = await web3.eth.getBalance(accounts[1])
      console.log('previous', account1Balance)
      console.log('next', newAccount1Balance, typeof Number(newAccount1Balance))
      console.log("difference", newAccount1Balance - account1Balance)
      assert.equal(
        BigInt(newAccount1Balance) - BigInt(account1Balance),
        BigInt(gweiToWithdraw),
        'Not valid amount',
      )
    })
  })
})
