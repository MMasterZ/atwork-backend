<template>
  <q-page class>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">บทเรียน</div>
        <div class="desktop-only text-grey-2 text-h4">บทเรียน</div>
        <q-space />
      </q-toolbar>
    </div>
    <div class="q-pa-sm-sm">
      <div>
        <div class="row">
          <div class="q-pa-sm col-lg-3 col-md-4 col-sm-6 col-xs-12">
            <div class="bg-grey-2 rounded-borders">
              <div style="height:30px" class="col-12 bg-primary text-grey-2 border"></div>
              <div class="boxadd q-pa-sm bg-grey-2">
                <q-btn class="bg-grey-2" @click="addBtn()" align="left" style="width:100%">
                  <q-icon size="40px" color="primary" round name="fas fa-plus-circle" />

                  <div class="text-body1" style="width:70%" align="center">เพิ่ม</div>
                </q-btn>
              </div>
            </div>
          </div>
          <div
            v-for="(item,index ) in prositionList  "
            :key="index"
            class="q-pa-sm col-lg-3 col-md-4 col-sm-6 col-xs-12"
          >
            <div class="bg-grey-2 rounded-borders row">
              <div class="col-12 bg-secondary text-grey-2 border">
                <div class="q-py-xs q-px-md">{{item.orderid}}</div>
              </div>
              <div class="col-12 box">
                <q-toolbar class="q-pa-sm transparent">
                  <q-btn
                    v-show="item.status"
                    @click="powerOn(item.key)"
                    dense
                    size="lg"
                    class="icons shadow-2"
                    flat
                    color="secondary"
                    icon="fas fa-power-off"
                  />

                  <q-btn
                    v-show="item.status == false"
                    @click="powerOff(item.key)"
                    dense
                    size="lg"
                    class="icons shadow-2"
                    flat
                    color="negative"
                    icon="fas fa-power-off"
                  />

                  <q-toolbar-title
                    @click="editBtn(item.key)"
                    align="center"
                    class="card q-ml-sm shadow-2 rounded-borders cursor-pointer"
                  >
                    <span class="text-body1">{{item.name}}</span>
                  </q-toolbar-title>
                </q-toolbar>
              </div>
            </div>
          </div>
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
      mode: true,
      prositionList: []
    };
  },
  methods: {
    // ปุมการเปิดแผนก
    powerOn(key) {
      this.mode = false;

      db.collection("Position")
        .doc(key)
        .update({
          status: false
        });
      this.notifyRed("ปิดการใช้งาน");
    },
    // ปุ่มการปิดแผนก
    powerOff(key) {
      this.mode = true;

      db.collection("Position")
        .doc(key)
        .update({
          status: true
        });
      this.notifyGreen("เปิดการใช้งาน");

      this.mode = true;
    },
    // ปุ่มเพิ่มข้อมูล
    addBtn() {
      this.$router.push("/position/add");
    },
    // การแก้ไขข้อมูล
    editBtn(key) {
      this.$router.push("/position/edit/" + key);
    },
    // การโหลดตำแหน่งออกมาโชว์
    loadPosition() {
      this.loadingShow();
      db.collection("Position").onSnapshot(doc => {
        this.prositionList = [];
        doc.forEach(element => {
          let dataKey = {
            key: element.id
          };
          let final = {
            ...dataKey,
            ...element.data()
          };
          this.loadingHide();
          this.prositionList.push(final);
          this.prositionList.sort((a, b) => {
            return a.orderid - b.orderid;
          });
        });
      });
    }
  },
  mounted() {
    this.loadPosition();
  }
};
</script>
<style scoped>
.border {
  height: 30px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.box {
  height: 65px;
}
.btnPlus {
  width: 50px;
  height: 50px;
}
.boxBtn {
  height: 50px;
}
.boxaddtop {
  width: 50px;
}
.boxadd {
  height: 65px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

.icons {
  width: 50px;
  height: 50px;
}
.card {
  line-height: 50px;
  height: 50px;
}
</style>
