<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">คำศัพท์</div>
        <div class="desktop-only text-grey-2 text-h4">คำศัพท์</div>
        <q-space />
        <div align="right" class="q-pr-sm">
          <q-btn
            flat
            @click="syncBtn()"
            size="md"
            color="secondary"
            round
            icon="fas fa-cloud-upload-alt"
            class="text-body1 text-white"
            :disable="tab == 'server' || !isSyncMode"
          />
        </div>
      </q-toolbar>
    </div>
    <div class="bg-grey-2 q-ma-md-md">
      <div>
        <q-tabs
          v-model="tab"
          inline-label
          class="shadow-2 text-blue-grey-10"
          align="left"
          active-color="secondary"
        >
          <q-tab name="draft" label="แบบร่าง" icon="fas fa-pen"></q-tab>
          <q-tab name="server" label="เซิร์ฟเวอร์" icon="fas fa-cloud"></q-tab>
          <q-space />
        </q-tabs>
      </div>
      <!-- แถบเลือกตำแหน่งและปุ่ม -->
      <q-tab-panels v-model="tab" animated>
        <!-- draft -->
        <q-tab-panel name="draft">
          <div class="row row justify-between q-pa-md">
            <div class="col-md-6 col-sm-6 col-xs-6">
              <q-select
                @input="loadData()"
                outlined
                label="ตำแหน่ง"
                v-model="obj.positions"
                :options="positionOptions"
              />
            </div>
            <div class="col-md-6 col-sm-6 col-xs-6 q-py-sm" align="right">
              <q-btn
                @click="addBtn()"
                size="md"
                color="secondary"
                round
                icon="fas fa-plus"
                class="text-body1 text-white q-mx-md"
              />
              <q-btn
                size="md"
                color="secondary"
                round
                icon="fas fa-print"
                class="desktop-only text-body1 text-white"
              />
            </div>
          </div>
          <!-- แสดงหน้าจำนวนของคำศัพท์ในแต่ละตำแหน่ง -->
          <div class="q-pb-lg flex flex-center">
            <q-pagination
              v-model="page"
              @click="showPage()"
              :max="vocabularyList.length"
              color="blue-grey-10"
              :direction-links="true"
            />
          </div>
          <!-- แสดงคำศัพท์ -->
          <div class="row">
            <div
              v-for="(item,index ) in   vocabularyList[page -1] "
              :key="index"
              class="col-md-4 col-lg-3 col-sm-6 col-xs-12 q-mb-md-md q-mb-sm-sm q-px-xs-sm q-px-md-md q-py-xs q-px-sm-md"
            >
              <q-toolbar
                class="pointer no-padding q-py-xs col-md-3 bg-grey-2 shadow-5 rounded-borders"
              >
                <q-btn
                  square
                  flat
                  icon="fas fa-volume-up"
                  style="width:60px; height:70px"
                  class="bg-secondary text-grey-2"
                  :class="{'bg-grey-7': item.url.length==0}"
                  :disable="item.url.length==0"
                  @click="playsound(item.url)"
                />
                <q-toolbar-title @click="editBtn(item.key)" class="pointer">
                  <div class="text-body1">{{item.vocab}}</div>
                  <div class="text-body1">{{item.meaning}}</div>
                </q-toolbar-title>
                <div class="pointer" @click="editBtn(item.key)  ">
                  <q-icon size="20px" class="q-mr-sm" name="fas fa-chevron-right"></q-icon>
                </div>
              </q-toolbar>
            </div>
          </div>
          <!-- แสดงหน้าจำนวนของคำศัพท์ในแต่ละตำแหน่ง -->
          <div class="q-pt-lg q-pb-md flex flex-center">
            <q-pagination
              v-model="page"
              :max="vocabularyList.length"
              color="blue-grey-10"
              :direction-links="true"
            />
          </div>
        </q-tab-panel>

        <!-- server  -->
        <q-tab-panel name="server">
          <div class="row row justify-between q-pa-md">
            <div class="col-md-6 col-sm-6 col-xs-6">
              <q-select
                @input="loadDataServer()"
                outlined
                label="ตำแหน่ง"
                v-model="objServer.positions"
                :options="positionOptions"
              />
            </div>
            <div class="col-md-6 col-sm-6 col-xs-6 q-py-sm" align="right">
              <q-btn
                @click="addBtn()"
                size="md"
                color="grey-7"
                round
                icon="fas fa-plus"
                class="text-body1 text-white q-mx-md"
                disable
              />
              <q-btn
                size="md"
                color="grey-7"
                round
                icon="fas fa-print"
                class="desktop-only text-body1 text-white"
                disable
              />
            </div>
          </div>
          <!-- แสดงหน้าจำนวนของคำศัพท์ในแต่ละตำแหน่ง -->
          <div class="q-pb-lg flex flex-center">
            <q-pagination
              v-model="pageServer"
              @click="showPage()"
              :max="vocabListServer.length"
              color="blue-grey-10"
              :direction-links="true"
            />
          </div>
          <!-- แสดงคำศัพท์ -->
          <div class="row">
            <div
              v-for="(item,index ) in   vocabListServer[page -1] "
              :key="index"
              class="col-md-4 col-lg-3 col-sm-6 col-xs-12 q-mb-md-md q-mb-sm-sm q-px-xs-sm q-px-md-md q-py-xs q-px-sm-md"
            >
              <q-toolbar
                class="pointer no-padding q-py-xs col-md-3 bg-grey-2 shadow-5 rounded-borders"
              >
                <q-btn
                  square
                  flat
                  icon="fas fa-volume-up"
                  style="width:60px; height:70px"
                  class="bg-secondary text-grey-2"
                  :class="{'bg-grey-7': item.url.length==0}"
                  :disable="item.url.length==0"
                  @click="playsound(item.url)"
                />
                <q-toolbar-title @click="editBtn(item.key)" class="pointer">
                  <div class="text-body1">{{item.vocab}}</div>
                  <div class="text-body1">{{item.meaning}}</div>
                </q-toolbar-title>
                <div class="pointer" @click="editBtn(item.key)  ">
                  <q-icon size="20px" class="q-mr-sm" name="fas fa-chevron-right"></q-icon>
                </div>
              </q-toolbar>
            </div>
          </div>

          <!-- แสดงหน้าจำนวนของคำศัพท์ในแต่ละตำแหน่ง -->
          <div class="q-pt-lg q-pb-md flex flex-center">
            <q-pagination
              v-model="pageServer"
              :max="vocabListServer.length"
              color="blue-grey-10"
              :direction-links="true"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>



