<template>
  <div>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">ประโยค</div>
        <div class="desktop-only text-grey-2 text-h4">ประโยค</div>
        <q-space />
        <div>
          <q-btn
            flat
            round
            icon="fas fa-cloud-upload-alt"
            :disable="tab!='draft'?true:false || !syncData"
            :class="{ '' : tab!='draft' , '' : tab=='draft'}"
            class="q-mr-sm text-body1 text-grey-2"
            size="md"
            @click="syncNow()"
          />
        </div>
      </q-toolbar>
    </div>
    <div class="q-pa-md-md">
      <div class="bg-grey-2">
        <div>
          <q-tabs
            v-model="tab"
            inline-label
            class="text-blue-grey-10 shadow-2"
            align="left"
            active-color="secondary"
          >
            <q-tab name="draft" label="แบบร่าง" icon="fas fa-pen" @click="draftShow()"></q-tab>
            <q-tab name="server" label="เซิร์ฟเวอร์" icon="fas fa-cloud" @click="serverShow()"></q-tab>
          </q-tabs>
        </div>
        <div class="row q-pa-md">
          <div class="col-md-6 col-sm-9 col-xs-9">
            <q-select
              label="ตำแหน่ง"
              outlined
              @input="loadData()"
              :options="generalPosition"
              v-model="obj.positions"
              map-options
              emit-value
            ></q-select>
          </div>
          <div align="right" class="col-md-6 col-sm-3 col-xs-3 q-py-sm">
            <q-btn
              flat
              round
              push
              icon="fas fa-plus"
              class="q-mx-sm text-body1 text-grey-2"
              :class="{ 'bg-grey-7' : tab!='draft' , 'bg-secondary' : tab=='draft'}"
              @click="addBtn(obj.positions)"
              size="md"
              :disable="tab!='draft'?true:false"
            />
            <q-btn
              class="text-body1 text-grey-2 q-ml-sm mobile-hide"
              :class="{ 'bg-grey-7' : tab!='draft' , 'bg-secondary' : tab=='draft'}"
              flat
              round
              push
              icon="fas fa-print"
              size="md"
              :disable="tab!='draft'?true:false"
              @click="printMe()"
            />
          </div>
        </div>
        <div v-for="(item,index ) in    expressionList " :key="index" class="q-px-md q-pb-md">
          <table
            style="border: 1px solid grey;width:100%; border-collapse: collapse; "
            class="desktop-only"
          >
            <tr>
              <td style="width:50px">
                <div>
                  <q-btn
                    :disable="item.url==''"
                    @click="playsound(item.url)"
                    flat
                    style="width:50px; height:50px"
                    push
                    icon="fas fa-volume-up"
                    class="text-body1 text-grey-2"
                    :class="{'bg-secondary': item.url, 'bg-grey-7': !item.url}"
                    size="md"
                  />
                </div>
              </td>
              <td style="width:60px; border: 1px solid grey" align="center">{{item.orderid}}</td>
              <td @click="editBtn(item.key)" class="rounded-borders hoverpoint">
                <span class="q-px-xs">{{item.sentenceEnglish}}</span>
                <br />
                <span class="q-px-xs">{{item.sentenceThai}}</span>
              </td>
              <td
                @click="editBtn(item.key)"
                class="q-pl-md hoverpoint"
                style=" width:50px;"
                align="center"
              >
                <div style=" width:50px; height: 50px">
                  <q-icon size="20px" class="q-mt-md" name="fas fa-chevron-right"></q-icon>
                </div>
              </td>
            </tr>
          </table>
          <q-card class="mobile-only">
            <q-card-section class="bg-blue-grey-10 text-grey-2">
              <div class="row">
                <div class="col-11">{{item.orderid}}</div>
                <div class="col-1">
                  <q-icon
                    name="fas fa-volume-up"
                    size="20px"
                    v-if="item.url"
                    @click="playsound(item.url)"
                  ></q-icon>
                  <!-- <q-icon name="fas fa-volume-mute" disable size="20px" v-if="!item.url"></q-icon> -->
                </div>
              </div>
            </q-card-section>
            <q-card-section class="bg-grey-2 text-blue-grey-10" @click="editBtn(item.key)">
              <div class="q-pt-md">
                <div>{{item.sentenceEnglish}}</div>
                <hr style="border-top: 1px dashed" />
                <div>{{item.sentenceThai}}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { db } from "../router/index.js";
import { st } from "../router/index.js";

