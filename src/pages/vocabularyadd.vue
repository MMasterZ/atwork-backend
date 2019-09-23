<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">{{titlePage}}</div>
        <div class="desktop-only text-grey-2 text-h4">{{titlePage}}</div>
        <q-space />

        <div align="right" v-show="this.$route.name == 'vocabularyedit'" class="q-pr-sm">
          <q-btn
            @click="deleteBtn()"
            size="md"
            color="secondary"
            round
            icon="fas fa-trash-alt"
            class="text-body1 text-white"
          />
        </div>
      </q-toolbar>
    </div>
    <div class="bg-grey-2 q-ma-md-md">
      <div class="row q-pa-sm">
        <div class="q-pt-md-md q-px-md-sm q-pt-xs-md col-md-6 col-xs-12">
          <q-select
            label="ตำแหน่ง"
            outlined
            :options="generalPosition"
            v-model="general.positionKey"
            emit-value
            map-options
          ></q-select>
        </div>
        <div class="q-pt-md-md q-px-md-sm q-pt-xs-md col-md-6 col-xs-12">
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
                      accept=".mp3"
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
                    <u @click="playsound(general.url)" class="cursor-pointer">ฟังเสียงคำศัพท์</u>
                  </div>
                </div>
                <div>
                  <q-btn
                    class="q-my-sm text-body1 text-blue-grey-10"
                    flat
                    @click="deleteSound()"
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

        <div class="q-pt-md-md q-px-md-sm q-pt-xs-lg col-md-6 col-xs-12">
          <q-input
            style="height:57px;"
            :rules="[ val => !!val ]"
            ref="vocabInput"
            outlined
            v-model="general.vocab"
            label="คำศัพท์"
          />
        </div>
        <div class="q-pt-md-md q-px-md-sm q-pt-xs-md col-md-6 col-xs-12">
          <q-input
            style="height:57px;"
            ref="meaning"
            :rules="[ val => !!val ]"
            outlined
            v-model="general.meaning"
            label="ความหมาย"
          />
        </div>
      </div>
      <div class="q-py-md row justify-center">
        <q-btn class="q-ma-sm btn" @click="backBtn()" label="ยกเลิก" />
        <q-btn class="q-ma-sm btn" @click="seveBtn()" color="secondary" label="บันทึก" />
        <div icon="fas fa-push"></div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { db } from "../router/index.js";
