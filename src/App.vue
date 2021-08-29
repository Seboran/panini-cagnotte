<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>{{ commonPotTotalEther }} ETH</div>
</template>

<script>
import web3 from "./contracts/web3.js";
import { abi, address } from "./contracts/CommonPot";

const CommonPot = new web3.eth.Contract(abi, address)

export default {
  name: "App",
  data: () => ({
    commonPotTotalEther: 0,
  }),
  mounted: async function () {
    this.updateCommonPotTotalEther();
    CommonPot.events
      .PotTransfer()
      .on("data", () => {
        this.updateCommonPotTotalEther();
      });
  },
  methods: {
    updateCommonPotTotalEther: async function () {
      this.commonPotTotalEther = web3.utils.fromWei(
        await web3.eth.getBalance(CommonPot.options.address)
      );
    },
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
</style>
