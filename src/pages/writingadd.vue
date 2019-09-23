<template>
  <div class="bg">
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <q-space />
        <q-toolbar-title
          class="col-10 mobile-only text-white text-h5"
          align="center"
        >{{titleName}}</q-toolbar-title>
        <q-toolbar-title
          class="col-11 desktop-only text-white text-h4"
          align="center"
        >{{titleName}}</q-toolbar-title>
        <q-space />
      </q-toolbar>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      titleName: "เพิ่มข้อมูล"
    };
  },
  methods: {}
};
</script>
<style scoped >
</style>