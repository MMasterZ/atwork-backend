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
              label="ตำแหน่ง"
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
                  @click="deletelog(index,item.situationKey)"
                  @remove="deletelog(index,item.situationKey)"
                  removable
                  v-for="(item,index ) in  situationArry "
                  :key="index"
                  class="q-ma-sm"
                  color="secondary"
                  text-color="grey-2"
                >{{item.name}}</q-chip>
              </div>
            </div>
          </div>

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
      situationArry: []
    };
  },
  methods: {
    loadData() {
      this.$q.loading.show({
        delay: 400 // ms
      });
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
              this.$q.loading.hide();
            });
        });
    },
    deleteBtn() {
      if (this.situationArry.length) {
        this.$q.notify({
          icon: "fas fa-exclamation-circle",
          message: "มีสถานการณ์อยู่ไม่สามารถลบได้",
          color: "negative",
          position: "bottom",
          timeout: 1000
        });
        return;
      }

      db.collection("CustomerAccounts")
        .where("positionKey", "==", this.$route.params.key)
        .get()
        .then(doc => {
          if (doc.size > 0) {
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
                this.$q.notify({
                  icon: "fas fa-exclamation-circle",
                  message: "มีผู้ใช้งานอยู่ไม่สามารลบได้",
                  color: "negative",
                  position: "bottom",
                  timeout: 1000
                });
              });
          } else {
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
                db.collection("Position")
                  .doc(this.$route.params.key)
                  .delete();
                this.$router.push("/position");
                this.$q.notify({
                  icon: "fas fa-check-circle",
                  message: "ลบข้อมูลเรียบร้อย",
                  color: "secondary",
                  position: "bottom",
                  timeout: 1000
                });
              });
          }
        });
    },
    deletelog(index, key) {
      console.log(index, key);
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
            db.collection("Situation")
              .doc(key)
              .delete()
              .then(() => {
                db.collection("CustomerAccounts")
                  .where("departmentKey", "==", key)
                  .get()
                  .then(doc => {
                    doc.forEach(element => {
                      db.collection("CustomerAccounts")
                        .doc(element.id)
                        .update({
                          departmentKey: this.departmentsArr[0].departmentsKey
                        });
                    });
                  });
                this.situationArry.splice(index, 1);
                this.$q.notify({
                  icon: "fas fa-check-circle",
                  message: "ลบข้อมูลเรียบร้อย",
                  color: "secondary",
                  position: "bottom",
                  timeout: 1000
                });
              });
          });
      } else {
        this.situationArry.splice(index, 1);
      }
    },
    addSituation() {
      if (this.situation.name == "") {
        this.$q.notify({
          icon: "fas fa-exclamation-circle",
          message: "กรุณากรอกชื่อแผนก",
          color: "negative",
          position: "bottom",
          timeout: 1000
        });
      } else {
        this.isSituationSeve = false;
        if (this.$route.name == "positionedit") {
          db.collection("Situation")
            .where("positionKey", "==", this.$route.params.key)
            .where("name", "==", this.situation.name)
            .get()
            .then(doc => {
              if (doc.size > 0) {
                this.$q.notify({
                  icon: "fas fa-exclamation-circle",
                  message: "สถานการณ์ช้ำ",
                  color: "negative",
                  position: "bottom",
                  timeout: 1000
                });
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
            this.$q.notify({
              icon: "fas fa-exclamation-circle",
              message: "กรุณากรอกสถานการณ์",
              color: "negative",
              position: "bottom",
              timeout: 1000
            });
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
              this.$q.notify({
                icon: "fas fa-exclamation-circle",
                message: "สถานการณ์ช้ำ",
                color: "negative",
                position: "bottom",
                timeout: 1000
              });
            }
            this.isSituationSeve = true;
            this.isHasSituation = false;
            this.situation.name = "";
          }
        }
      }
    },
    seveBtn() {
      this.$refs.isorder.validate();
      this.$refs.isposition.validate();
      if (
        this.$refs.isorder.hasError ||
        this.$refs.isposition.hasError ||
        (this.position.orderid == "" && this.position.name == "")
      ) {
        this.$q.notify({
          icon: "fas fa-exclamation-circle",
          message: "กรุณากรอกข้อมูลให้ครบถ้วน",
          color: "negative",
          position: "bottom",
          timeout: 1000
        });
        return;
      }
      if (this.situation.name == "" && this.situationArry.length < 1) {
        this.isHasSituation = true;
        this.$q.notify({
          icon: "fas fa-exclamation-circle",
          message: "กรุณากรอกสถานการณ์",
          color: "negative",
          position: "bottom",
          timeout: 1000
        });
        return;
      } else {
        // else if (this.position.orderid || this.position.name) {
        //   if (this.position.orderid == "") {
        //   } else if (this.position.name == "") {
        //   }
        // }
        if (this.$route.name == "positionedit") {
          this.isSeveBtn = false;
          if (
            this.textOrderid == this.position.orderid &&
            this.textName == this.position.name
          ) {
            this.$q.notify({
              icon: "fas fa-check-circle",
              message: "บันทึกข้อมูลเรียบร้อย",
              color: "secondary",
              position: "bottom",
              timeout: 1000
            });
            this.$router.push("/position");
          } else if (this.position.orderid || this.position.name) {
            if (this.textOrderid == this.position.orderid) {
              db.collection("Position")
                .where("name", "==", this.position.name)
                .get()
                .then(doc => {
                  if (doc.size > 0) {
                    this.$q.notify({
                      icon: "fas fa-exclamation-circle",
                      message: "กรุณาตรวจสอบข้อมูลช้ำ",
                      color: "negative",
                      position: "bottom",
                      timeout: 1000
                    });
                  } else {
                    db.collection("Position")
                      .doc(this.$route.params.key)
                      .set(this.position);
                    this.$q.notify({
                      icon: "fas fa-check-circle",
                      message: "บันทึกข้อมูลเรียบร้อย",
                      color: "secondary",
                      position: "bottom",
                      timeout: 1000
                    });
                    this.$router.push("/position");
                  }
                });
            } else if (this.textName == this.position.name) {
              db.collection("Position")
                .where("orderid", "==", this.position.orderid)
                .get()
                .then(doc => {
                  if (doc.size > 0) {
                    this.$q.notify({
                      icon: "fas fa-exclamation-circle",
                      message: "กรุณาตรวจสอบข้อมูลช้ำ",
                      color: "negative",
                      position: "bottom",
                      timeout: 1000
                    });
                  } else {
                    db.collection("Position")
                      .doc(this.$route.params.key)
                      .set(this.position);
                    this.$q.notify({
                      icon: "fas fa-check-circle",
                      message: "บันทึกข้อมูลเรียบร้อย",
                      color: "secondary",
                      position: "bottom",
                      timeout: 1000
                    });
                    this.isSeveBtn = true;
                    this.$router.push("/position");
                  }
                });
            }
          }
        } else {
          if (this.position.orderid && this.position.name) {
            db.collection("Position")
              .where("orderid", "==", this.position.orderid)
              .get()
              .then(doc => {
                if (doc.size > 0) {
                  this.$q.notify({
                    icon: "fas fa-exclamation-circle",
                    message: "กรุณาตรวจสอบข้อมูลช้ำ",
                    color: "negative",
                    position: "bottom",
                    timeout: 1000
                  });
                } else {
                  if (
                    this.situation.name == "" &&
                    this.situationArry.length < 1
                  ) {
                    this.isHasSituation = true;
                    this.$q.notify({
                      icon: "fas fa-exclamation-circle",
                      message: "กรุณากรอกสถานการณ์",
                      color: "negative",
                      position: "bottom",
                      timeout: 1000
                    });
                  } else {
                    this.isSeveBtn = false;

                    if (this.position.name.length > 0) {
                      db.collection("Position")
                        .where("name", "==", this.position.name)
                        .get()
                        .then(doc => {
                          if (doc.size > 0) {
                            this.isSeveBtn = true;
                            this.$q.notify({
                              icon: "fas fa-exclamation-circle",
                              message: "กรุณาตรวจสอบข้อมูลช้ำ",
                              color: "negative",
                              position: "bottom",
                              timeout: 1000
                            });
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
                                  this.$router.push("/position");
                                  this.isHasSituation = false;
                                  this.isSeveBtn = true;
                                  this.$q.notify({
                                    icon: "fas fa-check-circle",
                                    message: "บันทึกข้อมูลเรียบร้อย",
                                    color: "secondary",
                                    position: "bottom",
                                    timeout: 1000
                                  });
                                });
                            }
                          }
                        });
                    }
                  }
                }
              });
          }
        }
      }
    },
    backBtn() {
      this.$router.push("/position");
    }
  },
  mounted() {
    if (this.$route.name == "positionedit") {
      this.loadData();
      this.title = "แก้ไขตำแหน่ง";
    } else {
      this.title = "เพิ่มตำแหน่ง";
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
