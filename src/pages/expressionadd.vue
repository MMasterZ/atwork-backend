<template>
  <div>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">{{titlePage}}</div>
        <div class="desktop-only text-grey-2 text-h4">{{titlePage}}</div>
        <q-space />
        <div align="right" class="q-pr-sm">
          <q-btn
            v-show="this.$route.name == 'expressionedit'"
            @click="deleteBtnTop()"
            size="md"
            color="secondary"
            round
            icon="fas fa-trash-alt"
            class="text-body1 text-grey-2"
          />
        </div>
      </q-toolbar>
    </div>
    <div class="bg-grey-2 q-mt-md-md q-mx-md-md">
      <div class="row q-pa-sm">
        <div style="height: 55px" class="col-md-6 col-xs-12 q-pa-sm q-mb-md">
          <q-input
            ref="order"
            :rules="[ val => !!val ]"
            v-model.number="obj.orderid"
            label="รหัสลำดับ"
            type="number"
            outlined
          ></q-input>
        </div>
        <div class="q-pa-sm col-md-6 col-xs-12">
          <div style="height: 57px;  border: 1px solid #bdbdbd" class="rounded-borders">
            <div v-if="!isFile" class="q-my-sm">
              <table>
                <tr>
                  <td style="width: 50px;">
                    <div class="q-pt-xs q-pl-sm text-body1 text-grey-7 q-pr-md">เสียง</div>
                  </td>
                  <td>
                    <q-input
                      borderless
                      :type=" 'file'"
                      @input="value => {file= value}"
                      style="height:30px;"
                      class="q-pt-lg"
                    ></q-input>
                  </td>
                </tr>
              </table>
            </div>

            <div v-if="isFile">
              <div class="row justify-between">
                <div class="q-my-xs q-pt-sm text-secondary">
                  <div class="text-body1 q-pt-xs q-px-sm">
                    <span class="text-grey-7">เสียง</span>
                    <q-icon class="q-px-md" name="fas  fa-play" />
                    <u @click="playsound(url)" class="cursor-pointer">ฟังเสียงคำศัพท์</u>
                  </div>
                </div>
                <div>
                  <q-btn
                    class="q-my-sm text-body1 text-blue-grey-10"
                    flat
                    @click="deleteBtn()"
                    round
                    push
                    icon="fas fa-trash-alt"
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-xs-12 q-pa-sm">
          <q-select
            outlined
            v-model="obj.positionKey"
            emit-value
            map-options
            :options="positionArry"
            label="ตำแหน่ง"
            @input="loadSituation()"
          />
        </div>
        <div class="col-md-6 col-xs-12 q-pa-sm">
          <q-select
            outlined
            v-model="obj.situationKey"
            emit-value
            map-options
            :options="situationArry"
            label="สถานการณ์"
          />
        </div>
        <div class="col-md-12 col-xs-12 q-pa-sm">
          <q-input
            ref="sentenceEnglish"
            :rules="[ val => !!val ]"
            v-model="obj.sentenceEnglish"
            label="ประโยคภาษาอังกฤษ"
            outlined
            autogrow
          ></q-input>
        </div>
        <div class="col-md-12 col-xs-12 q-pa-sm removeErrorText">
          <q-input
            ref="sentenceThai"
            :rules="[ val => !!val ]"
            v-model="obj.sentenceThai"
            label="ประโยคภาษาไทย"
            outlined
            autogrow
          ></q-input>
        </div>
      </div>

      <div class="removeErrorText2">
        <div class="col-12 q-pa-sm" align="center">
          <q-btn @click="cencel()" label="ยกเลิก" class="q-mx-sm q-mt-md" style="width:120px"></q-btn>
          <q-btn
            @click="save()"
            label="บันทึก"
            class="q-mx-sm q-mt-md bg-secondary text-grey-2"
            style="width:120px"
          ></q-btn>
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
      mode: 1,
      titlePage: "เพิ่มประโยค",
      tab: "general",
      obj: {
        orderid: "",
        sentenceEnglish: "",
        sentenceThai: "",
        positionKey: "",
        situationKey: ""
      },

      positionArry: [],
      situationArry: [],
      currentURL: "",
      url: "",
      file: "",
      isFile: false
    };
  },
  methods: {
    loadSituation() {
      this.$q.loading.show({
        delay: 400 // ms
      });
      db.collection("Situation")
        .where("positionKey", "==", this.obj.positionKey)
        .get()
        .then(doc => {
          this.situationArry = [];
          if (doc.size > 0) {
            doc.forEach(element => {
              let data = {
                label: element.data().name,
                value: element.id
              };
              this.situationArry.push(data);
              this.obj.situationKey = this.situationArry[0].value;
            });
          } else {
            this.obj.situationKey = "-";
          }
          this.$q.loading.hide();
        });
    },
    loadPosition() {
      this.$q.loading.show({
        delay: 400 // ms
      });
      db.collection("Position")
        .get()
        .then(doc => {
          this.positionArry = [];
          if (doc.size > 0) {
            doc.forEach(element => {
              let dataKey = {
                label: element.data().name,
                value: element.id
              };
              this.positionArry.push(dataKey);
              this.obj.positionKey = this.$q.localStorage.getItem(
                "currentposition"
              );
            });
          }
          this.loadSituation();
        });
    },
    async loadedit() {
      try {
        let doc = await st
          .child("audios/" + this.$route.params.key + ".mp3")
          .getDownloadURL();

        this.url = new Audio(doc);
        this.isFile = true;
      } catch (err) {
        this.isFile = false;
      }

      this.$q.loading.show();
      //check audio exists

      db.collection("Expression")
        .doc("draft")
        .collection("data")
        .doc(this.$route.params.key)
        .get()
        .then(doc => {
          this.obj = doc.data();
          this.$q.loading.hide();
        });
    },
    async deleteBtnTop() {
      let api = "https://api.winner-english.com/data/api/gettime.php";

      let response = await axios.get(api);

      let date = response.data[0].date;
      let microtime = response.data[0].microtime;
      this.$q
        .dialog({
          title: "คำเตือน",
          message: "คุณต้องการลบข้อมูลนี้หรือไม่",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          db.collection("Expression")
            .doc("draft")
            .set({ saveDraft: microtime });
          st.child("audios/" + this.$route.params.key + ".mp3")
            .delete()
            .then(url => {});
          db.collection("Expression")
            .doc("draft")
            .collection("data")
            .doc(this.$route.params.key)
            .delete();
          this.$router.push("/expression");
        });
    },
    async deleteBtn() {
      this.$q
        .dialog({
          title: "คำเตือน",
          message: "คุณต้องการลบไฟล์เสียงนี้หรือไม่",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          st.child("audios/" + this.$route.params.key + ".mp3")
            .delete()
            .then(url => {
              this.isFile = false;
            });
        });
    },
    cencel() {
      this.$router.push("/expression");
    },
    playsound(audio) {
      if (this.currentURL != "") {
        this.currentURL.pause();
      }

      setTimeout(() => {
        audio.play();
      }, 1000);

      this.currentURL = audio;
    },

    async save() {
      let _this = this;
      this.$refs.order.validate();
      this.$refs.sentenceEnglish.validate();
      this.$refs.sentenceThai.validate();
      if (
        this.$refs.order.hasError ||
        this.$refs.sentenceEnglish.hasError ||
        this.$refs.sentenceThai.hasError
      ) {
        this.$q.notify({
          icon: "fas fa-exclamation-circle",
          message: "กรุณากรอกข้อมูลให้ครบ",
          color: "negative",
          position: "bottom",
          timeout: 1000
        });
        return;
      }
      let api = "https://api.winner-english.com/data/api/gettime.php";

      let response = await axios.get(api);

      let date = response.data[0].date;
      let microtime = response.data[0].microtime;

      if (this.$route.name == "expressionadd") {
        this.$q.loading.show();
        db.collection("Expression")
          .doc("draft")
          .collection("data")
          .add(this.obj)
          .then(doc => {
            db.collection("Expression")
              .doc("draft")

              .set({ saveDraft: microtime });
            this.$q.notify({
              icon: "fas fa-check-circle",
              message: "บันทึกข้อมูลเรียบร้อย",
              color: "secondary",
              position: "bottom",
              timeout: 1000
            });
            if (_this.file != "") {
              st.child("audios/" + doc.id + ".mp3")
                .put(this.file[0])
                .then(() => {
                  this.$q.loading.hide();
                  this.$router.push("/expression");
                });
            } else {
              _this.$q.loading.hide();
              _this.$router.push("/expression");
            }
          });
      } else {
        db.collection("Expression")
          .doc("draft")
          .set({ saveDraft: microtime });
        db.collection("Expression")
          .doc("draft")
          .collection("data")
          .doc(this.$route.params.key)
          .set(this.obj)
          .then(() => {
            if (_this.file != "") {
              st.child("audios/" + this.$route.params.key + ".mp3")
                .put(this.file[0])
                .then(() => {
                  this.$q.loading.hide();
                  this.$q.notify({
                    icon: "fas fa-check-circle",
                    message: "บันทึกข้อมูลเรียบร้อย",
                    color: "secondary",
                    position: "bottom",
                    timeout: 1000
                  });
                  this.$router.push("/expression");
                });
            } else {
              _this.$q.loading.hide();
              this.$q.notify({
                icon: "fas fa-check-circle",
                message: "บันทึกข้อมูลเรียบร้อย",
                color: "secondary",
                position: "bottom",
                timeout: 1000
              });
              _this.$router.push("/expression");
            }
          });
      }
    }
  },
  mounted() {
    if (this.$route.name == "expressionedit") {
      this.titlePage = "แก้ไขประโยค";
      this.loadedit();
    }
    this.loadPosition();
    this.$refs.order.focus();
  }
};
</script>

<style scoped>
.removeErrorText {
  position: relative;
  top: -20px;
}
.removeErrorText2 {
  position: relative;
  top: -40px;
}
</style>