export default {
  data() {
    return {
      expressionList: [],
      tab: "draft",
      obj: {
        positions: ""
      },
      data: "",
      currentURL: "",
      generalPosition: [],
      testdata: false,
      syncData: false
    };
  },
  methods: {
    printMe() {
      alert("ขนมปังคือฟาร์มเฮาส์ แต่สำหรับเราคือฟาร์มรัก");
    },
    async syncNow() {
      //update server time
      let api = "https://api.winner-english.com/data/api/gettime.php";
      let response = await axios.get(api);
      let date = response.data[0].date;
      let microtime = response.data[0].microtime;
      db.collection("Expression")
        .doc("server")
        .set({
          saveServer: microtime
        });

      //delete all record from server collection
      db.collection("Expression")
        .doc("server")
        .collection("data")
        .get()
        .then(doc => {
          doc.forEach(data => {
            db.collection("Expression")
              .doc("server")
              .collection("data")
              .doc(data.id)
              .delete();
          });
          //copy all record from draft collection to server collection
          db.collection("Expression")
            .doc("draft")
            .collection("data")
            .get()
            .then(doc2 => {
              doc2.forEach(data2 => {
                db.collection("Expression")
                  .doc("server")
                  .collection("data")
                  .doc(data2.id)
                  .set(data2.data());
              });
              //notice finish process
              this.notifyGreen("อัพโหลดข้อมูลเรียบร้อย");
              this.checkSync();
            });
        });
    },
    async checkSync() {
      let serverTime;
      let draftTime;
      await db
        .collection("Expression")
        .doc("server")
        .get()
        .then(data => {
          serverTime = data.data().saveServer;
        });
      await db
        .collection("Expression")
        .doc("draft")
        .get()
        .then(data => {
          draftTime = data.data().saveDraft;
          if (serverTime < draftTime) {
            this.syncData = true;
          } else {
            this.syncData = false;
          }
        });
    },
    // โหลดข้อมูลออกมาโชว์
    loadData() {
      this.$q.localStorage.set("currentposition", this.obj.positions);
      this.loadingShow();
      db.collection("Expression")
        .doc(this.tab)
        .collection("data")
        .where("positionKey", "==", this.obj.positions)
        .get()
        .then(doc => {
          {
            this.expressionList = [];
            if (doc.size > 0) {
              doc.forEach(async element => {
                try {
                  let loadUrl = await st
                    .child("audios/" + element.id + ".mp3")
                    .getDownloadURL();
                  let dataKey = {
                    url: new Audio(loadUrl),
                    key: element.id
                  };
                  let final = {
                    ...element.data(),
                    ...dataKey
                  };
                  this.expressionList.push(final);
                  this.expressionList.sort((a, b) => {
                    return a.orderid - b.orderid;
                  });
                  this.loadingHide();
                } catch (err) {
                  let dataKey = {
                    url: "",
                    key: element.id
                  };
                  let final = {
                    ...dataKey,
                    ...element.data()
                  };
                  this.expressionList.push(final);
                  this.expressionList.sort((a, b) => {
                    return a.orderid - b.orderid;
                  });
                  this.loadingHide();
                  //*************Disable warning file not found **********/
                  console.clear();
                  //*************Disable warning file not found **********/
                }
              });
            } else {
              this.loadingHide();
            }
          }
        });
    },
    // แบบร่าง
    draftShow() {
      this.tab = "draft";
      this.loadData();
    },
    // เชิร์ฟเวอร์
    serverShow() {
      this.tab = "server";
      this.loadData();
    },
    // โหลดตำแหน่ง
    loadPosition() {
      this.loadingShow();
      db.collection("Position")
        .orderBy("orderid")
        .get()
        .then(doc => {
          doc.forEach(element => {
            let showPosition = {
              value: element.id,
              label: element.data().orderid + " - " + element.data().name
            };
            this.generalPosition.push(showPosition);
            this.generalPosition.sort((a, b) => {
              return a.orderid - b.orderid;
            });
          });
          this.obj.positions = this.$q.localStorage.getItem("currentposition");
          this.loadData();
        });
    },
    // เล่นเสียง
    playsound(audio) {
      if (this.currentURL != "") {
        this.currentURL.pause();
      }
      setTimeout(() => {
        audio.play();
      }, 1000);

      this.currentURL = audio;
    },
    // ปุ่มเพิ่มข้อมูล
    addBtn(key) {
      this.$router.push("/expression/add");
    },
    // แก้ไข
    editBtn(key) {
      this.$router.push("/expression/edit/" + key);
    },

    runXXX() {
      db.collection("Expression")
        .doc("server")
        .collection("data")
        .where("positionKey", "==", "CQZogN7SRYsbH35utp4Q")
        // .where("orderid", ">=", 100)
        // .where("orderid", "<=", 109)
        .get()
        .then(doc => {
          doc.forEach(element => {
            if (
              element.data().orderid >= 100 &&
              element.data().orderid <= 109
            ) {
              db.collection("Expression")
                .doc("server")
                .collection("data")
                .doc(element.id)
                .update({ situationKey: "qTmrBZgeeexvBruTOfRC" });
            }
          });
        });
    }
  },
  mounted() {
    this.loadPosition();
    this.checkSync();
    // this.runXXX();
  }
};
</script>
<style scoped >
.hoverpoint:hover {
  cursor: pointer;
}
</style>