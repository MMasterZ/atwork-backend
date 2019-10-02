<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-secondary">
      <q-toolbar class="my-border-left">
        <q-btn class flat @click="drawer = !drawer" round dense icon="menu" />
        <!-- เมนูคำศัพท์ vocabulary -->
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'vocabularymain'">คำศัพท์</q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'vocabularyadd'">
          <router-link class="text-white text-weight-light" to="/vocabulary">คำศัพท์</router-link>&nbsp;>
          เพิ่มคำศัพท์
        </q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'vocabularyedit'">
          <router-link class="text-white text-weight-light" to="/vocabulary">คำศัพท์</router-link>&nbsp;>
          แก้ไขคำศัพท์
        </q-toolbar-title>

        <!-- เมนู expression -->
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'expressionmain'">ประโยค</q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'expressionadd'">
          <router-link class="text-white text-weight-light" to="/expression">ประโยค</router-link>&nbsp;>
          เพิ่มประโยค
        </q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'expressionedit'">
          <router-link class="text-white text-weight-light" to="/expression">ประโยค</router-link>&nbsp;>
          แก้ไขประโยค
        </q-toolbar-title>

        <!-- เมนู dialog -->
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'dialogmain'">บทสนทนา</q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'dialogadd'">
          <router-link class="text-white text-weight-light" to="/dialog">บทสนทนา</router-link>&nbsp;>
          จัดการบทสนทนา
        </q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'dialogedit'">
          <router-link class="text-white text-weight-light" to="/dialog">บทสนทนา</router-link>&nbsp;>
          จัดการบทสนทนา
        </q-toolbar-title>

        <!-- เมนู writing -->
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'writingmain'">ทักษะการเขียน</q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'writingadd'">
          <router-link class="text-white text-weight-light" to="/writing">ทักษะการเขียน</router-link>&nbsp;>
          เพิ่มการเขียน
        </q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'writingedit'">
          <router-link class="text-white text-weight-light" to="/writing">ทักษะการเขียน</router-link>&nbsp;>
          แก้ไขการเขียน
        </q-toolbar-title>

        <!-- เมนูผู้ดูแลระบบ -->
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'adminmain'">ผู้ดูแลระบบ</q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'adminadd'">
          <router-link class="text-white text-weight-light" to="/admin">ผู้ดูแลระบบ</router-link>&nbsp;>
          เพิ่มผู้ดูแลระบบ
        </q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'adminedit'">
          <router-link class="text-white text-weight-light" to="/admin">ผู้ดูแลระบบ</router-link>&nbsp;>
          แก้ไขผู้ดูแลระบบ
        </q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'useredit'">แก้ไขข้อมูลส่วนตัว</q-toolbar-title>

        <!-- เมนูผู้ใช้งาน -->
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'accountmain'">ผู้ใช้งาน</q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'accountadd'">
          <router-link class="text-white text-weight-light" to="/account">ผู้ใช้งาน</router-link>&nbsp;>
          เพิ่มผู้ใช้งาน
        </q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'accountedit'">
          <router-link class="text-white text-weight-light" to="/account">ผู้ใช้งาน</router-link>&nbsp;>
          แก้ไขผู้ใช้งาน
        </q-toolbar-title>

        <!-- เมนูสถานประกอบการ -->
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'workplacemain'">สถานประกอบการ</q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'workplaceadd'">
          <router-link class="text-white text-weight-light" to="/workplace">สถานประกอบการ</router-link>&nbsp;>
          เพิ่มสถานประกอบการ
        </q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'workplaceedit'">
          <router-link class="text-white text-weight-light" to="/workplace">สถานประกอบการ</router-link>&nbsp;>
          แก้ไขสถานประกอบการ
        </q-toolbar-title>

        <!-- เมนูตำแหน่ง -->
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'positionmain'">บทเรียน</q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'positionadd'">
          <router-link class="text-white text-weight-light" to="/position">บทเรียน</router-link>&nbsp;>
          เพิ่มบทเรียน
        </q-toolbar-title>
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'positionedit'">
          <router-link class="text-white text-weight-light" to="/position">บทเรียน</router-link>&nbsp;>
          แก้ไขบทเรียน
        </q-toolbar-title>

        <!-- เมนูLogout -->
        <q-toolbar-title class="text-h6" v-if="this.$route.name == 'logout'">ออกจากระบบ</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" :width="300" :breakpoint="1023" show-if-above>
      <q-scroll-area
        class="bg-blue-grey-10 text-white"
        style="height: calc(100% - 120px); margin-top: 120px; "
      >
        <q-list padding>
          <router-link to="/position" class="my-text-menu">
            <q-item
              class="my-padding"
              :class="{'text-light-blue-3': this.$route.name == 'positionmain' || this.$route.name == 'positionadd' || this.$route.name == 'positionedit'} "
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="fas fa-book" />
              </q-item-section>
              <q-item-section>บทเรียน</q-item-section>
            </q-item>
          </router-link>

          <router-link to="/vocabulary" class="my-text-menu">
            <q-item
              class="my-padding"
              :class="{'text-light-blue-3': this.$route.name == 'vocabularymain' || this.$route.name == 'vocabularyadd' || this.$route.name == 'vocabularyedit'} "
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="fas fa-font" />
              </q-item-section>
              <q-item-section>คำศัพท์</q-item-section>
            </q-item>
          </router-link>

          <router-link to="/expression" class="my-text-menu">
            <q-item
              class="my-padding"
              :class="{'text-light-blue-3': this.$route.name == 'expressionmain' || this.$route.name == 'expressionadd' || this.$route.name == 'expressionedit'} "
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="fas fa-comment" />
              </q-item-section>
              <q-item-section>ประโยค</q-item-section>
            </q-item>
          </router-link>

          <router-link to="/dialog" class="my-text-menu">
            <q-item
              class="my-padding"
              :class="{'text-light-blue-3': this.$route.name == 'dialogmain' || this.$route.name == 'dialogadd' || this.$route.name == 'dialogedit'} "
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="fas fa-comments" />
              </q-item-section>
              <q-item-section>บทสนทนา</q-item-section>
            </q-item>
          </router-link>

          <router-link to="/writing" class="my-text-menu">
            <q-item
              class="my-padding"
              :class="{'text-light-blue-3': this.$route.name == 'writingmain' || this.$route.name == 'writingadd' || this.$route.name == 'writingedit'} "
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="fas fa-pen-alt" />
              </q-item-section>
              <q-item-section>ทักษะการเขียน</q-item-section>
            </q-item>
          </router-link>

          <q-separator class="bg-grey-7" />

          <router-link to="/workplace" class="my-text-menu">
            <q-item
              class="my-padding"
              :class="{'text-light-blue-3': this.$route.name == 'workplacemain' || this.$route.name == 'workplaceadd' || this.$route.name == 'workplaceedit'} "
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="fas fa-hotel" />
              </q-item-section>
              <q-item-section>สถานประกอบการ</q-item-section>
            </q-item>
          </router-link>

          <router-link to="/account" class="my-text-menu">
            <q-item
              class="my-padding"
              :class="{'text-light-blue-3': this.$route.name == 'accountmain' || this.$route.name == 'accountadd' || this.$route.name == 'accountedit'} "
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="fas fa-user-alt" />
              </q-item-section>
              <q-item-section>ผู้ใช้งาน</q-item-section>
            </q-item>
          </router-link>

          <q-separator class="bg-grey-7" v-if="SystemAccounts.tel == 'admin'" />

          <router-link to="/admin" class="my-text-menu" v-if="SystemAccounts.tel == 'admin'">
            <q-item
              class="my-padding"
              :class="{'text-light-blue-3': this.$route.name == 'adminmain' || this.$route.name == 'adminadd' || this.$route.name == 'adminedit'} "
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="fas fa-user-cog" />
              </q-item-section>
              <q-item-section>ผู้ดูแลระบบ</q-item-section>
            </q-item>
          </router-link>
          <div style="height: 50px"></div>
        </q-list>
      </q-scroll-area>

      <div class="absolute-top bg-blue-grey-10">
        <div class="row">
          <div class="col-3 self-center q-pt-xs" align="center">
            <q-img src="../statics/logo.png" style="width:60%;" />
          </div>
          <div class="col-7 self-center" align="center">
            <span class="text-white text-h5">Winner@work</span>
          </div>
          <div class="col-2"></div>
        </div>

        <div class="my-border-top my-border-bottom" style="height: 84px">
          <q-btn flat class="full-width my-hover-me" @click="userEditBtn()">
            <div class="row full-width">
              <div class="col-4 self-center" align="left" style="padding:6px;">
                <div class="text-white" v-if="isLoadData">
                  <q-img
                    style="width: 60px"
                    :src="'../statics/avatar/' + showUserSystem.avatar + '.png'"
                  />
                </div>
              </div>
              <div class="col-5 self-center text-white" align="left">
                <div class="text-body1 q-py-xs">{{showUserSystem.name}}</div>
                <div class="text-caption" v-show="showUserSystem.tel != 'admin'"></div>
              </div>
              <div class="col-3 self-center" align="center">
                <q-btn
                  flat
                  round
                  push
                  icon="fas fa-cog"
                  class="text-subtitle1 text-white my-animated"
                />
              </div>
            </div>
          </q-btn>
        </div>
      </div>

      <div class="absolute-bottom my-border-top text-white bg-blue-grey-10">
        <q-list>
          <q-item
            class="my-padding"
            :class="{'text-light-blue-3': this.$route.name == 'logout' } "
            clickable
            v-ripple
            @click="goToLogout()"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-sign-out-alt" />
            </q-item-section>
            <q-item-section>ออกจากระบบ</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { db } from "../router/index.js";
