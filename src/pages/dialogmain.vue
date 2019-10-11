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
            icon="fas fa-cloud-upload-alt"
            class="text-body1 text-white"
            :disable="tabShow == 'server' || !isSync"
            :class="{'bg-grey-7 ' : tabShow == 'server'}"
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
            <div class="col-md-6 col-xs-10">
              <q-select
                outlined
                v-model="obj.positionID"
                :options="optionsPosition"
                @input="loadDialog()"
                label="บทเรียน"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6 col-xs-2 self-center" align="right">
              <q-btn
                @click="addBtn()"
                size="md"
                color="secondary"
                round
                icon="fas fa-plus"
                class="text-body1 text-white"
              />
            </div>

            <div
              class="row q-pa-md col-lg-4 col-md-6 col-sm-12 relative-position"
              v-for="(i , index) in dialogList"
              :key="index"
            >
              <div
                class="row relative-position rounded-borders shadow-2"
                style="width:100%; border: 1px solid #E0E0E0"
              >
                <div class="col-12 q-pa-sm" align="center">
                  <video :src="i.url" style="max-width: 370px; width: 100%; " controls></video>
                </div>

                <div class="col-12 q-pa-sm">
                  <div class="q-pa-md-md q-py-sm">
                    <span class="text-body1">{{i.situationEng}}</span>
                  </div>
                  <div>
                    <q-separator></q-separator>
                  </div>
                  <div class="q-pa-md-md q-py-sm">
                    <span class="text-body1">{{i.situationThai}}</span>
                  </div>
                </div>

                <div class="col-12 q-pa-sm row justify-end">
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
                  <div class="q-pl-md desktop-only">
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
              </div>
            </div>
          </div>
        </div>

        <!-- เซิร์ฟเวอร์ -->
        <div v-show="tabShow == 'server'" class="q-pa-md">
          <div class="q-pb-md row">
            <div class="col-md-6 col-xs-10">
              <q-select
                outlined
                v-model="positionIDServer"
                :options="optionsPositionServer"
                @input="loadDialogServer()"
                label="บทเรียน"
                emit-value
                map-options
              />
            </div>

            <div class="col-md-6 col-xs-2 self-center" align="right">
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
            <div
              class="row q-pa-md col-lg-4 col-md-6 col-sm-12 relative-position"
              v-for="(i , index) in dialogListServer"
              :key="index"
            >
              <div
                class="row relative-position rounded-borders shadow-2"
                style="width:100%; border: 1px solid #E0E0E0"
              >
                <div class="col-12 q-pa-sm" align="center">
                  <video :src="i.url" style="max-width: 370px; width: 100%; " controls></video>
                </div>

                <div class="col-12 q-pa-sm">
                  <div class="q-pa-md-md q-py-sm">
                    <span class="text-body1">{{i.situationEng}}</span>
                  </div>
                  <div>
                    <q-separator></q-separator>
                  </div>
                  <div class="q-pa-md-md q-py-sm">
                    <span class="text-body1">{{i.situationThai}}</span>
                  </div>
                </div>
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
      obj: { positionID: "" },
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
      let loadCheckDialog = await db
        .collection("Dialog")
        .doc("draft")
        .collection("data")
        .where("url", "==", "")
        .get();

      if (loadCheckDialog.size > 0) {
        this.notifyRed("กรุณาเช็คข้อมูล URL ให้ครบก่อนทำการ Sync ข้อมูล");
        this.loadingHide();
        return;
      }

      this.loadingShow();

      //update server time
      let api = "https://api.winner-english.com/data/api/gettime.php";
      let response = await axios.get(api);
      let date = response.data[0].date;
      let microtime = response.data[0].microtime;

      // delete server
      let serverData = await db
        .collection("Dialog")
        .doc("server")
        .collection("data")
        .get();

      for (const data of serverData.docs) {
        let serverSentence = await db
          .collection("Dialog")
          .doc("server")
          .collection("data")
          .doc(data.id)
          .collection("sentence")
          .get();

        for (const getSentence of serverSentence.docs) {
          db.collection("Dialog")
            .doc("server")
            .collection("data")
            .doc(data.id)
            .collection("sentence")
            .doc(getSentence.id)
            .delete();
        }

        let serverSpeaker = await db
          .collection("Dialog")
          .doc("server")
          .collection("data")
          .doc(data.id)
          .collection("speaker")
          .get();

        for (const getSpeaker of serverSpeaker.docs) {
          db.collection("Dialog")
            .doc("server")
            .collection("data")
            .doc(data.id)
            .collection("speaker")
            .doc(getSpeaker.id)
            .delete();
        }

        await db
          .collection("Dialog")
          .doc("server")
          .collection("data")
          .doc(data.id)
          .delete();
      }

      // ซิงค์ข้อมูล draft ไปยัง server
      let draftData = await db
        .collection("Dialog")
        .doc("draft")
        .collection("data")
        .get();

      for (const data of draftData.docs) {
        await db
          .collection("Dialog")
          .doc("server")
          .collection("data")
          .doc(data.id)
          .set(data.data());

        //copy sentence
        let draftSentenceData = await db
          .collection("Dialog")
          .doc("draft")
          .collection("data")
          .doc(data.id)
          .collection("sentence")
          .get();

        for (const data2 of draftSentenceData.docs) {
          await db
            .collection("Dialog")
            .doc("server")
            .collection("data")
            .doc(data.id)
            .collection("sentence")
            .doc(data2.id)
            .set(data2.data());
        }

        //copy speaker
        let draftSpeaker = await db
          .collection("Dialog")
          .doc("draft")
          .collection("data")
          .doc(data.id)
          .collection("speaker")
          .get();

        for (const data3 of draftSpeaker.docs) {
          await db
            .collection("Dialog")
            .doc("server")
            .collection("data")
            .doc(data.id)
            .collection("speaker")
            .doc(data3.id)
            .set(data3.data());
        }
      }

      // สร้างเวลาตอน ซิงค์ข้อมูล
      await db
        .collection("Dialog")
        .doc("server")
        .set({
          saveServer: microtime
        });

      this.loadingHide();
      this.isSync = false;
    },
    // ลบข้อมูล VDO ทั้งหมด
    async deleteBtn(key) {
      let microtime = await this.loadTime();
      this.$q
        .dialog({
          title: "ยืนยัน",
          message: "ยืนยันการลบ",
          ok: "ยืนยัน",
          cancel: "ยกเลิก",
          persistent: true
        })
        .onOk(() => {
          this.loadingShow();
          let dbx = db
            .collection("Dialog")
            .doc("draft")
            .collection("data")
            .doc(key);

          db.collection("Dialog")
            .doc("draft")
            .set({
              saveDraft: microtime
            });

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
                    this.checkSyncData();
                    this.isSync = false;
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
      this.$router.push("/dialog/print/" + key);
    },
    // โหลดข้อมูล บทเรียน ของฝั่ง draft
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

            this.obj.positionID = this.$q.localStorage.getItem("position");
            // this.obj.positionID = this.optionsPosition[0].value;
            this.loadingHide();
          });

          this.loadDialog();
        });
    },
    // โหลดข้อมูล บทสนทนา จากฝั่ง draft
    loadDialog() {
      this.$q.localStorage.set("position", this.obj.positionID);
      this.dialogList = [];
      this.loadingShow();
      db.collection("Dialog")
        .doc("draft")
        .collection("data")
        .where("positionSelec", "array-contains", this.obj.positionID)
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
      this.optionsPositionServer = [];
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
          });
          this.optionsPositionServer.sort((a, b) => {
            return a.label > b.label ? 1 : -1;
          });
          this.positionIDServer = this.optionsPositionServer[0].value;
          this.loadingHide();
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
      let saveDraft = 0;
      let saveServer = 0;
      // console.log("test");
      db.collection("Dialog")
        .doc("draft")
        .get()
        .then(doc => {
          saveDraft = doc.data().saveDraft;
          // console.log("draft" + saveDraft);
          db.collection("Dialog")
            .doc("server")
            .get()
            .then(doc => {
              saveServer = doc.data().saveServer;
              // เมื่อค่า ดราฟ มีค่าเวลาเซิฟมากกว่า จะสามารถซิงค์ข้อมูลได้
              if (saveDraft <= saveServer) {
                // console.log("server" + saveServer);
                // เมื่อค่าเวลาน้อยกว่าหรือเท่ากับจะไม่สามารถซิงค์ข้อมูลได้
                this.isSync = false;
              } else {
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
.bulebox {
  height: 50px;
}
</style>