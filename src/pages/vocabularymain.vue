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
          />
        </div>
      </q-toolbar>
    </div>
    <div class="bg-grey-2 q-ma-md-md">
      <div>
        <q-tabs
          v-model="tab"
          inline-label
<<<<<<< HEAD
          class="shadow-2 text-blue-grey-10"
=======
          class="bg-grey-2 text-blue-grey-10 shadow-2 relative-position"
>>>>>>> master
          align="left"
          active-color="secondary"
        >
          <q-tab name="draft" label="แบบร่าง" icon="fas fa-pen"></q-tab>
          <q-tab name="server" label="เซิร์ฟเวอร์" icon="fas fa-cloud"></q-tab>
          <q-space />
          <q-input
            v-model="search"
            filled
            class="desktop-only"
            style="height:40px"
            placeholder="ค้นหา..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-tabs>
      </div>
      <div class="row row justify-between q-pa-md">
        <div class="col-md-6 col-sm-6 col-xs-7">
          <q-select
            @input="loadData()"
            outlined
            label="ตำแหน่ง"
            v-model="obj.positions"
            :options="positionOptions"
          />
        </div>
        <div class="col-md-6 col-sm-6 q-py-sm" align="right">
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
          <q-btn
            size="md"
            color="secondary"
            round
            icon="fas fa-search"
            class="mobile-only text-body1 text-white"
          />
        </div>
      </div>
      <div class="q-pb-lg flex flex-center">
        <q-pagination v-model="page" :max="6" color="blue-grey-10" :direction-links="true" />
      </div>
      <div class="row">
        <div
          v-for="(item,index ) in   vocabularyList "
          :key="index"
          class="col-md-3 col-sm-6 col-xs-12 q-px-md-md q-px-sm-md q-py-sm"
        >
          <q-toolbar class="rounded-borders no-padding q-py-sm col-md-3 shadow-5 bg-grey-2">
            <q-btn
              flat
              dense
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

            <q-btn
              flat
              @click="editBtn(item.key)"
              dense
              icon="fas fa-chevron-right"
              style=" height:70px"
            />
          </q-toolbar>
        </div>
      </div>

      <div class="q-pt-lg q-pb-md flex flex-center">
        <q-pagination v-model="page" :max="6" color="blue-grey-10" :direction-links="true" />
      </div>
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
      search: ""
    };
  },
  methods: {
    // โหลดข้อมูล

    loadData() {
      db.collection("Vocabulary")
        .doc("draft")
        .collection("data")
        .where("positionKey", "==", this.obj.positions.value)
        .get()
        .then(doc => {
          this.vocabularyList = [];
          if (doc.size > 0) {
            doc.forEach(element => {
              let dataKey = {
                key: element.id
              };
              let final = {
                ...dataKey,
                ...element.data()
              };

              this.vocabularyList.push(final);
            });
            this.vocabularyList.sort((a, b) => {
              return a.vocab > b.vocab ? 1 : -1;
            });
            this.loadingHide();
          } else {
          }
        });
    },
    //************************ โหลดตำแหน่ง
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
        });
    },
    // เล่นเสียง

    playsound(url) {
      let audio = new Audio(url);
      setTimeout(() => {
        audio.play();
      }, 1000);
    },
    // ปุ่มแก้ไข
    editBtn(key) {
      this.$router.push("/vocabulary/edit/" + key);
    },
    // ปุ่มเพิ่ม
    addBtn() {
      this.$router.push("/vocabulary/add");
    },
    //  ซิงเซิฟเวอร์
    async syncBtn() {
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
          //copy all record from draft to server
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
                  .set(data.data());
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
<style scoped >
.pointer:hover {
  cursor: pointer;
}
</style>