import { close } from "fs";
export default {
  name: "MyLayout",
  data() {
    return {
      page: this.$route.name,
      systemKeyCheck: "",
      showUserSystem: {},
      isLoadData: false
    };
  },
  methods: {
    userEditBtn() {
      this.$router.push("/user/edit");
    },
    checkUser() {
      db.collection("SystemAccounts")
        .doc(this.SystemAccounts.key)
        .onSnapshot(data => {
          if (data.data().userKey == this.SystemAccounts.userKey) {
            this.showUserSystem = data.data();
            this.showUserSystem.tel =
              this.showUserSystem.tel.substring(0, 3) +
              "-" +
              this.showUserSystem.tel.substring(3, 6) +
              "-" +
              this.showUserSystem.tel.substring(6);
            this.isLoadData = true;
          } else {
            this.$q.localStorage.set("systemAccountData", "");
            this.$router.push("/");
          }
        });
    },
    goToLogout() {
      // console.log(this.$q.platform.is);
      this.$router.push("/logout");
    },
    loadVersion() {
      db.collection("Version")
        .doc("backend")
        .get()
        .then(doc => {
          let versionNow = doc.data().appVersion;
          if (versionNow != this.appVersion) {
            // การรีโหลดหน้า เหมือนกับการกด shift+f5
            window.location.reload(true);
          }
        });
    }
  },
  mounted() {
    this.checkUser();
    this.loadVersion();
  },
  watch: {
    $route() {
      if (this.$route.name != "useredit") {
        this.$q.localStorage.set("currentPage", this.$route.path);
      }
    }
  }
};
</script>

<style >
.my-text-menu {
  color: white;
  text-decoration: none;
}
.my-border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
.my-border-top {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}
.my-border-left {
  border-left: 1px solid rgba(255, 255, 255, 0.5);
}
.my-border-right {
  border-right: 1px solid rgba(255, 255, 255, 1);
}

.my-padding {
  -webkit-transition: 0.5s;
  -moz-transition: 0.5s;
  transition: 0.5s;
}
.my-padding:hover {
  padding-left: 30px;
  color: #81d4fa;
}

.my-hover-me .my-animated {
  -webkit-transition: 3s ease-out;
  -moz-transition: 3s ease-out;
  transition: 3s ease-out;
}
.my-hover-me:hover .my-animated {
  transform: rotate(1000deg);
}
.my-hover-me:active .my-animated {
  transform: scale(3);
}
</style>