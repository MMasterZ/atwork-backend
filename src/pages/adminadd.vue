<template>
  <q-page class>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">{{titleName}}</div>
        <div class="desktop-only text-grey-2 text-h4">{{titleName}}</div>

        <q-space />
      </q-toolbar>
    </div>

    <!-- กล่องกรอกข้อมูล PC -->
    <div class="desktop-only row absolute-center full-width justify-center">
      <div class="bg-blue-grey-10 my-radius-right" style="width: 360px">
        <div align="center" class="q-pa-lg">
          <span class="text-white text-h6">เลือกรูปโปรไฟล์</span>
        </div>
        <div class="row q-px-md" align="center">
          <div class="col-3" v-for="i in 16" :key="i">
            <div
              class="my-icon cursor-pointer"
              :class="{ 'my-choose-icon':userInfo.avatar == i,  'my-hover-icon': userInfo.avatar != i}"
              @click="chooseIconBtn(i)"
            >
              <transition appear enter-active-class="animated flip">
                <div>
                  <q-img :src="myicon + i +'.png'" class="my-scale-icon" style="width: 60px" />
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-grey-2 row q-pa-lg my-radius-left relative-position"
        style="width: 360px"
        align="center"
      >
        <div
          class="col-12 relative-position absolute-top-right"
          v-if="isAddMode != true && userInfo.tel != 'admin' && userInfoMode != true"
        >
          <q-btn
            class="absolute-top-right q-ma-sm"
            round
            flat
            icon="fas fa-trash-alt"
            @click="deleteBtn()"
          />
        </div>
        <div class="col-12">
          <q-img :src="myicon + userInfo.avatar + '.png'" class style="width: 120px" />
        </div>
        <div class="col-12 q-mt-md" style="height: 55px">
          <q-input
            v-model="userInfo.name"
            label="ชื่อผู้ใช้งาน"
            outlined
            :readonly="userInfo.name == 'Admin'"
            :rules="[value => !!value ]"
            ref="name"
          />
        </div>
        <div class="col-12 q-mt-md" style="height: 55px">
          <q-input
            v-model="phoneTel"
            label="เบอร์โทรศัพท์"
            mask="###-###-####"
            outlined
            v-show="userInfo.name != 'Admin'"
            :rules="[value => value.length >= 12 ]"
            ref="tel"
          />
          <q-input
            v-model="adminTel"
            label="เบอร์โทรศัพท์"
            outlined
            readonly
            v-show="userInfo.name == 'Admin'"
          />
        </div>

        <div class="col-12 q-mt-md" style="height: 55px">
          <q-input
            v-model="userInfo.password"
            label="รหัสผ่าน"
            mask="######"
            outlined
            :rules="[value => value.length >= 6 ]"
            ref="password"
          />
        </div>
        <div class="col-12 q-pt-xl">
          <q-btn
            style="width:140px;"
            class="q-mr-sm"
            @click="backBtn()"
            :disable="!isDisableMode"
          >ยกเลิก</q-btn>
          <q-btn
            style="width:140px;"
            class="bg-secondary text-white q-ml-sm"
            @click="saveBtn()"
            :disable="!isDisableMode"
          >บันทึก</q-btn>
        </div>
      </div>
    </div>

    <!-- กล่องกรอกข้อมูลมือถือ -->
    <div class="mobile-only relative-position">
      <div class="bg-grey-2 q-pb-md" style="width: 100%" v-if="isIconMobileMode == false">
        <div align="center" class="q-pa-md">
          <span class="text-h6">เลือกรูปโปรไฟล์</span>
        </div>
        <div class="col-12 absolute-top-right">
          <q-btn round flat icon="fas fa-times" @click="closeIconBtn()" />
        </div>
        <div class="row q-px-md" align="center">
          <div class="col-4" v-for="i in 16" :key="i">
            <div
              class="my-icon-mobile cursor-pointer-mobile"
              :class="{ 'my-choose-icon-mobile':userInfo.avatar == i,  'my-hover-icon-mobile': userInfo.avatar != i}"
              @click="chooseIconBtn(i)"
            >
              <transition appear enter-active-class="animated flip">
                <div>
                  <q-img
                    :src="myicon + i +'.png'"
                    class="my-scale-icon-mobile"
                    style="width: 90px"
                  />
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-grey-2 q-pa-md" style="width: 100%" align="center" v-else>
        <div
          class="col-12"
          v-if="isAddMode != true && userInfo.tel != 'admin'  && userInfoMode != true"
        >
          <q-btn
            class="absolute-top-right q-ma-sm"
            round
            flat
            icon="fas fa-trash-alt"
            @click="deleteBtn()"
          />
        </div>

        <div class="col-12 relative-position" style="width: 120px" @click="chooseIcon()">
          <q-img :src="myicon + userInfo.avatar + '.png'" class style="width: 120px" />

          <q-btn
            class="absolute-bottom-right"
            round
            color="white"
            text-color="blue-grey-10"
            icon="fas fa-edit"
            size="12px"
            @click="closeIconBtn()"
          />
        </div>
        <div class="col-12 q-mt-md" style="height: 55px">
          <q-input
            v-model="userInfo.name"
            label="ชื่อผู้ใช้งาน"
            outlined
            :readonly="userInfo.name == 'Admin'"
            :rules="[value => !!value ]"
            ref="nameMobile"
          />
        </div>
        <div class="col-12 q-mt-md" style="height: 55px">
          <q-input
            v-model="phoneTel"
            label="เบอร์โทรศัพท์"
            mask="###-###-####"
            outlined
            v-show="userInfo.name != 'Admin'"
            :rules="[value => value.length >= 12]"
            ref="telMobile"
          />
          <q-input
            v-model="adminTel"
            label="เบอร์โทรศัพท์"
            outlined
            readonly
            v-show="userInfo.name == 'Admin'"
          />
        </div>

        <div class="col-12 q-mt-md" style="height: 55px">
          <q-input
            v-model="userInfo.password"
            label="รหัสผ่าน"
            mask="######"
            outlined
            :rules="[value => value.length >= 6 ]"
            ref="passwordMobile"
          />
        </div>
        <div class="col-12 q-pt-xl">
          <q-btn
            style="width:120px;"
            class="q-mr-sm"
            @click="backBtn()"
            :disable="!isDisableMode"
          >ยกเลิก</q-btn>
          <q-btn
            style="width:120px;"
            class="bg-secondary text-white q-ml-sm"
            @click="saveBtn()"
            :disable="!isDisableMode"
          >บันทึก</q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.my-icon {
  width: 90px;
  height: 90px;
  line-height: 90px;
}

