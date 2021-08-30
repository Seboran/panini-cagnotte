<template>
  <h3>Actions</h3>
  <div
    v-for="action in actions"
    class="list-group-item d-flex justify-content-between align-end"
    :key="action.name"
  >
    {{ action.name }}
  </div>
</template>

<script>
export default {
  data: () => ({
    actions: [
      { name: "Add member" },
      { name: "Add funds" },
      { name: "Withdraw funds" },
      { name: "Remove member" },
    ],
  }),
};
</script>