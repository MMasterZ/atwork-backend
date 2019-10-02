<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">{{title}}</div>
        <div class="desktop-only text-grey-2 text-h6">{{title}}</div>
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
        <div>
          <div class="row q-px-sm">
            <div style="height:70px " class="q-pt-md q-px-sm col-md-6 col-xs-12">
              <q-input
                ref="workplace"
                :rules="[ val => !!val ]"
                outlined
                v-model.trim="business.name"
                label="ชื่อสถานประกอบการ"
              />
            </div>
            <!-- select จังหวัด -->
            <div class="q-py-md q-px-sm col-md-6 col-xs-12">
              <q-select
                outlined
                v-model=" business.provinceKey"
                :options="selectProvince"
                label="จังหวัด"
              />
            </div>
          </div>

          <div class="q-mx-md box rounded-borders">
            <div class="row q-pa-sm">
              <div style="height:70px " class="col-md-6 col-xs-10 q-px-sm q-pt-sm">
                <q-input
                  outlined
                  :error="isHasDepart"
                  v-model="departments.name"
                  @keyup.enter="adddepart()"
                  label="ชื่อแผนก"
                />

                <!-- :rules="[ val => val && val.length > 0]" -->
              </div>
              <div class="col-md-6 col-xs-2 q-px-sm q-py-sm self-center">
                <q-btn
                  size="md"
                  :disable="!isDepartSeve"
                  @click="adddepart()"
                  color="secondary"
                  round
                  icon="fas fa-plus"
                  class="text-body1"
                />
              </div>
              <div class="q-py-sm">
                <q-chip
                  class="q-mx-sm"
                  color="secondary"
                  :disable="item.name == 'ไม่ระบุแผนก'"
                  @click="deletelog(index,item.departmentsKey)"
                  clickable
                  removable
                  @remove="deletelog(index,item.departmentsKey)"
                  v-for="(item,index ) in  departmentsArr "
                  :key="index"
                  text-color="white"
                >{{item.name}}</q-chip>
              </div>
            </div>
          </div>

          <!-- btn -->
          <div class="row" align="center">
            <div class="col-12 q-pt-md q-pb-sm">
              <q-btn
                class="q-ma-sm"
                @click="backBtn()"
                style="width:140px"
                text-color="black"
                color="grey-2"
                label="ยกเลิก"
              />
              <q-btn
                class="q-ma-sm"
                :disable="isCheckLogin"
                @click="seveBtn()"
                style="width:140px"
                color="secondary"
                label="บันทึก"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { db } from "../router/index.js";