.my-choose-icon {
  border: 2px solid #4caf50;
}

.my-hover-icon,
.my-scale-icon {
  border: 2px solid #263238;
  transform: scale(1);
  transition: transform 0.1s ease-in-out;
}

.my-hover-icon:hover .my-scale-icon {
  transform: scale(1.2);
}

.my-radius {
  border-radius: 10px 10px 10px 10px;
}
.my-radius-left {
  border-radius: 0px 10px 10px 0px;
}
.my-radius-right {
  border-radius: 10px 0px 0px 10px;
}

.my-icon-mobile {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.my-choose-icon-mobile {
  border: 2px solid #4caf50;
}
.my-hover-icon-mobile,
.my-scale-icon-mobile {
  border: 2px solid #f5f5f5;
  transform: scale(1);
  transition: transform 0.1s ease-in-out;
}
.my-hover-icon-mobile:hover .my-scale-icon-mobile {
  transform: scale(1.2);
}
.my-radius-mobile {
  border-radius: 5px 5px 5px 5px;
}
</style>

<script>
import { db } from "../router/index.js";

export default {
  data() {
    return {
      isAddMode: true,
      isIconMobileMode: true,
      keyUser: "",
      myicon: "../statics/avatar/",
      titleName: "",
      userOld: "",
      userInfo: {
        name: "",
        tel: "",
        password: "",
        avatar: 1,
        status: true,
        userKey: ""
      },
      adminTel: "",
      phoneTel: "",
      checkPhone: {},
      isDisableMode: true,
      userInfoMode: false
    };
  },
  methods: {
    chooseIconBtn(type) {
      this.userInfo.avatar = type;
      this.isIconMobileMode = true;
    },
    closeIconBtn() {
      this.isIconMobileMode = true;
    },
    chooseIcon() {
      this.isIconMobileMode = false;
    },
    backBtn() {
      this.isDisableMode = false;
      // เมื่อกดยกเลิก จะกลับไปยังหน้าที่เข้ามา
      if (this.$route.name == "adminadd" || this.$route.name == "adminedit") {
        this.$router.push("/admin");
      } else {
        this.$router.push(this.$q.localStorage.getItem("currentPage"));
      }
    },
    saveBtn() {
      // เช็คค่าที่กรอกว่าเป็นช่องว่างหรือกรอกครบหรือไม่
      this.$refs.name.validate(); // ช่องชื่อ
      this.$refs.tel.validate(); // ช่องเบอร์โทร
      this.$refs.password.validate(); //ช่องรหัสผ่าน
      this.$refs.nameMobile.validate(); // ช่องชื่อ
      this.$refs.telMobile.validate(); // ช่องเบอร์โทร
      this.$refs.passwordMobile.validate(); //ช่องรหัสผ่าน

      if (
        this.$refs.name.hasError ||
        this.$refs.password.hasError ||
        this.$refs.nameMobile.hasError ||
        this.$refs.passwordMobile.hasError
      ) {
        this.isDisableMode = true;
        this.$q.notify({
          message: "กรุณากรอกข้อมูลให้ครบถ้วน",
          color: "negative",
          position: "bottom",
          timeout: 1000,
          icon: "fas fa-exclamation-circle"
        });

        return;
      }

      // เช็คการเข้ามาว่ามาจากหน้าไหน เพื่อเก็บค่าเบอร์โทร
      if (this.userInfo.name == "Admin") {
        this.userInfo.tel = this.adminTel;
      } else {
        this.userInfo.tel = this.phoneTel.replace(/-/g, "");
      }

      if (this.isAddMode) {
        // หน้า เพิ่มข้อมูลผู้ใช้งาน
        if (this.$refs.tel.hasError || this.$refs.telMobile.hasError) {
          this.$q.notify({
            message: "กรุณากรอกข้อมูลให้ครบถ้วน",
            color: "negative",
            position: "bottom",
            timeout: 1000,
            icon: "fas fa-exclamation-circle"
          });
          return;
        }

        this.userInfo.userKey = Math.floor(Math.random() * 9999999999 + 1);
        this.isDisableMode = false;
        db.collection("SystemAccounts")
          .where("tel", "==", this.userInfo.tel)
          .get()
          .then(doc => {
            if (doc.size > 0) {
              // เบอร์ซ้ำแจ้งเตือน
              this.$q.notify({
                message: "กรุณาตรวจสอบข้อมูลซ้ำ",
                color: "negative",
                position: "bottom",
                timeout: 1000,
                icon: "fas fa-exclamation-circle"
              });
              this.isDisableMode = true;
              return;
            } else {
              this.$q.loading.show({
                message: "กรุณารอสักครู่..."
              });
              db.collection("SystemAccounts")
                .add(this.userInfo)
                .then(() => {
                  this.$q.loading.hide();
                  this.$q.notify({
                    icon: "fas fa-check-circle",
                    message: "บันทึกข้อมูลเรียบร้อย",
                    color: "secondary",
                    position: "bottom",
                    timeout: 1000
                  });

                  this.$router.push("/admin");
                });
            }
          });
      } else {
        // หน้า แก้ไขข้อมูลผู้ใช้งาน
        this.isDisableMode = false;
        if (this.userInfo.tel != "admin") {
          if (this.$refs.tel.hasError) {
            this.$q.notify({
              message: "กรุณากรอกข้อมูลให้ครบถ้วน",
              color: "negative",
              position: "bottom",
              timeout: 1000,
              icon: "fas fa-exclamation-circle"
            });
            this.isDisableMode = true;
            return;
          }
        }

        if (this.userInfo.tel == this.userOld) {
          // เช็คเบอร์เก่า เพื่อเซฟ
          this.$q.loading.show({
            message: "กรุณารอสักครู่..."
          });
          db.collection("SystemAccounts")
            .doc(this.keyUser)
            .set(this.userInfo)
            .then(() => {
              this.$q.loading.hide();
              this.$q.notify({
                icon: "fas fa-check-circle",
                message: "บันทึกข้อมูลเรียบร้อย",
                color: "secondary",
                position: "bottom",
                timeout: 1000
              });

              let dataKey = { key: this.keyUser };
              let final = { ...dataKey, ...this.userInfo };
              if (this.$route.name == "adminedit") {
                this.$router.push("/admin");
              } else {
                // หน้าแก้ไขข้อมูลส่วนตัวเมื่อบันจะไปยังหน้า

                this.$router.push(this.$q.localStorage.getItem("currentPage"));
              }
            });
        } else {
          // เช็ค เบอร์ซ้ำ

          db.collection("SystemAccounts")
            .where("tel", "==", this.userInfo.tel)
            .get()
            .then(doc => {
              // this.checkPhone = doc.docs[0].data().tel;
              // console.log(doc.docs[0].data().tel);
              if (doc.size > 0) {
                // เบอร์ซ้ำแจ้งเตือน
                this.$q.notify({
                  message: "กรุณาตรวจสอบข้อมูลซ้ำ",
                  color: "negative",
                  position: "bottom",
                  timeout: 1000,
                  icon: "fas fa-exclamation-circle"
                });
                this.isDisableMode = true;
                return;
              } else {
                // ถ้้าเบอร์ไม่ซ้ำ บันทึกได้
                this.$q.loading.show({
                  message: "กรุณารอสักครู่..."
                });

                db.collection("SystemAccounts")
                  .doc(this.keyUser)
                  .set(this.userInfo)
                  .then(() => {
                    this.$q.loading.hide();
                    this.$q.notify({
                      icon: "fas fa-check-circle",
                      message: "ทำการบันทึกเรียบร้อย",
                      color: "secondary",
                      position: "bottom",
                      timeout: 1000
                    });

                    if (this.$route.name == "adminedit") {
                      this.$router.push("/admin");
                    } else {
                      // หน้าแก้ไขข้อมูลส่วนตัวเมื่อบันทึกจะไปยังหน้า
                      this.$router.push(
                        this.$q.localStorage.getItem("currentPage")
                      );
                    }
                  });
              }
            });
        }
      }
    },
    deleteBtn() {
      // ลบข้อมูล
      this.$q
        .dialog({
          class: "no-margin ",
          style: "padding: 0px;",
          title:
            "<div class='row'> <div class='col-11'> ลบข้อมูล </div><div class='col-1' align='right'></div> </div> ",
          html: true,
          message: "ยืนยันการลบข้อมูล",
          ok: "ยืนยัน",
          cancel: "ยกเลิก",
          persistent: true
        })
        .onOk(() => {
          db.collection("SystemAccounts")
            .doc(this.$route.params.key)
            .update({
              status: false
            })
            .then(() => {
              this.$router.push("/admin");
            });
        });
    },
    loadData() {
      this.$q.loading.show({
        message: "กรุณารอสักครู่..."
      });
      if (this.$route.name == "adminedit") {
        this.keyUser = this.$route.params.key;
      } else {
        this.keyUser = this.SystemAccounts.key;
      }
      // console.log(this.keyUser);
      db.collection("SystemAccounts")
        .doc(this.keyUser)
        .get()
        .then(doc => {
          this.userInfo = doc.data();
          this.adminTel = doc.data().tel;

          this.phoneTel = doc.data().tel;
          // console.log(this.userInfo);
          this.userOld = doc.data().tel;
          this.$q.loading.hide();
          // close
        });
    }
  },
  mounted() {
    // if (this.SystemAccounts.tel != "admin") {
    //   this.$router.push(this.currentPage);
    // }

    if (this.$route.name == "adminadd") {
      this.titleName = "เพิ่มผู้ดูแลระบบ";
      if (this.SystemAccounts.tel != "admin") {
        this.$router.push(this.currentPage);
      }
      this.userInfoMode = false;
    } else if (this.$route.name == "adminedit") {
      if (this.SystemAccounts.tel != "admin") {
        this.$router.push(this.currentPage);
      }
      this.titleName = "แก้ไขผู้ดูแลระบบ";
      this.isAddMode = false;
      this.userInfoMode = false;
      this.loadData();
    } else {
      this.titleName = "แก้ไขข้อมูลส่วนตัว";
      this.isAddMode = false;
      this.userInfoMode = true;
      this.loadData();
    }
  },
  watch: {
    $route() {
      if (this.$route.name == "useredit") {
        this.titleName = "แก้ไขข้อมูลส่วนตัว";
        this.isAddMode = false;
        this.loadData();
        if (this.SystemAccounts.tel == "admin") {
          this.$q.localStorage.set("currentPage", "/admin");
        }
      }
    }
  }
};
</script>

