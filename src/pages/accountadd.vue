<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">{{titleName}}</div>
        <div class="desktop-only text-grey-2 text-h4">{{titleName}}</div>
        <q-space />
        <div align="right" class="q-pr-sm" v-if="!isAddMode">
          <q-btn
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
        <div class="row justify-center q-pt-lg" align="center">
          <div class="col-md-6 col-xs-12">
            <div class="q-px-md box">
              <q-select
                v-model="userObj.businessKey"
                :options="options"
                outlined
                emit-value
                map-options
                @input="loadDepartment()"
              ></q-select>
            </div>
          </div>
        </div>
        <div class="row q-px-sm">
          <div class="col-md-6 col-xs-12 q-pa-sm box">
            <q-input
              label="ชื่อพนักงาน"
              outlined
              v-model="userObj.name"
              :rules="[value => value.length >0]"
              ref="name"
            ></q-input>
          </div>
          <div class="col-md-6 col-xs-12 q-pa-sm box">
            <q-input
              label="นามสกุล"
              outlined
              v-model="userObj.surname"
              :rules="[value => !!value]"
              ref="surname"
            ></q-input>
          </div>
          <div class="col-md-6 col-xs-12 q-pa-sm">
            <q-select label="เพศ" outlined v-model="userObj.sex" :options="sexOptions"></q-select>
          </div>
          <div class="col-md-6 col-xs-12 q-pa-sm box">
            <q-input
              label="เบอร์โทรศัพท์"
              outlined
              mask="###-###-####"
              v-model="userObj.tel"
              :rules="[value => value.length >= 12 ]"
              ref="tel"
            ></q-input>
          </div>
          <div class="col-md-6 col-xs-12 q-pa-sm">
            <q-input label="E-mail" outlined v-model="userObj.email"></q-input>
          </div>
          <div class="col-md-6 col-xs-12 q-pa-sm">
            <q-input
              readonly
              label="รหัสผ่าน"
              outlined
              :value="userObj.tel.substring(8)"
              v-if="this.$route.name!='accountedit'"
            ></q-input>
            <q-input
              label="รหัสผ่าน"
              outlined
              v-model="userObj.password"
              v-show="this.$route.name=='accountedit'"
              mask="####"
            ></q-input>
          </div>
          <div class="col-md-6 col-xs-12 q-pa-sm">
            <q-select
              label="แผนก"
              outlined
              v-model="userObj.departmentKey"
              :options="departmentOptions"
              emit-value
              map-options
            ></q-select>
          </div>
          <div class="col-md-6 col-xs-12 q-pa-sm">
            <q-select
              label="บทเรียน"
              outlined
              v-model="userObj.positionKey"
              :options="positionOptions"
              emit-value
              map-options
            ></q-select>
          </div>
        </div>

        <div class="q-py-lg row justify-center" align="center ">
          <q-btn
            label="ยกเลิก"
            class="bg-grey-2 text-blue-grey-10 q-mx-sm"
            style="width:140px"
            @click="cencel()"
          ></q-btn>
          <q-btn
            label="บันทึก"
            class="bg-secondary text-white q-mx-sm"
            style="width:140px"
            @click="saveData()"
          ></q-btn>
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
      vocabData: "",
      userObj: {
        businessKey: "",
        name: "",
        surname: "",
        sex: "ชาย",
        tel: "",
        email: "",
        password: "",
        departmentKey: "",
        positionKey: "",
        status: true
      },
      titleName: "",
      options: [],
      sexOptions: ["หญิง", "ชาย"],
      departmentOptions: [],
      positionOptions: [],
      isSaveData: false,
      oldPhoneNumber: "",
      isAddMode: true
    };
  },
  methods: {
    //โหลดสถานประกอบการที่มีสถานะเป็นture
    loadBsiness() {
      this.loadingShow();
      db.collection("Business")
        .where("status", "==", true)
        .get()
        .then(doc => {
          doc.forEach(element => {
            let businessData = {
              value: element.id,
              label: element.data().name
            };

            this.options.push(businessData);
          });
          // เรียงสถานประกอบการตามตัวอักษร
          this.options.sort((a, b) => {
            return a.label - b.label ? 1 : -1;
          });
          this.userObj.businessKey = this.$q.localStorage.getItem("business");
          // this.userObj.businessKey = this.$route.params.businesskey;
          this.loadDepartment();
        });
    },
    //โหลดแผนก
    loadDepartment() {
      this.loadingShow();
      this.departmentOptions = [];
      db.collection("Department")

        .where("businessKey", "==", this.userObj.businessKey)
        .get()
        .then(doc => {
          let newDepart = [];
          doc.forEach(element => {
            let departmentData = {
              value: element.id,
              label: element.data().name
            };
            newDepart.push(departmentData);
          });
          // การหาแผนก ของ ไม่ระบุ
          let indexOf = newDepart
            .map(function(e) {
              return e.label;
            })
            .indexOf("ไม่ระบุแผนก");

          let extractValue = newDepart[indexOf];
          // // นำ เอาค่า ไม่ระบุแผนกออกจาก Array
          newDepart.splice(indexOf, 1);
          // เรียงตามตัวอักษร
          newDepart.sort((a, b) => {
            return a.label - b.label ? -1 : 1;
          });
          newDepart.splice(0, 0, extractValue);
          this.departmentOptions = newDepart;
          this.userObj.departmentKey = this.departmentOptions[0].value;
          this.loadPosition();
        });
    },
    //โหลดตำแหน่ง
    loadPosition() {
      this.positionOptions = [];
      db.collection("Position")
        // .where("businessKey", "==", this.userObj.businessKey)
        .where("status", "==", true)
        .get()
        .then(doc => {
          doc.forEach(element => {
            let PositionData = {
              value: element.id,
              label: element.data().name
            };
            this.positionOptions.push(PositionData);
          });

          this.userObj.positionKey = this.positionOptions[0].value;
          if (this.$route.name == "accountedit") {
            this.loadEdit();
          } else {
            this.loadingHide();
          }
        });
    },
    //บันทึก
    async saveData() {
      //   db.collection("CustomerAccounts").add(this.userObj);
      this.$refs.tel.validate(); // ช่องเบอร์โทร
      this.$refs.name.validate(); // ช่องชื่อพนักงาน
      this.$refs.surname.validate(); // ช่องนามสกุล
      //ถ้าไม่ได้กรอกข้อมูล
      if (
        this.$refs.name.hasError ||
        this.$refs.surname.hasError ||
        this.$refs.tel.hasError
      ) {
        //ขึ้นแจ้งเตือน
        this.notifyRed("กรุณากรอกข้อมูลให้ครบ");

        return;
      } else {
        this.loadingShow();

        this.isSaveData = true;
        //บันทึกหน้าแอดผู้ใช้งาน
        if (this.$route.name == "accountadd") {
          this.userObj.password = this.userObj.tel.substring(8);
          this.userObj.tel = this.userObj.tel.replace(/-/g, "");
          db.collection("CustomerAccounts")
            .where("tel", "==", this.userObj.tel)
            .get()
            .then(doc => {
              //ถ้าเบอร์โทรซ้ำ
              if (doc.size > 0) {
                this.notifyRed("เบอร์โทรศัพท์นี้มีผู้ใช้งานแล้ว");
                this.loadingHide();
                this.isSaveData = false;
              } else {
                //ถ้าเบอร์ไม่ซ้ำให้บันทึกแบบเอาขีดออก

                this.userObj.tel = this.userObj.tel.replace(/-/g, "");
                db.collection("CustomerAccounts")
                  .add(this.userObj)
                  .then(async docAdd => {
                    //ทำการ update Vocabulary / PositionSelected
                    await db
                      .collection("Vocabulary")
                      .doc("server")
                      .collection("data")
                      .get()
                      .then(async doc => {
                        for (const docvocab of doc.docs) {
                          await db
                            .collection("CustomerAccounts")
                            .doc(docAdd.id)
                            .collection("Vocabulary")
                            .doc(docvocab.id)
                            .set({
                              correct: 0,
                              incorrect: 0,
                              meaning: docvocab.data().meaning,
                              positionKey: docvocab.data().positionKey,
                              ratio: 0,
                              url: docvocab.data().url,
                              vocab: docvocab.data().vocab
                            });
                        }
                      });

                    await db
                      .collection("Position")
                      .get()
                      .then(async doc => {
                        for (const docPosition of doc.docs) {
                          let isUserData = false;
                          if (docPosition.id == this.userObj.positionKey) {
                            isUserData = true;
                          }
                          // console.log(
                          //   docAdd.id,
                          //   docPosition.id,
                          //   docPosition.data()
                          // );
                          await db
                            .collection("CustomerAccounts")
                            .doc(docAdd.id)
                            .collection("PositionSelected")
                            .doc(docPosition.id)
                            .set({
                              isUse: isUserData,
                              name: docPosition.data().name,
                              orderid: docPosition.data().orderid,
                              status: docPosition.data().status
                            });
                        }
                      });

                    this.loadingHide();
                    this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                    this.$router.push("/account");
                  });
              }
            });
        } else {
          //บันทึกหน้าแก้ไขผู้ใช้งาน

          //ถ้ารหัสไม่ครบ 4 ตัวขึ้นแจ้งเตือน
          if (this.userObj.password.length != 4) {
            this.notifyRed("กรุณาใส่รหัสผ่าน 4 หลัก");

            return;
          }
          this.userObj.tel = this.userObj.tel.replace(/-/g, "");
          //เบอร์โทรซ้ำ
          if (this.oldPhoneNumber != this.userObj.tel) {
            db.collection("CustomerAccounts")
              .where("tel", "==", this.userObj.tel)
              .get()
              .then(doc => {
                if (doc.size) {
                  this.notifyRed("เบอร์โทรศัพท์นี้มีผู้ใช้งานแล้ว");
                } else {
                  db.collection("CustomerAccounts")
                    .doc(this.$route.params.userkey)
                    .set(this.userObj);
                  db.collection("CustomerAccounts")
                    .doc(this.$route.params.userkey)
                    .update({ tel: this.userObj.tel.replace(/-/g, "") });

                  this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                }
              });
          } else {
            db.collection("CustomerAccounts")
              .doc(this.$route.params.userkey)
              .set(this.userObj);
            db.collection("CustomerAccounts")
              .doc(this.$route.params.userkey)
              .update({ tel: this.userObj.tel.replace(/-/g, "") });
            this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
            this.$router.push("/account");
          }
        }
      }
    },
    //ปุ่มยกเลิก
    cencel() {
      this.$router.push("/account");
    },
    loadvocab() {
      db.collection("Vocabulary")
        .doc("server")
        .collection("data")
        .get()
        .then(doc => {
          doc.forEach(element => {
            let dataKey = {
              key: element.id
            };
            let lastdata = {
              ...dataKey,
              ...element.data()
            };
            this.vocabData = lastdata;
          });
        });
    },
    //โหลดข้อมูลแก้ไข
    loadEdit() {
      db.collection("CustomerAccounts")
        .doc(this.$route.params.userkey)
        .get()
        .then(doc => {
          this.loadvocab();
          this.userObj = doc.data();
          this.$q.loading.hide();
          this.oldPhoneNumber = this.userObj.tel;
        });
    },
    //ปุ่มลบ
    deleteBtn() {
      let key = this.$route.params.userkey;
      this.$q
        .dialog({
          title: "ลบข้อมูล",
          message: "ยืนยันการลบข้อมูล",
          cancel: "ยกเลิก",
          ok: "ตกลง",
          persistent: true
        })
        .onOk(() => {
          db.collection("CustomerAccounts")
            .doc(key)
            .update({
              status: false
            })
            .then(() => {
              // this.loadCustomer();
              this.notifyGreen("ลบข้อมูลเสร็จสิ้น");

              this.$router.push("/account");
            });
        });
    }
  },
  mounted() {
    this.loadBsiness();
    if (this.$route.name == "accountedit") {
      this.titleName = "แก้ไขผู้ใช้งาน";
      this.isAddMode = false;
    } else {
      this.titleName = "เพิ่มผู้ใช้งาน";
      this.isAddMode = true;
    }
  }
};
</script>
<style scoped >
.box {
  height: 70px;
}
</style>