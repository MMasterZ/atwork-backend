<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <q-space />
        <div class="desktop-only text-grey-2 text-h4">{{title}}</div>
        <div class="mobile-only text-grey-2 text-h5">{{title}}</div>
        <q-space />
        <div align="right" class="q-pr-sm">
          <q-btn
            v-show="this.$route.name == 'positionedit'"
            @click="deleteBtn()"
            size="md"
            color="secondary"
            round
            icon="fas fa-trash-alt"
            class="text-body1 text-grey-2"
          />
        </div>
      </q-toolbar>
    </div>
    <div class="q-pa-md-md">
      <div class="bg-grey-2">
        <div class="row q-px-sm q-py-md">
          <div style="height:50px " class="q-px-sm q-mb-lg col-md-6 col-xs-12">
            <q-input
              ref="isorder"
              :rules="[ val => !!val ]"
              outlined
              type="number"
              v-model.number="position.orderid"
              label="ลำดับ"
            />
          </div>
          <div style="height:50px " class="q-px-sm q-mb-lg col-md-6 col-xs-12">
            <q-input
              ref="isposition"
              :rules="[ val => !!val ]"
              outlined
              v-model="position.name"
              label="บทเรียน"
            />
          </div>
          <div style="width: 100%" class="box q-mx-sm rounded-borders">
            <div class="row q-pa-sm q-my-sm">
              <div style="height:60px " class="col-md-6 col-xs-10 q-px-sm">
                <q-input
                  :error="isHasSituation"
                  outlined
                  v-model="situation.name"
                  label="สถานการณ์"
                />
              </div>
              <div class="col-md-6 q-pa-sm col-xs-2 self-center">
                <q-btn
                  size="md"
                  :disable="!isSituationSeve"
                  @click="addSituation()"
                  color="secondary"
                  round
                  icon="fas fa-plus"
                  class="text-body1"
                />
              </div>
              <div class="q-py-xs">
                <q-chip
                  clickable
                  @click="editSituation(index, item.situationKey)"
                  v-for="(item,index ) in  situationArry "
                  :key="index"
                  class="q-ma-sm"
                  color="secondary"
                  text-color="grey-2"
                >{{item.name}}</q-chip>
              </div>
            </div>
          </div>

          <!-- ส่วนแก้ไข -->
          <q-dialog v-model="isSituationEdit" persistent>
            <q-card style="min-width: 400px">
              <q-card-section align="center" class="relative-position">
                <div class="text-body1">แก้ไขสถานการณ์</div>
                <div class="absolute-right q-pa-sm">
                  <q-btn
                    v-close-popup
                    round
                    flat
                    size="md"
                    class="text-white bg-secondary text-body1"
                    icon="fas fa-trash-alt"
                    @click="deletelog(iGetIndex ,iGetKey)"
                  />
                </div>
              </q-card-section>

              <q-card-section>
                <q-input dense v-model="situation.name" autofocus @keyup.enter="prompt = false" />
              </q-card-section>

              <q-card-actions align="center" class="text-primary">
                <q-btn
                  style="width:120px"
                  text-color="black"
                  color="grey-2"
                  label="ยกเลิก"
                  v-close-popup
                  @click="cancelSituation()"
                />
                <q-btn
                  style="width:120px"
                  color="secondary"
                  label="บันทึก"
                  v-close-popup
                  @click="saveSituation(iGetKey)"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <div class="col-12 q-pt-md row justify-center">
            <q-btn
              class="q-ma-sm"
              @click="backBtn()"
              style="width:120px"
              text-color="black"
              color="grey-2"
              label="ยกเลิก"
            />
            <q-btn
              class="q-ma-sm btn"
              @click="seveBtn()"
              style="width:120px"
              color="secondary"
              label="บันทึก"
              :disable="!isSeveBtn"
            />
            <div icon="fas fa-push"></div>
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
      isSeveBtn: true,
      isSituationSeve: true,
      textOrderid: "",
      textName: "",
      title: "",
      isHasSituation: false,
      position: { orderid: "", name: "", status: true },
      situation: { positionKey: "", name: "" },
      situationArry: [],
      isSituationEdit: false,
      iGetKey: "",
      iGetIndex: ""
    };
  },
  methods: {
    // โหลดข้อมูลของ ตำแหน่ง ลำดับ และ สถานการ์ ของ หน้าแก้ไข
    loadData() {
      this.loadingShow();
      db.collection("Position")
        .doc(this.$route.params.key)
        .get()
        .then(doc => {
          this.position = doc.data();
          this.textOrderid = doc.data().orderid;
          this.textName = doc.data().name;
          db.collection("Situation")
            .where("positionKey", "==", this.$route.params.key)
            .get()
            .then(doc => {
              let newSituation = [];
              doc.forEach(element => {
                let dataKey = {
                  situationKey: element.id
                };
                let final = {
                  ...dataKey,
                  ...element.data()
                };
                newSituation.push(final);
              });
              newSituation.sort((a, b) => {
                return a.name - b.name ? -1 : 1;
              });
              this.situationArry = newSituation;
              this.loadingHide();
            });
        });
    },
    // เช็คการว่ามีการใช้งานอยู่หรือไม่
    async loadDataCheck() {
      if (this.situationArry.length > 0) {
        this.notifyRed("มีสถานการณ์อยู่ไม่สามารถลบได้");
        return;
      }

      this.loadingShow();
      let positionKey = this.$route.params.key;

      let customerCheck = await db
        .collection("CustomerAccounts")
        .where("positionKey", "==", positionKey)
        .get();

      let dialogDraftCheck = await db
        .collection("Dialog")
        .doc("draft")
        .collection("data")
        .where("positionSelec", "array-contains", positionKey)
        .get();

      let dialogServerCheck = await db
        .collection("Dialog")
        .doc("server")
        .collection("data")
        .where("positionSelec", "array-contains", positionKey)
        .get();

      let vocabDraftCheck = await db
        .collection("Vocabulary")
        .doc("draft")
        .collection("data")
        .where("positionKey", "==", positionKey)
        .get();

      let vocabServerCheck = await db
        .collection("Vocabulary")
        .doc("server")
        .collection("data")
        .where("positionKey", "==", positionKey)
        .get();

      // console.log(
      //   customerCheck.size,
      //   dialogServerCheck.size,
      //   dialogDraftCheck.size,
      //   vocabDraftCheck.size,
      //   vocabServerCheck.size
      // );

      if (customerCheck.size > 0) {
        this.notifyRed("มีผู้ใช้งานอยู่ไม่สามารลบได้");
      } else if (dialogDraftCheck.size > 0 || dialogServerCheck.size > 0) {
        this.notifyRed("มีบทสนทนาใช้งานอยู่ไม่สามารลบได้");
      } else if (vocabDraftCheck.size > 0 || vocabServerCheck.size > 0) {
        this.notifyRed("มีคำศัพท์ใช้งานอยู่ไม่สามารลบได้");
      } else {
        //Delete data from PositionSelected
        db.collection("CustomerAccounts")
          .get()
          .then(async userDoc => {
            for (const userData of userDoc.docs) {
              // console.log(userData.id, positionKey);
              await db
                .collection("CustomerAccounts")
                .doc(userData.id)
                .collection("PositionSelected")
                .doc(positionKey)
                .delete();
            }
            db.collection("Position")
              .doc(positionKey)
              .delete()
              .then(() => {
                this.notifyGreen("ลบข้อมูลเรียบร้อย");
                this.$router.push("/lesson");
              });
          });
      }
      this.loadingHide();
    },
    // ปุ่มลบข้อมูลทั้งหมด หน้าแก้ไข
    deleteBtn() {
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
          this.loadDataCheck();
        });
    },
    // การลบสถานการณ์มีการแจ้งเตือน มีผู้ใช้งานอยู่ไหม ถ้ามีจะต้องลบไม่ได้ ถ้าไม่มีให้ลบได้เลย
    deletelog(index, key) {
      if (this.$route.name == "positionedit") {
        this.$q
          .dialog({
            class: "no-margin ",
            style: "padding: 0px;",
            title:
              "<div class='row'> <div class='col-11'> ลบข้อมูล </div><div class='col-1' align='right'></div> </div> ",
            html: true,
            message: "<div class='text-body1'>  ยืนยันการลบข้อมูล </div>",
            ok: "ยืนยัน",
            cancel: "ยกเลิก",
            persistent: true
          })
          .onOk(() => {
            this.loadingShow();
            // เช็คการใช้งานของประโยคถ้ามีการใช้จะลบไม่ได้
            db.collection("Expression")
              .doc("draft")
              .collection("data")
              .where("situationKey", "==", key)
              .get()
              .then(doc => {
                // console.log(doc.size);
                if (doc.size > 0) {
                  this.situation.name = "";
                  this.notifyRed("ถูกใช้งานอยู่ ไม่สามารถลบได้");
                  this.loadingHide();
                } else {
                  db.collection("Situation")
                    .doc(key)
                    .delete()
                    .then(() => {
                      this.situation.name = "";
                      this.notifyGreen("ลบข้อมูลเรียบร้อย");
                      this.loadData();
                      this.loadingHide();
                    });
                }
              });
          })
          .onCancel(() => {
            this.editSituation(index, key);
          });
      } else {
        this.situationArry.splice(index, 1);
      }
    },
    // การเพื่มข้อมูลของสถานการณ์
    addSituation() {
      if (this.situation.name == "") {
        this.notifyRed("กรุณากรอกชื่อสถานการณ์");
      } else {
        this.isSituationSeve = false;
        if (this.$route.name == "positionedit") {
          db.collection("Situation")
            .where("positionKey", "==", this.$route.params.key)
            .where("name", "==", this.situation.name)
            .get()
            .then(doc => {
              if (doc.size > 0) {
                this.notifyRed("สถานการณ์ช้ำ");
                this.isSituationSeve = true;
              } else {
                let theKey = {
                  positionKey: this.$route.params.key,
                  name: this.situation.name
                };
                db.collection("Situation")
                  .add(theKey)
                  .then(doc => {
                    let dataKey = {
                      positionKey: doc.id
                    };
                    let final = {
                      ...dataKey,
                      ...theKey
                    };
                    this.isSituationSeve = true;
                    this.situationArry.push(final);
                    this.situation.name = "";
                  });
              }
            });
        } else {
          if (this.situation.name == "") {
            this.isHasSituation = true;
            this.notifyRed("กรุณากรอกสถานการณ์");
          } else {
            this.isSituationSeve = false;
            let dataKey;
            if (
              this.situationArry.length > 0 ||
              this.situationArry.length == 0
            ) {
              dataKey = {
                name: this.situation.name
              };
            }
            let checkDup = false;
            for (let i = 0; i < this.situationArry.length; i++) {
              if (this.situationArry[i].name == this.situation.name) {
                // มีซ้ำ
                checkDup = true;
              }
            }
            if (!checkDup) {
              this.situationArry.push(dataKey);
            } else {
              this.notifyRed("สถานการณ์ช้ำ");
            }
            this.isSituationSeve = true;
            this.isHasSituation = false;
            this.situation.name = "";
          }
        }
      }
    },
    // ปุ่มบันทึกเพื่มข้อมูล และ แก้ไขข้อมูล
    seveBtn() {
      this.$refs.isorder.validate();
      this.$refs.isposition.validate();
      if (
        this.$refs.isorder.hasError ||
        this.$refs.isposition.hasError ||
        (this.position.orderid == "" && this.position.name == "")
      ) {
        this.notifyRed("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
      // การบันทึกแก้ไข
      if (this.situation.name == "" && this.situationArry.length < 1) {
        this.isHasSituation = true;
        this.notifyRed("กรุณากรอกสถานการณ์");
        return;
      }
      this.isSeveBtn = false;
      if (this.$route.name == "positionedit") {
        if (
          this.textOrderid == this.position.orderid &&
          this.textName == this.position.name
        ) {
          this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
          this.$router.push("/lesson");
        } else if (this.position.orderid || this.position.name) {
          if (this.textOrderid == this.position.orderid) {
            db.collection("Position")
              .where("name", "==", this.position.name)
              .get()
              .then(doc => {
                if (doc.size > 0) {
                  this.notifyRed("กรุณาตรวจสอบข้อมูลช้ำ");
                } else {
                  db.collection("Position")
                    .doc(this.$route.params.key)
                    .set(this.position);
                  this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                  this.$router.push("/lesson");
                }
              });
          } else if (this.textName == this.position.name) {
            db.collection("Position")
              .where("orderid", "==", this.position.orderid)
              .get()
              .then(doc => {
                if (doc.size > 0) {
                  this.notifyRed("กรุณาตรวจสอบข้อมูลช้ำ");
                } else {
                  db.collection("Position")
                    .doc(this.$route.params.key)
                    .set(this.position);
                  this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                  this.isSeveBtn = true;
                  this.$router.push("/lesson");
                }
              });
          }
        }
      } else {
        // การบันทึกเพิ่ม
        db.collection("Position")
          .where("orderid", "==", this.position.orderid)
          .get()
          .then(doc => {
            // เช็ค orderid ซ้ำ
            if (doc.size > 0) {
              this.notifyRed("กรุณาตรวจสอบลำดับช้ำ");
            } else {
              if (this.situation.name == "" && this.situationArry.length < 1) {
                // เช็ค ชื่อสถานการณ์ มีการกรอกข้อมูลไม
                this.isHasSituation = true;
                this.notifyRed("กรุณากรอกสถานการณ์");
              } else {
                this.isSeveBtn = false;

                if (this.position.name.length > 0) {
                  db.collection("Position")
                    .where("name", "==", this.position.name)
                    .get()
                    .then(doc => {
                      if (doc.size > 0) {
                        this.isSeveBtn = true;
                        this.notifyRed("กรุณาตรวจสอบชื่อบทเรียนช้ำ");
                        setTimeout(() => {}, 1500);
                      } else {
                        if (this.situationArry.length > 0) {
                          db.collection("Position")
                            .add(this.position)
                            .then(doc => {
                              for (
                                let xx = 0;
                                xx < this.situationArry.length;
                                xx++
                              ) {
                                this.situationArry[xx].positionKey = doc.id;
                                db.collection("Situation").add(
                                  this.situationArry[xx]
                                );
                              }
                              this.loadingShow();
                              //add lesson into each user
                              db.collection("CustomerAccounts")
                                .get()
                                .then(async docuser => {
                                  for (const datauser of docuser.docs) {
                                    await db
                                      .collection("CustomerAccounts")
                                      .doc(datauser.id)
                                      .collection("PositionSelected")
                                      .doc(doc.id)
                                      .set({
                                        isUse: false,
                                        name: this.position.name,
                                        orderid: this.position.orderid,
                                        status: true
                                      });
                                  }
                                  this.loadingHide();
                                  this.isHasSituation = false;
                                  this.isSeveBtn = true;
                                  this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                                  this.$router.push("/lesson");
                                });
                            });
                        } else {
                          this.isSeveBtn = true;
                          this.notifyRed("กรุณากรอกสถานการณ์");
                        }
                      }
                    });
                }
              }
            }
          });
      }
    },

    backBtn() {
      this.$router.push("/lesson");
    },

    // กดเพื่อให้ขึ้น ไดอะล็อค เพื่อแก้ไขและลบ
    editSituation(index, key) {
      this.isSituationEdit = true;

      if (this.$route.name == "positionedit") {
        this.iGetKey = key;
        this.iGetIndex = index;
        db.collection("Situation")
          .doc(key)
          .get()
          .then(doc => {
            this.situation.name = doc.data().name;
            this.situation.positionKey = this.$route.params.key;
          });
      } else {
        this.iGetIndex = index;
        this.situation.name = this.situationArry[index].name;
      }
    },
    // ทำการยกเลิกการแก้ไขข้อมูล
    cancelSituation() {
      this.situation.name = "";
    },
    // ทำการเปลี่ยนข้อมูลใน situation
    saveSituation(key) {
      if (this.$route.name == "positionedit") {
        db.collection("Situation")
          .doc(key)
          .set(this.situation)
          .then(doc => {
            this.situation.name = "";
            this.situation.positionKey = "";
            this.loadData();
          });
      } else {
        this.situationArry[this.iGetIndex].name = this.situation.name;
        this.situation.name = "";
      }
    }
  },
  mounted() {
    if (this.$route.name == "positionedit") {
      this.loadData();
      this.title = "แก้ไขบทเรียน";
    } else {
      this.title = "เพิ่มบทเรียน";
    }
  }
};
</script>
<style scoped>
.box {
  max-height: fit-content;
  min-height: calc(100vh - 700px);
  border: 1px solid #bdbdbd;
}
.btn {
  width: 140px;
}
</style>
