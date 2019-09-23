<template>
  <div class="bg">
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <q-space />
        <q-toolbar-title class="col-10 mobile-only text-white text-h5" align="center">บทสนทนา</q-toolbar-title>
        <q-toolbar-title class="col-11 desktop-only text-white text-h4" align="center">บทสนทนา</q-toolbar-title>
        <q-space />

        <div align="right" class="col-xs-2 col-md-1 q-px-md">
          <q-btn
            @click="syncBtn()"
            size="md"
            color="secondary"
            round
            icon="fas fa-sync-alt"
            class="text-body1 text-white"
            :disable="tabShow == 'server'"
          />
        </div>
      </q-toolbar>
    </div>

    <div class="q-pa-md-md">
      <div class="bg-grey-2">
        <div>
          <q-tabs
            v-model="tabShow"
            align="left"
            class="shadow-2 text-blue-grey-10"
            inline-label
            active-color="secondary"
            indicator-color="secondary"
          >
            <q-tab name="draft" icon="fas fa-pen" label="แบบร่าง" />
            <q-tab name="server" icon="fas fa-cloud" label="เซิร์ฟเวอร์" />
          </q-tabs>
        </div>

        <!-- แบบร่าง -->
        <div v-show="tabShow == 'draft'" class="q-pa-md">
          <div class="q-pb-md row">
            <div class="col-md-6 col-xs-12">
              <q-select
                outlined
                v-model="positionID"
                :options="optionsPosition"
                label="ตำแหน่ง"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6 col-xs-12 self-center" align="right">
              <q-btn
                @click="addBtn()"
                size="md"
                color="secondary"
                round
                icon="fas fa-plus"
                class="text-body1 text-white"
              />
            </div>
          </div>
          <div
            class="row q-pa-md"
            style="border: 1px solid #E0E0E0"
            v-for="(i , index) in dialogList"
            :key="index"
          >
            <div class="col-md-3" style="width: 370px:">
              <q-video :src="i.url" />
            </div>
            <div class="col-md-9 q-pl-lg">
              <div class="row justify-end">
                <div>
                  <q-btn
                    @click="deleteBtn(i.key)"
                    size="md"
                    color="secondary"
                    round
                    icon="fas fa-trash-alt"
                    class="text-body1 text-white"
                  />
                </div>
                <div class="q-pl-md">
                  <q-btn
                    @click="editBtn(i.key)"
                    size="md"
                    color="secondary"
                    round
                    icon="fas fa-edit"
                    class="text-body1 text-white"
                  />
                </div>
                <div class="q-pl-md">
                  <q-btn
                    @click="printBtn(i.key)"
                    size="md"
                    color="secondary"
                    round
                    icon="fas fa-print"
                    class="text-body1 text-white"
                  />
                </div>
              </div>
              <div class="q-pa-md">
                <span class="text-h6">{{i.situationEng}}</span>
              </div>
              <div class="q-pa-md">
                <span class="text-h6">{{i.situationThai}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- เซิร์ฟเวอร์ -->
        <div v-show="tabShow == 'server'" class="q-pa-md">
          <div class="q-pb-md row">
            <div class="col-md-6 col-xs-12">
              <q-select
                outlined
                v-model="positionIDServer"
                :options="optionsPositionServer"
                label="ตำแหน่ง"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6 col-xs-12 self-center" align="right">
              <q-btn
                @click="addBtn()"
                disable
                size="md"
                color="secondary"
                round
                icon="fas fa-plus"
                class="text-body1 text-white"
              />
            </div>
          </div>
          <div
            class="row q-pa-md"
            style="border: 1px solid #E0E0E0"
            v-for="(i , index) in dialogListServer"
            :key="index"
          >
            <div class="col-md-3" style="width: 370px:">
              <q-video :src="i.url" />
            </div>
            <div class="col-md-9 q-pl-lg">
              <div class="row justify-end">
                <div>
                  <q-btn
                    disable
                    size="md"
                    color="secondary"
                    round
                    icon="fas fa-trash-alt"
                    class="text-body1 text-white"
                  />
                </div>
                <div class="q-pl-md">
                  <q-btn
                    disable
                    size="md"
                    color="secondary"
                    round
                    icon="fas fa-edit"
                    class="text-body1 text-white"
                  />
                </div>
                <div class="q-pl-md">
                  <q-btn
                    disable
                    size="md"
                    color="secondary"
                    round
                    icon="fas fa-print"
                    class="text-body1 text-white"
                  />
                </div>
              </div>
              <div class="q-pa-md">
                <span class="text-h6">{{i.situationEng}}</span>
              </div>
              <div class="q-pa-md">
                <span class="text-h6">{{i.situationThai}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      tabShow: "draft",
      addData: false,
      positionID: "",
      optionsPosition: [],
      dialogList: [],
      positionIDServer: "",
      optionsPositionServer: [],
      dialogListServer: [],
      isDraftMode: false
    };
  },
  methods: {
    syncBtn() {
      console.log("อัพข้อมูลเข้าระบบ จริง");
    },
    deleteBtn(key) {
      console.log("ลบไฟล์");

      this.$q
        .dialog({
          title: "ยืนยัน",
          message: "ยืนยันการลบ",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          db.collection("Dialog")
            .doc(key)
            .delete()
            .then(() => {
              this.loadDialog();
            });
        });
    },
    editBtn(key) {
      this.$router.push("/dialog/edit/" + key);
    },
    addBtn() {
      this.$router.push("/dialog/add");
    },
    printBtn(key) {
      console.log("ไปยังหน้าปริ้น");
    },
    loadPosition() {
      this.$q.loading.show();
      db.collection("Position")
        .where("status", "==", true)
        .get()
        .then(doc => {
          doc.forEach(element => {
            let data = {
              label: element.data().name,
              value: element.id
            };
            // let final = { ...dataId, ...data };
            // console.log(data);
            this.optionsPosition.push(data);
            this.optionsPosition.sort((a, b) => {
              return a.label > b.label ? 1 : -1;
            });
            this.positionID = this.optionsPosition[0].value;
            this.$q.loading.hide();
          });
          this.loadDialog();
        });
    },
    loadDialog() {
      // this.$q.loading.show();
      this.dialogList = [];
      db.collection("Dialog")
        .get()
        .then(doc => {
          doc.forEach(element => {
            let dialogKey = { key: element.id };
            let final = { ...dialogKey, ...element.data() };

            this.dialogList.push(final);
            // this.$q.loading.hide();
          });
        });
    },
    loadPositionServer() {
      this.$q.loading.show();
      db.collection("Position")
        .where("status", "==", true)
        .get()
        .then(doc => {
          doc.forEach(element => {
            let data = {
              label: element.data().name,
              value: element.id
            };
            // let final = { ...dataId, ...data };
            // console.log(data);
            this.optionsPositionServer.push(data);
            this.optionsPositionServer.sort((a, b) => {
              return a.label > b.label ? 1 : -1;
            });
            this.positionID = this.optionsPositionServer[0].value;
            this.$q.loading.hide();
          });
          this.loadDialogServer();
        });
    },
    loadDialogServer() {
      this.dialogList = [];
      db.collection("Dialog")
        .get()
        .then(doc => {
          doc.forEach(element => {
            let dialogKey = { key: element.id };
            let final = { ...dialogKey, ...element.data() };

            this.dialogListServer.push(final);
            // this.$q.loading.hide();
          });
        });
    }
  },
  mounted() {
    this.loadPosition();
    this.loadPositionServer();
  }
};
</script>
<style scoped >
</style>