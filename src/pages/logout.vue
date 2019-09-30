<template>
  <div style="overflow: hidden;">
    <transition
      appear
      enter-active-class="animated bounceInDown"
      leave-active-class="animated bounceOutUp"
    >
      <div class="row my-hv justify-center items-center relative-position" v-show="isLoadData">
        <div
          class="bg-grey-2 rounded-borders relative-position shadow-4"
          style="max-width: 360px; width:90%; height: fit-content"
          align="center"
        >
          <div
            class="bg-secondary absolute-top rounded-borders q-pa-xs"
            style="width:50px; height: calc(100vh - 50%); margin: auto; top: calc(-100vh + 260px)"
          >
            <div class="rounded-borders full-width full-height" style="border: 1px dashed black"></div>
          </div>
          <div class="bg-blue-grey-10 rounded-borders">
            <div class="q-pa-sm" align="center">
              <div class="my-border rounded-borders bg-black"></div>
            </div>
            <div class="row justify-center text-white">
              <div>
                <img class style="width:50px; " src="../assets/loginxs.png" alt />
              </div>
              <div class="q-px-sm" style="height: 30px; line-height: 30px">
                <span class="text-h5">Winner@work</span>
              </div>
            </div>
          </div>
          <div class="q-pt-md q-px-md q-pb-lg">
            <div align="center" class="text-h5">
              <span>ออกจากระบบ</span>
            </div>

            <div class="q-pt-lg" align="center">
              <q-img :src="'../statics/avatar/' + showUser.avatar + '.png'" style="width:120px" />
            </div>
            <div align="center" class="q-pt-md text-h6">
              <span>{{showUser.name}}</span>
            </div>

            <div align="center" class="q-pt-lg">
              <q-btn
                @click="logoutHere()"
                color="secondary"
                style="width: 100%;"
                :disable="!isLoadData"
              >เฉพาะอุปกรณ์ปัจจุบัน</q-btn>
            </div>
            <div align="center" class="q-pt-md">
              <q-btn
                @click="logoutAll()"
                color="secondary"
                style="width: 100%;"
                :disable="!isLoadData"
              >อุปกรณ์ทั้งหมด</q-btn>
            </div>
            <div align="center" class="q-pt-md">
              <q-btn
                @click="cancelBtn()"
                color="grey-2"
                text-color="black"
                style="width: 100%;"
                :disable="!isLoadData"
              >กลับสู่โปรแกรม</q-btn>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      showUser: {},
      isLoadData: false
    };
  },
  methods: {
    loadData() {
      db.collection("SystemAccounts")
        .doc(this.SystemAccounts.key)
        .onSnapshot(data => {
          this.showUser = data.data();
          this.isLoadData = true;
        });
    },
    logoutAll() {
      // console.log("All");
      db.collection("SystemAccounts")
        .doc(this.SystemAccounts.key)
        .update({
          userKey: Math.floor(Math.random() * 9999999999 + 1)
        })
        .then(() => {
          // this.$q.notify({
          //   message: "ออกจากระบบเรียบร้อยแล้ว",
          //   color: "secondary",
          //   position: "top",
          //   timeout: 1000
          // });
        });
    },
    logoutHere() {
      // console.log("Here");
      // this.$q.notify({
      //   message: "ออกจากระบบเรียบร้อยแล้ว",
      //   color: "secondary",
      //   position: "top",
      //   timeout: 1000
      // });
      this.$q.localStorage.set("systemAccountData", "");
      this.$router.push("/");
    },
    cancelBtn() {
      this.isLoadData = false;
      setTimeout(() => {
        this.$router.push(this.$q.localStorage.getItem("currentPage"));
      }, 1000);
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
<style>
.my-hv {
  height: 100vh;
}

.my-border {
  border: 1px solid white;
  width: 60px;
  height: 12px;
}
.my-box {
  width: 360px;
  height: calc(100vh - 60%);
}
.animated {
  animation-duration: 1.5s;
}
</style>
