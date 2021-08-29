<template>
  <h2>Addresses</h2>
  <div v-for="address in members" class="col themed-grid-col" :key="address">
    {{ address }}
  </div>
</template>

<script>
export default {
  props: {
    members: {
      type: Array,
      required: true,
    },
  },
};
</script>