<template>
  <h3>Addresses</h3>
  <div
    v-for="address in members"
    class="list-group-item d-flex justify-content-between"
    :key="address"
  >
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