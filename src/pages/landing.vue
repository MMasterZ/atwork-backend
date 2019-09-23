<template>
  <div>123</div>
</template>

<script>
export default {
  mounted() {
    this.$router.push(
      "/dialog/edit/" + this.$route.params.key + "/" + this.$route.params.page
    );
  }
};
</script>

<style scoped>
</style>