import { st } from "../router/index.js";
export default {
  data() {
    return {
      generalPosition: [],
      general: {
        positionKey: "",
        vocab: "",
        meaning: "",
        url: ""
      },
      position: "",
      isFile: false,
      file: "",
      isEditMode: false,
      titlePage: "เพิ่มคำศัพท์"
    };
  },
  methods: {
    //************************* */ โหลดตำแหน่ง
    loadPosition() {
      db.collection("Position")
        .get()
        .then(doc => {
          let temp = {
            value: "ทั่วไป",
            label: "***ทั่วไป***"
          };
          this.generalPosition.push(temp);
          this.general.positionKey = temp.value;
          doc.forEach(element => {
            let dataKey = {
              value: element.id,
              label: element.data().name
            };

            this.generalPosition.push(dataKey);
          });
        });
    },
    backBtn() {
      this.$router.push("/vocabulary");
    },
    //กดบันทึก
    async seveBtn() {
      this.$q.loading.show();
      let api = "https://api.winner-english.com/data/api/gettime.php";
      let response = await axios.get(api);
      let date = response.data[0].date;
      let microtime = response.data[0].microtime;
      this.$refs.vocabInput.validate();
      this.$refs.meaning.validate();
      if (this.$refs.vocabInput.hasError || this.$refs.meaning.hasError) {
        //กรณีใส่ข้อมูลไม่ครบ
        this.$q.notify({
          icon: "fas fa-exclamation-circle",
          message: "กรุณากรอกข้อมูลให้ครบ",
          color: "negative",
          position: "bottom",
          timeout: 1000
        });
        return;
      } else {
        //บันทึกเวลาใน draft
        db.collection("Vocabulary")
          .doc("draft")
          .set({
            saveDraft: microtime
          })
          .then(() => {
            if (this.isEditMode) {
              // กรณี่ edit mode
              let key = this.$route.params.key;
              db.collection("Vocabulary")
                .doc("draft")
                .collection("data")
                .doc(key)
                .update(this.general)
                .then(() => {
                  this.$q.loading.hide();
                  this.$q.notify({
                    icon: "fas fa-check-circle",
                    message: "บันทึกข้อมูลเรียบร้อย",
                    color: "secondary",
                    position: "bottom",
                    timeout: 1000
                  });
                  this.$router.push("/vocabulary");
                });
            } else {
              // กรณีเพิ่มใหม่
              db.collection("Vocabulary")
                .doc("draft")
                .collection("data")
                .add(this.general)
                .then(doc => {
                  //นำไฟล์เสียงเข้าสู่ระบบ
                  if (this.file != "") {
                    st.child("audios/vocab/" + doc.id + ".mp3")
                      .put(this.file[0])
                      .then(() => {
                        st.child("audios/vocab/" + doc.id + ".mp3")
                          .getDownloadURL()
                          .then(res => {
                            db.collection("Vocabulary")
                              .doc("draft")
                              .collection("data")
                              .doc(doc.id)
                              .update({
                                url: res
                              })
                              .then(() => {
                                this.$q.loading.hide();
                                this.$q.notify({
                                  icon: "fas fa-check-circle",
                                  message: "บันทึกข้อมูลเรียบร้อย",
                                  color: "secondary",
                                  position: "bottom",
                                  timeout: 1000
                                });
                                this.$router.push("/vocabulary");
                              });
                          });
                      });
                  } else {
                  }
                  this.$q.loading.hide();
                  this.$q.notify({
                    icon: "fas fa-check-circle",
                    message: "บันทึกข้อมูลเรียบร้อย",
                    color: "secondary",
                    position: "bottom",
                    timeout: 1000
                  });
                  this.$router.push("/vocabulary");
                });
            }
          });
      }
    },
    //ลบคำศัพท์
    async deleteBtn() {
      let api = "https://api.winner-english.com/data/api/gettime.php";
      let response = await axios.get(api);
      let date = response.data[0].date;
      let microtime = response.data[0].microtime;
      let key = this.$route.params.key;
      this.$q
        .dialog({
          class: "no-margin ",
          style: "padding: 0px;",
          title:
            "<div class='row'> <div class='col-11'> แจ้งเตือน </div><div class='col-1' align='right'></div> </div> ",
          html: true,
          message: "<div class='text-body1'>  ยืนยันการลบข้อมูล </div>",
          ok: "ยืนยัน",
          cancel: "ยกเลิก",
          persistent: true
        })
        .onOk(() => {
          db.collection("Vocabulary")
            .doc("draft")
            .set({
              saveDraft: microtime
            });
          db.collection("Vocabulary")
            .doc("draft")
            .collection("data")
            .doc(key)
            .delete()
            .then(() => {
              this.$q.notify({
                icon: "fas fa-check-circle",
                message: "ลบข้อมูลเรียบร้อย",
                color: "secondary",
                position: "bottom",
                timeout: 1000
              });
              this.$router.push("/vocabulary");
            });
        });
    },
    ///โหลดข้อมูลสำหรับ แก้ไขคำศัพท์
    loadData() {
      let key = this.$route.params.key;
      db.collection("Vocabulary")
        .doc("draft")
        .collection("data")
        .doc(key)
        .get()
        .then(data => {
          this.general = data.data();
          if (this.general.url != "") {
            this.isFile = true;
          }
        });
    },
    //เล่นเสียง
    playsound(url) {
      let audio = new Audio(url);
      setTimeout(() => {
        audio.play();
      }, 1000);
    },
    //ลบเสียง
    async deleteSound() {
      let key = this.$route.params.key;

      let api = "https://api.winner-english.com/data/api/gettime.php";
      let response = await axios.get(api);
      let date = response.data[0].date;
      let microtime = response.data[0].microtime;
      db.collection("Vocabulary")
        .doc("draft")
        .set({
          saveDraft: microtime
        });
      this.general.url = "";
      db.collection("Vocabulary")
        .doc("draft")
        .collection("data")
        .doc(key)
        .update({
          url: ""
        })
        .then(() => {
          st.child("audios/vocab/" + key + ".mp3")
            .delete()
            .then(() => {
              this.isFile = false;
            });
        });
    }
  },
  mounted() {
    this.loadPosition();
    this.$refs.vocabInput.focus();
    if (this.$route.name == "vocabularyedit") {
      this.loadData();
      this.isEditMode = true;
      this.titlePage = "แก้ไขคำศัพท์";
    }
  }
};
</script>
<style scoped >
.btn {
  width: 120px;
}
</style>