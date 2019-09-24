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
            :disable="tabShow == 'server' || isSync"
            :class="{'bg-grey-7' : tabShow == 'server'}"
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
                @input="loadDialog()"
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
              <video :src="i.url" width="370px" controls></video>
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
                @input="loadDialogServer()"
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
                color="grey-7"
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
              <video :src="i.url" width="370px" controls></video>
            </div>
            <div class="col-md-9 q-pl-lg">
              <div class="row justify-end">
                <div>
                  <q-btn
                    disable
                    size="md"
                    color="grey-7"
                    round
                    icon="fas fa-trash-alt"
                    class="text-body1 text-white"
                  />
                </div>
                <div class="q-pl-md">
                  <q-btn
                    disable
                    size="md"
                    color="grey-7"
                    round
                    icon="fas fa-edit"
                    class="text-body1 text-white"
                  />
                </div>
                <div class="q-pl-md">
                  <q-btn
                    disable
                    size="md"
                    color="grey-7"
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
      // ตัวเลือกในหน้า แบบร่าง
      positionID: "",
      optionsPosition: [],
      dialogList: [],
      // ตัวเลือกในหน้า เซิร์ฟเวอร์
      positionIDServer: "",
      optionsPositionServer: [],
      dialogListServer: [],

      isDraftMode: false,
      isSync: false
    };
  },
  methods: {
    // ซิงค์ข้อมูลบน draft ไปยัง server
    async syncBtn() {
      //update server time
      let api = "https://api.winner-english.com/data/api/gettime.php";
      let response = await axios.get(api);
      let date = response.data[0].date;
      let microtime = response.data[0].microtime;

      this.loadingShow();
      // delete server
      await db
        .collection("Dialog")
        .doc("server")
        .collection("data")
        .get()
        .then(doc => {
          doc.forEach(data => {
            db.collection("Dialog")
              .doc("server")
              .collection("data")
              .doc(data.id)
              .delete();
          });
        });

      // สร้างเวลาตอน ซิงค์ข้อมูล
      db.collection("Dialog")
        .doc("server")
        .set({
          saveServer: microtime
        });

      // ซิงค์ข้อมูล draft ไปยัง server
      await db
        .collection("Dialog")
        .doc("draft")
        .collection("data")
        .get()
        .then(doc2 => {
          doc2.forEach(data2 => {
            db.collection("Dialog")
              .doc("server")
              .collection("data")
              .doc(data2.id)
              .set(data2.data())
              .then(() => {
                //copy sentence
                db.collection("Dialog")
                  .doc("draft")
                  .collection("data")
                  .doc(data2.id)
                  .collection("sentence")
                  .get()
                  .then(doc3 => {
                    doc3.forEach(data3 => {
                      db.collection("Dialog")
                        .doc("server")
                        .collection("data")
                        .doc(data2.id)
                        .collection("sentence")
                        .doc(data3.id)
                        .set(data3.data());
                    });
                  });
                //copy speaker
                db.collection("Dialog")
                  .doc("draft")
                  .collection("data")
                  .doc(data2.id)
                  .collection("speaker")
                  .get()
                  .then(doc4 => {
                    doc4.forEach(data4 => {
                      db.collection("Dialog")
                        .doc("server")
                        .collection("data")
                        .doc(data2.id)
                        .collection("speaker")
                        .doc(data4.id)
                        .set(data4.data())
                        .then(() => {
                          this.checkSyncData();
                          this.loadingHide();
                        });
                    });
                  });
              });
          });
        });
    },
    // ลบข้อมูล VDO ทั้งหมด
    deleteBtn(key) {
      this.$q
        .dialog({
          title: "ยืนยัน",
          message: "ยืนยันการลบ",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.loadingShow();
          let dbx = db
            .collection("Dialog")
            .doc("draft")
            .collection("data")
            .doc(key);

          dbx
            .collection("sentence")
            .get()
            .then(doc => {
              doc.forEach(data => {
                dbx
                  .collection("sentence")
                  .doc(data.id)
                  .delete();
              });
              dbx
                .collection("speaker")
                .get()
                .then(doc => {
                  doc.forEach(data => {
                    dbx
                      .collection("speaker")
                      .doc(data.id)
                      .delete();
                  });
                  dbx.delete().then(() => {
                    this.notifyRed("ลบข้อมูลเรียบร้อย");
                    this.loadDialog();
                    this.loadingHide();
                  });
                });
            });
        });
    },
    // ไปยังหน้าแก้ไขไฟล์ VDO ตาม Key
    editBtn(key) {
      this.$router.push("/dialog/edit/" + key + "/1");
    },
    // ไปยังหน้า Add VDO ใหม่
    addBtn() {
      this.$router.push("/dialog/add");
    },
    // ไปยังหน้า ปริ้น รายการต่างๆของ VDO
    printBtn(key) {
      alert("พักตรงนี้ดีกว่า... เหนื่อยจุงเบย");
    },
    // โหลดข้อมูล ตำแหน่ง ของฝั่ง draft
    loadPosition() {
      this.loadingShow();
      db.collection("Position")
        .where("status", "==", true)
        .get()
        .then(doc => {
          doc.forEach(element => {
            let data = {
              label: element.data().name,
              value: element.id
            };

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
    // โหลดข้อมูล บทสนทนา จากฝั่ง draft
    loadDialog() {
      this.dialogList = [];
      this.loadingShow();
      db.collection("Dialog")
        .doc("draft")
        .collection("data")
        .where("positionSelec", "array-contains", this.positionID)
        .get()
        .then(doc => {
          if (doc.size != 0) {
            doc.forEach(element => {
              let dialogKey = { key: element.id };
              let final = { ...dialogKey, ...element.data() };

              this.dialogList.push(final);
              this.loadingHide();
            });
          } else {
            // console.log("ไม่มีข้อมูล");
            this.loadingHide();
          }
        });
    },
    // โหลดข้อมูล ตำแหน่ง ของฝั่ง server
    loadPositionServer() {
      this.loadingShow();
      db.collection("Position")
        .where("status", "==", true)
        .get()
        .then(doc => {
          doc.forEach(element => {
            let data = {
              label: element.data().name,
              value: element.id
            };

            this.optionsPositionServer.push(data);
            this.optionsPositionServer.sort((a, b) => {
              return a.label > b.label ? 1 : -1;
            });
            this.positionIDServer = this.optionsPositionServer[0].value;
            this.loadingHide();
          });
          this.loadDialogServer();
        });
    },
    // โหลดข้อมูล บทสนทนา จากฝั่ง server
    loadDialogServer() {
      this.dialogListServer = [];
      this.loadingShow();
      db.collection("Dialog")
        .doc("server")
        .collection("data")
        .where("positionSelec", "array-contains", this.positionIDServer)
        .get()
        .then(doc => {
          if (doc.size != 0) {
            doc.forEach(element => {
              let dialogKey = { key: element.id };
              let final = { ...dialogKey, ...element.data() };

              this.dialogListServer.push(final);
              this.loadingHide();
            });
          } else {
            // console.log("ไม่มีข้อมูล");
            this.loadingHide();
          }
        });
    },
    // เช็ค การซิงข้อมูลของบทสนทนา
    checkSyncData() {
      let saveDraft = "";
      let saveServer = "";
      db.collection("Dialog")
        .doc("draft")
        .get()
        .then(doc => {
          saveDraft = doc.data().saveDraft;
          db.collection("Dialog")
            .doc("server")
            .get()
            .then(doc => {
              saveServer = doc.data().saveServer;
              // เมื่อค่า ดราฟ มีค่าเวลาเซิฟมากกว่า จะสามารถซิงค์ข้อมูลได้
              if (saveDraft <= saveServer) {
                // เมื่อค่าเวลาน้อยกว่าหรือเท่ากับจะไม่สามารถซิงค์ข้อมูลได้
                this.isSync = true;
              }
            });
        });
    }
  },
  mounted() {
    this.loadPosition();
    this.loadPositionServer();
    this.checkSyncData();
  }
};
</script>
<style scoped >
</style>