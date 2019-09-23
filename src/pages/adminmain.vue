<template>
  <q-page class>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">

        <q-toolbar-title
          class="col-12 mobile-only text-white text-h5"
          align="center"
        >ผู้ดูแลระบบ</q-toolbar-title>
        <q-toolbar-title
          class="col-12 desktop-only text-white text-h4"
          align="center"
        >ผู้ดูแลระบบ</q-toolbar-title>

      </q-toolbar>
    </div>
    <div class="row q-pa-sm">
      <div class="col-xs-6 col-md-3 col-lg-2 q-pa-sm">
        <div
          class="rounded-borders shadow-2 bg-white cursor-pointer"
          @click="addBtn()"
        >
          <div
            class="rounded-borders"
            style="height: 120px; line-height: 120px"
            align="center"
          >
            <q-icon
              center
              size="70px"
              name="fas fa-plus-circle"
              color="secondary"
            />
          </div>
          <div
            align="center"
            style="height: 30px; line-height: 30px"
          >Add new</div>
        </div>
      </div>

      <div
        class="col-xs-6 col-md-3 col-lg-2 q-pa-sm"
        v-for="(i , index) in systemAccList"
        :key="index"
      >
        <div
          class="rounded-borders shadow-2 bg-white cursor-pointer"
          @click="editBtn(i.key)"
        >
          <div
            class="bg-blue-grey-10 rounded-borders"
            style="height: 120px; line-height: 120px"
            align="center"
          >
            <q-img
              :src="'../statics/avatar/' + i.avatar + '.png'"
              style="width:90px"
            />
          </div>
          <div
            style="height: 30px; line-height: 30px"
            align="center"
          >{{i.name}}</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      systemAccList: []
    };
  },
  methods: {
    addBtn() {
      this.$router.push("/admin/add");
    },
    editBtn(key) {
      this.$router.push("/admin/edit/" + key);
    },
    loadData() {
      this.$q.loading.show({
        message: "กรุณารอสักครู่..."
      });
      db.collection("SystemAccounts")
        .where("status", "==", true)
        .get()
        .then(doc => {
          doc.forEach(element => {
            let dataKey = { key: element.id };
            let final = { ...dataKey, ...element.data() };
            this.systemAccList.push(final);
          });
          this.systemAccList.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          });
          this.$q.loading.hide();
        });
    }
  },
  mounted() {
    if (this.SystemAccounts.tel != "admin") {
      this.$router.push(this.currentPage);
    } else {
      this.loadData();
    }
  }
};
</script>
<style>
.btnShow {
  width: 150px;
  height: 150px;
}
.boxUser {
  width: 150px;
}
</style>
