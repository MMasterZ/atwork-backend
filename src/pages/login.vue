<template>
  <div class="bg">
    <div class="absolute-center">
      <!-- desktop -->
      <div class="box row desktop-only">
        <!-- Logo  -->
        <div class="col-md-6 z-top col-sm-6">
          <div class="boxcard box-pos bg-blue-grey-10 boxshadow">
            <div align="center" class="q-pa-lg">
              <div class="q-mb-lg q-mt-lg q-pt-md">
                <img style="width:180px; height:180px" src="../assets/loginlogo.png" />
              </div>
              <div class="text-white">
                <img style="width:50px; height:30px" src="../assets/loginxs.png" alt />
                <span class="text-h5 q-px-sm">Winner@work</span>
              </div>
            </div>
          </div>
        </div>
        <!-- กรอก User & Password -->
        <div class="bg-white box-radius col-md-6 col-sm-6">
          <div align="center">
            <div class="q-ma-lg">
              <q-icon color="blue-grey-10" size="90px" name="fas fa-user-circle"></q-icon>
            </div>
            <div style="max-width:70%">
              <div>
                <q-input v-model="username" label="เบอร์โทรศัพท์" ref="phoneNumber" />
              </div>
              <div>
                <q-input
                  :type="isPwd ? 'password' : 'text'"
                  v-model="password"
                  label="รหัสผ่าน"
                  mask="######"
                  @keyup.enter="loginBtn()"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <!-- Btn -->
            <div class="q-mt-lg">
              <q-btn
                class="btn"
                :disable="isCheckLogin"
                @click="loginBtn()"
                color="secondary"
                label="เข้าสู่ระบบ"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- mobile -->
    <div class="absolute-center mobile-only q-pa-sm" style="width:100%; max-width:450px;">
      <div>
        <div class="boxmobile boxmobiletop bg-blue-grey-10" align="center">
          <div class="row justify-center text-white">
            <div style="padding-top: 10px ">
              <img style="width:50px;" src="../assets/loginxs.png" alt />
            </div>
            <div class="q-mb-xl" style="padding-top: 5px;">
              <span class="text-h5 q-px-sm q-mb-sm">Winner@work</span>
            </div>
          </div>
        </div>
        <div class="boxmobilebuttom bg-white">
          <div align="center">
            <div class="q-pa-lg">
              <q-icon color="blue-grey-10" size="90px" name="fas fa-user-circle"></q-icon>
            </div>
            <div style="max-width:70%">
              <div>
                <q-input v-model="username" label="เบอร์โทรศัพท์" ref="phoneNumber2" />
              </div>
              <div>
                <q-input
                  :type="isPwd ? 'password' : 'text'"
                  v-model="password"
                  label="รหัสผ่าน"
                  @keyup.enter="loginBtn()"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <!-- Btn -->
            <div class="q-py-lg">
              <q-btn
                class="btn"
                :disable="isCheckLogin"
                @click="loginBtn()"
                color="secondary"
                label="เข้าสู่ระบบ"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-bottom-right q-pr-sm text-grey-6">V. {{version}}</div>
  </div>
</template>



<script>
import { db } from "../router/index.js";

export default {
  data() {
    return {
      isCheckLogin: false,
      version: "",
      isPwd: true,
      username: "",
      password: ""
    };
  },
  methods: {
    loginBtn() {
      if (this.username == "" || this.password == "") {
        this.$q.notify({
          icon: "fas fa-exclamation-circle",
          message: "เบอร์โทรศัพท์ / รหัสผ่านไม่ถูกต้อง",
          color: "negative",
          position: "bottom",
          timeout: 1000
        });
      } else {
        this.isCheckLogin = true;
        this.username = this.username.toLowerCase();
        db.collection("SystemAccounts")
          .where("tel", "==", this.username)
          .where("password", "==", this.password)
          .get()
          .then(data => {
            if (data.size > 0) {
              data.forEach(element => {
                let keyData = {
                  key: element.id
                };
                let dataFinal = {
                  ...keyData,
                  ...element.data()
                };
                this.$q.localStorage.set("currentPage", "/vocabulary");
                this.$q.localStorage.set("systemAccountData", dataFinal);
                this.$router.push("/vocabulary");
              });
            } else {
              this.isCheckLogin = false;
              this.$q.notify({
                icon: "fas fa-exclamation-circle",
                message: "เบอร์โทรศัพท์ / รหัสผ่านไม่ถูกต้อง",
                position: "bottom",
                color: "negative",
                timeout: 1000
              });
            }
          });
      }
    },
    loadVersion() {
      db.collection("Version")
        .doc("backend")
        .get()
        .then(doc => {
          this.version = doc.data().appVersion;
        });
    },
    checklogin() {
      let local = this.$q.localStorage.getItem("systemAccountData");
      if (local == "" || local == null) {
        this.$router.push("/");
      } else {
        this.$router.push("/welcomeback");
      }
    }
  },
  mounted() {
    // this.$q.localStorage.set("systemAccountData", "");
    this.checklogin();
    this.loadVersion();
    if (this.$q.platform.is.mobile) {
      this.$refs.phoneNumber2.focus();
    } else {
      this.$refs.phoneNumber.focus();
    }
  }
};
</script>
<style scoped >
.boxmobilebuttom {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.boxmobiletop {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.text {
  position: relative;
  display: inline-block;
  margin-bottom: 30px;
}
.boxmobile {
  line-height: 50px;
  height: 50px;
}
.boximg {
  width: 180px;
  height: 180px;
}
/*  background */
.bg {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/bg-dark.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.box-pos {
  position: relative;
  left: 10px;
}
.boxshadow {
  box-shadow: 1px 0px 10px rgb(56, 56, 56);
}
.btn {
  width: 140px;
}
.boxcard {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 360px;
}
.box {
  width: 720px;
}
.box-radius {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>