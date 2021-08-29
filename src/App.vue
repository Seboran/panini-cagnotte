<template>
  <div class="container">
    <main>
      <h1>Common pot</h1>
      <div>Total common pot balance: {{ commonPotTotalEther }} ETH</div>
      <div class="row g-5">
        <div class="col-md-5 col-lg-4"><Members :members="addresses" /></div>
        <div class="col-md-7 col-lg-8"><Actions /></div>
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
      this.addresses = ["test"];
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