<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      tab: "draft",
      vocabularyList: [],
      obj: {
        positions: ""
      },
      page: 1,
      positionOptions: [],
      search: "",
      isSyncMode: true,
      vocabListServer: [],
      objServer: {
        positions: ""
      },
      positionOptionsServer: [],
      pageServer: 1
    };
  },
  methods: {
    //******************** โหลดข้ำมูลคำศัพท์มาแสดง   *****************/
    loadData() {
      db.collection("Vocabulary")
        .doc("draft")
        .collection("data")
        .where("positionKey", "==", this.obj.positions.value)
        .get()
        .then(doc => {
          this.vocabularyList = [];
          let testArry = [];
          if (doc.size > 0) {
            doc.forEach(element => {
              let dataKey = {
                key: element.id
              };
              let final = {
                ...dataKey,
                ...element.data()
              };
              testArry.push(final);
            });
            testArry.sort((a, b) => {
              return a.vocab > b.vocab ? 1 : -1;
            });
            let setNumber = 40; // จำนวนคำต่อหน้า
            let newNumber = Math.ceil(testArry.length / setNumber);
            let startNumber = 0;
            let lastNumber = setNumber;
            let newData = [];
            // ฟังชั่นการคำนวนหน้าตามจำนวนคำ
            for (let i = 0; i < newNumber; i++) {
              newData = testArry.slice(startNumber, lastNumber);
              startNumber += setNumber;
              lastNumber += setNumber;
              this.vocabularyList.push(newData);
            }
            this.loadingHide();
          }
        });
    },

    //******************** โหลดข้ำมูลคำศัพท์มาแสดง   *****************/
    loadDataServer() {
      db.collection("Vocabulary")
        .doc("server")
        .collection("data")
        .where("positionKey", "==", this.objServer.positions.value)
        .get()
        .then(doc => {
          this.vocabListServer = [];
          let testArry = [];
          if (doc.size > 0) {
            doc.forEach(element => {
              let dataKey = {
                key: element.id
              };
              let final = {
                ...dataKey,
                ...element.data()
              };
              testArry.push(final);
            });
            testArry.sort((a, b) => {
              return a.vocab > b.vocab ? 1 : -1;
            });
            let setNumber = 40; // จำนวนคำต่อหน้า
            let newNumber = Math.ceil(testArry.length / setNumber);
            let startNumber = 0;
            let lastNumber = setNumber;
            let newData = [];
            // ฟังชั่นการคำนวนหน้าตามจำนวนคำ
            for (let i = 0; i < newNumber; i++) {
              newData = testArry.slice(startNumber, lastNumber);
              startNumber += setNumber;
              lastNumber += setNumber;
              this.vocabListServer.push(newData);
            }
            this.loadingHide();
          }
        });
    },

    //******************** โหลดตำแหน่ง   *****************/
    loadPosition() {
      this.loadingShow();
      db.collection("Position")
        .get()
        .then(doc => {
          let temp = {
            value: "ทั่วไป",
            label: "***ทั่วไป***"
          };
          this.positionOptions.push(temp);
          this.obj.positions = temp;
          this.objServer.positions = temp;
          doc.forEach(element => {
            let showPosition = {
              value: element.id,
              label: element.data().name
            };

            this.positionOptions.push(showPosition);
          });
          this.positionOptions.sort((a, b) => {
            return a.label > b.label ? 1 : -1;
          });
          this.loadData();
          this.loadDataServer();
        });
    },

    //******************** เล่นเสียง   *****************/
    playsound(url) {
      let audio = new Audio(url);
      setTimeout(() => {
        audio.play();
      }, 1000);
    },
    //******************** ปุ่มแก้ไข   *****************/
    editBtn(key) {
      this.$router.push("/vocabulary/edit/" + key);
    },

    //******************** ปุ่มเพิ่ม   *****************/
    addBtn() {
      this.$router.push("/vocabulary/add");
    },

    //******************** ซิงค์ข้อมูลเซิฟเวอร์   *****************/
    async syncBtn() {
      //update server time
      this.loadingShow();

      let microtime = await this.loadTime();
      // console.log(microtime);
      db.collection("Vocabulary")
        .doc("server")
        .set({
          saveServer: microtime
        });
      //delete all record from server
      db.collection("Vocabulary")
        .doc("server")
        .collection("data")
        .get()
        .then(doc => {
          doc.forEach(data => {
            db.collection("Vocabulary")
              .doc("server")
              .collection("data")
              .doc(data.id)
              .delete();
          });

          // copy all record from draft to server
          db.collection("Vocabulary")
            .doc("draft")
            .collection("data")
            .get()
            .then(doc => {
              doc.forEach(data => {
                db.collection("Vocabulary")
                  .doc("server")
                  .collection("data")
                  .doc(data.id)
                  .set(data.data())
                  .then(() => {
                    this.loadingHide();
                    this.checkSyncData();
                  });
                console.log(data.id + " id ");
                console.log(data.data());
                // หาทางวนไปเซฟที่ ยูเซอแต่ละคน แล้วก็ถ้ามีแล้วต้องไปเซฟซ้ำ
                // db.collection("CustomerAccounts")

                //   .get()
                //   .then(docAccounts => {
                //     docAccounts.forEach(dataAccount => {
                //       console.log("amm");
                //     });
                //   });
              });
            });
        });
    },
    // เช็ค การซิงข้อมูลของคำศัพท์
    checkSyncData() {
      let saveDraft = "";
      let saveServer = "";
      db.collection("Vocabulary")
        .doc("draft")
        .get()
        .then(doc => {
          saveDraft = doc.data().saveDraft;
          db.collection("Vocabulary")
            .doc("server")
            .get()
            .then(doc => {
              saveServer = doc.data().saveServer;
              // console.log("server-" + saveServer + " draft-" + saveDraft);
              // console.log(saveServer - saveDraft);
              // เมื่อค่า ดราฟ มีค่าเวลาเซิฟมากกว่า จะสามารถซิงค์ข้อมูลได้
              if (saveDraft <= saveServer) {
                // เมื่อค่าเวลาน้อยกว่าหรือเท่ากับจะไม่สามารถซิงค์ข้อมูลได้
                this.isSyncMode = false;
              }
            });
        });
    }
  },
  mounted() {
    this.loadPosition();
    this.checkSyncData();
  }
};
</script>
<style scoped >
.pointer:hover {
  cursor: pointer;
}
.card {
  border: 1px solid black;
}
</style>