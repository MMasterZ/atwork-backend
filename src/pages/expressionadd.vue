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
            v-model="obj.orderid"
            label="รหัสลำดับ"
            mask="######"
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
                    <!-- ช่องเพิ่มเสียง หน้าเพิ่ม  -->
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
            <!-- ช่องเพิ่มเสียง แก้ไข -->
            <div v-if="isFile">
              <div class="row justify-between">
                <div class="q-my-xs q-pt-sm text-secondary">
                  <div class="text-body1 q-pt-xs q-px-sm">
                    <span class="text-grey-7">เสียง</span>
                    <q-icon class="q-px-md" name="fas  fa-play" />
                    <u @click="playsound(obj.url)" class="cursor-pointer">ฟังเสียงคำศัพท์</u>
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
            :disable="!isSeveBtn"
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
      ordernumber: "",
      textedit: "",
      isSeveBtn: true,
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
      isFile: false,
      editMode: false,
      db: {
        situation: db.collection("Situation"),
        position: db.collection("Position"),
        expression: db.collection("Expression").doc("draft"),
        expressionData: db
          .collection("Expression")
          .doc("draft")
          .collection("data")
      }
    };
  },
  methods: {
    // โหลดตำแหน่ง
    loadPosition() {
      this.loadingShow();
      this.db.position.get().then(doc => {
        this.positionArry = [];
        if (doc.size > 0) {
          doc.forEach(element => {
            let dataKey = {
              label: element.data().name,
              value: element.id
            };
            this.positionArry.push(dataKey);
          });
        }
        this.obj.positionKey = this.$q.localStorage.getItem("currentposition");
        this.loadSituation();
      });
    },
    // โหลดสถานการณ์
    loadSituation() {
      this.loadingShow();
      this.db.situation
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
            });
            if (this.$route.name == "expressionadd") {
              this.obj.situationKey = this.situationArry[0].value;
            } else {
            }
            this.loadingHide();
          } else {
            this.obj.situationKey = "-";
            this.loadingHide();
          }
        });
    },

    // โหลดเสียง หน้าแก้ไข
    async loadedit() {
      this.loadingShow();
      //check audio exists
      this.db.expressionData
        .doc(this.$route.params.key)
        .get()
        .then(doc => {
          // เปลี่ยน number เแป็น string
          let textString = {
            orderid: doc.data().orderid.toString()
          };
          this.ordernumber = {
            key: doc.data().orderid
          };

          this.obj = {
            ...doc.data(),
            ...textString
          };
          this.textedit = this.ordernumber.key;

          if (this.obj.url != "") {
            this.isFile = true;
          }
          this.loadPosition();
          // this.loadSituation()
        });
    },
    // ลบข้อมูลทั้งหมด
    async deleteBtnTop() {
      // แก้ไข
      let microtime = await this.loadTime();
      this.$q
        .dialog({
          title: "คำเตือน",
          message: "คุณต้องการลบข้อมูลนี้หรือไม่",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.db.expression.set({ saveDraft: microtime });
          st.child("audios/expression/" + this.$route.params.key + ".mp3")
            .delete()
            .then(url => {});
          this.db.expressionData.doc(this.$route.params.key).delete();
          this.$router.push("/expression");
        });
    },
    // ลบเสียง
    async deleteBtn() {
      this.$q
        .dialog({
          title: "คำเตือน",
          message: "คุณต้องการลบไฟล์เสียงนี้หรือไม่",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.isFile = false;
        });
    },
    // ปุ่มย้อนกลับ
    cencel() {
      this.$router.push("/expression");
    },
    // เล่นเสียง
    playsound(url) {
      let audio = new Audio(url);
      if (this.currentURL != "") {
        this.currentURL.pause();
      }
      setTimeout(() => {
        audio.play();
      }, 1000);

      this.currentURL = audio;
    },
    // บันทึกข้อมูล มีหน้าเพิ่ม และ แก้ไข
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
        this.notifyRed("กรุณากรอกข้อมูลให้ครบ");
        return;
      }
      // ไมโครทาม เซฟเวลาเข้าใน firebase
      let microtime = await this.loadTime();
      // บันทึกหน้าเพิ่ม
      if (this.$route.name == "expressionadd") {
        this.isSeveBtn = false;
        this.db.expressionData
          .where("orderid", "==", this.obj.orderid)
          .get()
          .then(doc => {
            if (doc.size > 0) {
              this.notifyRed("กรุณาตรวจสอบข้อมูลช้ำ");
            } else {
              this.loadingShow();
              this.db.expressionData.add(this.obj).then(doc => {
                this.db.expression.set({ saveDraft: microtime });
                this.notifyGreen("บันทึกข้อมูลเรียบร้อย");

                if (_this.file != "") {
                  st.child("audios/expression/" + doc.id + ".mp3")
                    .put(this.file[0])
                    .then(() => {
                      this.$q.loading.hide();
                      st.child("audios/expression/" + doc.id + ".mp3")
                        .getDownloadURL()
                        .then(res => {
                          this.db.expressionData.doc(doc.id).update({
                            url: res
                          });
                          this.$router.push("/expression");
                        });
                    });
                } else {
                  this.loadingHide();
                  this.db.expressionData.doc(doc.id).update({
                    url: ""
                  });
                  this.isSeveBtn = true;
                  _this.$router.push("/expression");
                }
              });
            }
          });
      }
      // บันทึกหน้าแก้ไข
      else {
        if (this.textedit != this.obj.orderid) {
          this.db.expressionData
            .where("orderid", "==", this.obj.orderid)
            .get()
            .then(doc => {
              if (doc.size > 0) {
                this.notifyRed("กรุณาตรวจสอบข้อมูลช้ำ");
              } else {
                this.isSeveBtn = false;
                this.loadingShow();
                this.db.expression.set({ saveDraft: microtime });
                this.db.expressionData
                  .doc(this.$route.params.key)
                  .set(this.obj)
                  .then(() => {
                    if (_this.file != "") {
                      st.child(
                        "audios/expression/" + this.$route.params.key + ".mp3"
                      )
                        .put(this.file[0])
                        .then(() => {
                          this.$q.loading.hide();
                          this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                          st.child(
                            "audios/expression/" +
                              this.$route.params.key +
                              ".mp3"
                          )
                            .getDownloadURL()
                            .then(res => {
                              this.db.expressionData
                                .doc(this.$route.params.key)
                                .update({
                                  url: res
                                });
                              this.$router.push("/expression");
                            });
                          // this.$router.push("/expression");
                        });
                    } else {
                      this.loadingHide();
                      if (_this.isFile == false) {
                        this.db.expressionData
                          .doc(this.$route.params.key)
                          .update({
                            url: ""
                          });
                        this.isSeveBtn = true;
                        this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                        _this.$router.push("/expression");
                      }
                    }
                  });
              }
            });
        } else {
          this.isSeveBtn = false;
          this.loadingShow();
          this.db.expression.set({ saveDraft: microtime });
          this.db.expressionData
            .doc(this.$route.params.key)
            .set(this.obj)
            .then(() => {
              if (this.isFile) {
                this.loadingHide();
                this.$router.push("/expression");
              } else {
                st.child("audios/expression/" + this.$route.params.key + ".mp3")
                  .delete()
                  .then(() => {
                    this.loadingHide();
                    this.$router.push("/expression");
                  });
              }
              // if (_this.file != "") {
              //   st.child("audios/expression/" + this.$route.params.key + ".mp3")
              //     .put(this.file[0])
              //     .then(() => {
              //       this.$q.loading.hide();
              //       this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
              //       st.child(
              //         "audios/expression/" + this.$route.params.key + ".mp3"
              //       )
              //         .getDownloadURL()
              //         .then(res => {
              //           this.db.expressionData
              //             .doc(this.$route.params.key)
              //             .update({
              //               url: res
              //             });
              //           this.$router.push("/expression");
              //         });

              //     });
              // } else {
              //   this.loadingHide();
              //   if (_this.isFile == false) {
              //     this.db.expressionData.doc(this.$route.params.key).update({
              //       url: ""
              //     });
              //     this.isSeveBtn = true;
              //     this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
              //     _this.$router.push("/expression");
              //   }
              // }
            });
        }
      }
    }
  },
  mounted() {
    if (this.$route.name == "expressionedit") {
      this.titlePage = "แก้ไขประโยค";
      this.editMode = true;
      this.loadedit();
    } else {
      this.$refs.order.focus();
      this.editMode = false;
      this.loadPosition();
    }
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