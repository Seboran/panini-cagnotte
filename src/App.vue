<template>
  <div class="container">
    <main>
      <div class="row g-2">
        <h1 class="col-md-6">Common pot</h1>
        <h2 class="col-md-6">
          Total: {{ commonPotTotalEther }} ETH
        </h2>
      </div>
      <div class="row g-5">
        <div class="col-md-9"><Members :members="addresses" /></div>
        <div class="col-md-3"><Actions /></div>
      </div>
    </main>
  </div>
</template>

<script>
import web3 from "./contracts/web3.js";
import { abi, address } from "./contracts/CommonPot";
import Members from "./components/Members.vue";
import Actions from "./components/Actions.vue";

const CommonPot = new web3.eth.Contract(abi, address);
// console.log(CommonPot);

export default {
  name: "App",
  components: {
    Members,
    Actions,
  },
  data: () => ({
    commonPotTotalEther: 0,
    addresses: [],
    subscriptions: [],
  }),
  mounted: async function () {
    this.updateCommonPotTotalEther();
    const potTransferEvent = CommonPot.events.PotTransfer().on("data", () => {
      this.updateCommonPotTotalEther();
    });
    this.updateAddresses();
    const ownerChangeEvent = CommonPot.events.OwnerChange().on("data", () => {
      this.updateAddresses();
    });
    this.subscriptions.push(potTransferEvent);
    this.subscriptions.push(ownerChangeEvent);
  },
  methods: {
    updateAddresses: async function () {
      // Should retrieve all OwnerChange events and check who's still owner
      this.addresses = [
        "0x217A149bF04D19d5e347d945BB45d915F6cFB6d7",
        "0x4FD7E7D40c67C27bD11d886590a65cE6218d0aFF",
      ];
    },
    updateCommonPotTotalEther: async function () {
      this.commonPotTotalEther = web3.utils.fromWei(
        await web3.eth.getBalance(CommonPot.options.address)
      );
    },
  },
  beforeUnmount() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.container {
  max-width: 960px;
}
</style>