import { isIP } from "net";
export default {
  data() {
    return {
      isCheckLogin: false,
      isHasDepart: false,
      textprovin: "",
      text: "",
      title: "",
      business: {
        name: "",
        provinceKey: "",
        status: true
      },
      departmentsArr: [],
      departments: {
        name: "",
        businessKey: ""
      },
      selectProvince: [],
      isDepartSeve: true,
      isAddMode: true
    };
  },
  methods: {
    // โหลดหน้าแก้ไข
    loadEdit() {
      this.loadingShow();
      db.collection("Business")
        .doc(this.$route.params.key)
        .get()
        .then(doc => {
          this.business = doc.data();
          this.text = doc.data().name;
          this.textprovin = doc.data().provinceKey;
          this.loadingHide();
        });
    },
    // ปุ่มลบข้มมูลทั้งหมด
    deleteBtn() {
      let key = this.$route.params.key;
      db.collection("CustomerAccounts")
        .where("businessKey", "==", key)
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
                this.notifyRed("มีผู้ใช้งานอยู่ไม่สามารลบได้");
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
                db.collection("Business")
                  .doc(key)
                  .update({
                    status: false
                  });
                this.notifyGreen("ลบข้อมูลเรียบร้อย");
                this.$router.push("/workplace");
              });
          }
        });
    },
    // โหลดแผนกออกมาโชว์
    loadDepart() {
      db.collection("Department")
        .where("businessKey", "==", this.$route.params.key)
        .get()
        .then(doc => {
          let newDepart = [];
          doc.forEach(element => {
            let dataKey = {
              departmentsKey: element.id
            };
            let final = {
              ...dataKey,
              ...element.data()
            };
            newDepart.push(final);
          });
          // หาตำแหน่งของ Array ที่มีค่า name ="ไม่ระบุแผนก"
          let indexOf = newDepart
            .map(function(e) {
              return e.name;
            })
            .indexOf("ไม่ระบุแผนก");

          // let test = [1, 2, 45, 6, 7,"xxx"];
          // let indexOf2 = test.indexOf("xxx");
          // console.log(indexOf2);

          // เก็บค่าตัว ไม่ระบุแผนกไว้
          let extractData = newDepart[indexOf];
          // ตัดไม่ระบุแผนกออกจาก Array
          newDepart.splice(indexOf, 1);
          // Sort Alphabets
          newDepart.sort((a, b) => {
            return a.name - b.name ? -1 : 1;
          });
          // เอาค่าไม่ระบุแผนกเข้าสู่ array ในตำแหน่งที่ 0
          newDepart.splice(0, 0, extractData);
          // ดันเข้า departmentArr เพื่อแสดงผล
          this.departmentsArr = newDepart;
        });
    },
    // โหลดจังหวัด
    loadData() {
      this.loadingShow();
      db.collection("Province")
        .get()
        .then(data => {
          data.forEach(element => {
            this.selectProvince.push(element.id);
          });
          this.business.provinceKey = "กรุงเทพมหานคร";
          this.loadingHide();
        });
    },
    // ลบชื่อแผนก
    deletelog(index, key) {
      // หน้าแก้ไข
      if (this.$route.name == "workplaceedit") {
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
            db.collection("Department")
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
                this.departmentsArr.splice(index, 1);
                this.notifyGreen("ลบข้อมูลเรียบร้อย");
              });
          });
      }
      // หน้าเพิ่ม
      else {
        this.departmentsArr.splice(index, 1);
      }
    },
    // ปุ่มบันทึกข้อมูล
    seveBtn() {
      this.$refs.workplace.validate();
      let departArr = [];
      if (this.$refs.workplace.hasError || this.business.name == "") {
        this.notifyRed("กรุณากรอกชื่อสถานประกอบการ");
      } else {
        // บันทึกแก้ไขข้อมูล
        if (this.$route.name == "workplaceedit") {
          if (
            this.text == this.business.name &&
            this.textprovin == this.business.provinceKey
          ) {
            this.isCheckLogin = false;
            this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
            this.$router.push("/workplace");
          } else {
            this.isCheckLogin = true;
            if (this.text == this.business.name) {
              db.collection("Business")
                .get()
                .then(doc => {
                  db.collection("Business")
                    .doc(this.$route.params.key)
                    .update({
                      provinceKey: this.business.provinceKey
                    });
                  this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                  this.$router.push("/workplace");
                });
            } else if (this.textprovin == this.business.provinceKey) {
              db.collection("Business")
                .where("name", "==", this.business.name)
                .get()
                .then(doc => {
                  if (doc.size > 0) {
                    this.notifyRed("ชื่อสถานประกอบการซ้ำ");
                    this.isCheckLogin = false;
                  } else {
                    db.collection("Business")
                      .doc(this.$route.params.key)
                      .update({
                        name: this.business.name
                      });
                    this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                    this.$router.push("/workplace");
                  }
                });
            }
            {
            }
          }
        }
        // บันทึกเพื่มข้อมูล
        else {
          db.collection("Business")
            .where("name", "==", this.business.name)
            .get()
            .then(doc => {
              if (doc.size > 0) {
                this.notifyRed("ชื่อสถานประกอบการซ้ำ");
              } else {
                if (this.departmentsArr.length > 1) {
                  db.collection("Business")
                    .add(this.business)
                    .then(doc => {
                      // การวนไห้เรียงต่อการเข้าไปทีละตำแหน่ง
                      for (let xx = 0; xx < this.departmentsArr.length; xx++) {
                        this.departmentsArr[xx].businessKey = doc.id;
                        db.collection("Department").add(
                          this.departmentsArr[xx]
                        );
                      }
                      this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                      this.$router.push("/workplace");
                    });
                } else {
                  if (this.departments.name == "") {
                    this.isHasDepart = true;
                    this.notifyRed("กรุณากรอกชื่อแผนก");
                  } else {
                    this.isHasDepart = false;
                  }
                  {
                  }
                }
              }
            });
        }
      }
    },
    // ปุ่มเพิ่มชื่อแผนก
    adddepart() {
      //  pages edit
      if (this.departments.name == "") {
        this.isHasDepart = true;
        this.notifyRed("กรุณากรอกชื่อแผนก");
      } else {
        // หน้าแก้ไข
        this.isHasDepart = false;
        this.isDepartSeve = false;

        if (this.$route.name == "workplaceedit") {
          db.collection("Department")
            .where("businessKey", "==", this.$route.params.key)
            .where("name", "==", this.departments.name)
            .get()
            .then(doc => {
              if (doc.size > 0) {
                this.notifyRed("ชื่อแผนกช้ำ");
                this.isDepartSeve = true;
              } else {
                let dataKey = {
                  businessKey: this.$route.params.key,
                  name: this.departments.name
                };
                db.collection("Department")
                  .add(dataKey)
                  .then(doc => {
                    let departKey = {
                      departmentsKey: doc.id
                    };
                    let final = {
                      ...dataKey,
                      ...departKey
                    };

                    this.departmentsArr.push(final);

                    this.isDepartSeve = true;
                    this.departments.name = "";
                  });
              }
            });
        }
        // หน้าเพิ่ม
        else {
          let dataKey;
          if (this.departmentsArr.length == 0) {
            dataKey = {
              businessKey: "",
              name: "ไม่ระบุแผนก"
            };

            this.departmentsArr.push(dataKey);
          }

          if (this.departmentsArr.length > 0) {
            dataKey = {
              businessKey: "",
              name: this.departments.name
            };
          }
          // console.log(dataKey);
          // console.log(this.departmentsArr);
          // console.log(this.departmentsArr.includes(dataKey));
          let checkDup = false;
          for (let i = 0; i < this.departmentsArr.length; i++) {
            if (this.departmentsArr[i].name == this.departments.name) {
              // มีซ้ำ
              checkDup = true;
            }
          }
          // กรณีเช็คแล้วมีคำซ้ำ
          if (!checkDup) {
            this.departmentsArr.push(dataKey);
          } else {
            this.notifyRed("ชื่อแผนกช้ำ");
          }

          this.isDepartSeve = true;
          this.departments.name = "";
        }
      }
    },
    // ปุ่มย้อนกลับ
    backBtn() {
      this.$router.push("/workplace");
    }
  },
  mounted() {
    this.loadData();
    if (this.$route.name == "workplaceedit") {
      this.title = "แก้ไขสถานประกอบการ";
      this.loadEdit();
      this.loadDepart();
      this.isAddMode = false;
    } else {
      this.title = "เพิ่มสถานประกอบการ";
    }
  }
};
</script>

<style scoped >
.box {
  max-height: fit-content;
  min-height: calc(100vh - 700px);
  border: 1px solid #bdbdbd;
}
</style>