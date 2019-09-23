<template>
  <div class="bg">
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <q-space />
        <q-toolbar-title class="col-10 mobile-only text-white text-h5" align="center">การเขียน</q-toolbar-title>
        <q-toolbar-title class="col-11 desktop-only text-white text-h4" align="center">การเขียน</q-toolbar-title>
        <q-space />
      </q-toolbar>
    </div>
    <div style="height:calc(100vh - 135px); background-color:rgba(255,255,255,0.5)">
      <div class="relative-position">
        <div style="height:calc(100vh - 135px);"></div>
        <div class="absolute-center">
          <img style="width:300px; height:300px" src="../assets/comingsoon.png" alt />

          <div align="center" class="text-h5">
            Coming Soon
            <br />แล้วพบกันเร็วๆ นี้
          </div>
        </div>
      </div>
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