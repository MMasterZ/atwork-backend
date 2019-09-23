<template>
  <div class="bg">
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <q-space />
        <q-toolbar-title
          class="col-10 mobile-only text-white text-h5"
          align="center"
        >writing</q-toolbar-title>
        <q-toolbar-title
          class="col-11 desktop-only text-white text-h4"
          align="center"
        >writing</q-toolbar-title>
        <q-space />
        <div
          align="right"
          class="col-xs-2 col-md-1 q-px-md"
        >
          <q-btn
            @click="addBtn()"
            size="md"
            color="secondary"
            round
            icon="fas fa-plus"
            class="text-body1 text-white"
          />
        </div>
      </q-toolbar>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {};
  },
  methods: {
    addBtn() {
      this.$router.push("/writing/add");
    }
  }
};
</script>
<style scoped >
</style>