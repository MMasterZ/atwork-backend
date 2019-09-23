<template>
  <div class="bg">
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <q-space />
        <q-toolbar-title class="col-10 mobile-only text-white text-h5" align="center">{{titleName}}</q-toolbar-title>
        <q-toolbar-title class="col-11 desktop-only text-white text-h4" align="center">{{titleName}}</q-toolbar-title>
        <q-space />
      </q-toolbar>
    </div>

    <div class="q-pa-md">
      <div class="bg-grey-2">
        <div>
          <q-tabs
            v-model="tabShow"
            align="justify"
            class="shadow-2 text-blue-grey-10"
            inline-label
            active-color="secondary"
            indicator-color="secondary"
          >
            <q-tab name="situation" label="สถานการณ์" />
            <q-tab name="speaker" :disable="!isSpeakerMode" label="ผู้สนทนา" />
            <q-tab name="dialog" :disable="!isSentenMode" label="บทสนทนา" />
          </q-tabs>
        </div>

        <q-tab-panels v-model="tabShow" animated>
          <!-- สถานการณ์การ -->
          <q-tab-panel name="situation">
            <div class="row">
              <div class="q-pb-md col-12" align="center">
                <div
                  style="border: 1px solid #A4A8AB; width:90%; max-width: 400px; "
                  class="relative-position"
                >
                  <!-- show VDO -->
                  <q-icon
                    name="fas fa-video-slash"
                    style="font-size: 70px; padding: 100px;"
                    v-show="!isVdo"
                  ></q-icon>
                  <video
                    :src="situation.url"
                    controls
                    style="width:100%"
                    class="q-px-sm q-pt-sm"
                    v-show="isVdo"
                  />
                  <!-- input VDO -->
                  <q-input
                    class="q-px-sm q-pb-sm z-top"
                    @input="val => { addVdoBtn(val) }"
                    filled
                    type="file"
                    color="grey-2"
                    v-show="!isVdo"
                  />
                  <!-- delete btn  -->
                  <div class="q-px-sm q-pb-sm" v-show="isVdo">
                    <q-btn style="width: 120px" @click="delVdoBtn()">ลบวีดีโอ</q-btn>
                  </div>
                </div>
              </div>
              <div class="q-pb-md col-12">
                <q-input
                  outlined
                  v-model="situation.situationEng"
                  label="ชื่อสถานการณ์ภาษาอังกฤษ"
                  :rules="[value => !!value ]"
                  ref="situationEng"
                />
              </div>
              <div class="q-pb-md col-12">
                <q-input
                  outlined
                  v-model="situation.situationThai"
                  label="ชื่อสถานการณ์ภาษาไทย"
                  :rules="[value => !!value ]"
                  ref="situationThai"
                />
              </div>

              <div class="row col-12">
                <div class="col-12">
                  <span>ตำแหน่ง</span>
                </div>
                <div class="col-md-3 col-sm-6 col-xs-12">
                  <q-checkbox
                    v-model="isCheckAll"
                    @input="selecisCheckAll()"
                    label="เลือกทั้งหมด"
                    color="blue-grey-10"
                  />
                </div>
                <div
                  class="col-md-3 col-sm-6 col-xs-12"
                  v-for="(i , index) in positionData"
                  :key="index"
                >
                  <q-checkbox
                    :val="i.key"
                    v-model="situation.positionSelec"
                    @input="checkBoxChanged()"
                    color="blue-grey-10"
                  />
                  <span>{{positionData[index].name}}</span>
                </div>
              </div>

              <div class="col-12 q-pt-xl" align="center">
                <q-btn style="width:120px;" class="q-mr-sm" @click="backBtn()">ยกเลิก</q-btn>
                <q-btn
                  style="width:120px;"
                  class="bg-secondary text-white q-ml-sm"
                  @click="saveSituBtn()"
                >บันทึก</q-btn>
              </div>
            </div>
          </q-tab-panel>

          <!-- ผู้สนทนา -->
          <q-tab-panel name="speaker">
            <div class="row">
              <div class="q-pr-md-sm col-md-6 col-xs-12">
                <q-input
                  outlined
                  v-model="speaker.speakerEng"
                  label="ชื่อผู้สนทนาภาษาอังกฤษ"
                  :rules="[value => !!value ]"
                  ref="speakerEng"
                />
              </div>
              <div class="q-pl-md-sm col-md-6 col-xs-12">
                <q-input
                  outlined
                  v-model="speaker.speakerThai"
                  label="ชื่อผู้สนทนาภาษาไทย"
                  :rules="[value => !!value ]"
                  ref="speakerThai"
                />
              </div>
              <div class="q-pt-lg q-pb-md col-12" align="center">
                <q-btn style="width:120px;" class="q-mr-sm" @click="backBtn()">ยกเลิก</q-btn>
                <q-btn
                  style="width:120px;"
                  class="bg-secondary text-white q-ml-sm"
                  @click="saveSpeakBtn()"
                >บันทึก</q-btn>
              </div>

              <!-- start table -->
              <div class="col-12">
                <q-table :data="speakerData" :columns="columns">
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="nameEng" :props="props">{{ props.row.speakerEng }}</q-td>
                      <q-td key="nameThai" :props="props">{{ props.row.speakerThai }}</q-td>
                      <q-td key="delete" :props="props">
                        <q-btn round flat icon="fas fa-trash-alt" />
                      </q-td>
                      <q-td key="edit" :props="props">
                        <q-btn round flat icon="fas fa-edit" />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <!-- end table -->
            </div>
          </q-tab-panel>

          <!-- บทสนทนา -->
          <q-tab-panel name="dialog">
            <div class="row">
              <div class="q-pr-md-sm col-md-6 col-xs-12">
                <q-input
                  outlined
                  v-model="dialog.orderId"
                  label="ลำดับประโยค"
                  type="number"
                  :rules="[value => !!value ]"
                  ref="dialogOrder"
                />
              </div>
              <div class="q-pl-md-sm col-md-6 col-xs-12">
                <q-select
                  outlined
                  v-model="dialog.speakerKey"
                  :options="optionsSpeaker"
                  emit-value
                  map-options
                  label="ผู้สนทนา"
                />
              </div>
              <div class="q-py-md col-md-12 col-xs-12">
                <q-input
                  outlined
                  v-model="dialog.sentenceEng"
                  label="ประโยคภาษาอังกฤษ"
                  :rules="[value => !!value ]"
                  ref="sentenceEng"
                />
              </div>
              <div class="col-md-12 col-xs-12">
                <q-input
                  outlined
                  v-model="dialog.sentenceThai"
                  label="ประโยคภาษาไทย"
                  :rules="[value => !!value ]"
                  ref="sentenceThai"
                />
              </div>
              <div class="q-py-md col-12" align="center">
                <q-btn style="width:120px;" class="q-mr-sm" @click="backBtn()">ยกเลิก</q-btn>
                <q-btn
                  style="width:120px;"
                  class="bg-secondary text-white q-ml-sm"
                  @click="saveDialogBtn()"
                >บันทึก</q-btn>
              </div>

              <!-- start table -->
              <div class="row relative-position" style="border: 1px solid #BDBDBD; width:100%">
                <div style="width: 100%">
                  <div
                    class="q-ma-md row text-subtitle1"
                    style="border: 1px solid #BDBDBD; "
                    v-for="(i,index) in sentenseData "
                    :key="index"
                  >
                    <div
                      class="bg-blue-grey-10 text-white row justify-center text-center items-center"
                      style="width: 70px; "
                    >{{i.orderId}}</div>
                    <div
                      class="row items-center"
                      style="width: 180px; border-right: 1px solid #BDBDBD"
                    >
                      <div class="col-12 q-py-md">
                        <span class="q-pa-md">{{i.speakerEng}}</span>
                      </div>
                      <div class="col-12" style="border: 1px dashed #BDBDBD"></div>
                      <div class="col-12 q-py-md">
                        <span class="q-pa-md">{{i.speakerThai}}</span>
                      </div>
                    </div>
                    <div class="row items-center" style="width: calc(100% - 370px);">
                      <div class="col-12 q-py-md">
                        <span class="q-pa-md">{{i.sentenceEng}}</span>
                      </div>
                      <div class="col-12" style="border: 1px dashed #BDBDBD"></div>
                      <div class="col-12 q-py-md">
                        <span class="q-pa-md">{{i.sentenceThai}}</span>
                      </div>
                    </div>
                    <div class="text-center row justify-center items-center" style="width: 60px;">
                      <q-btn
                        round
                        flat
                        size="md"
                        class="text-white bg-secondary text-body1"
                        icon="fas fa-trash-alt"
                      />
                    </div>
                    <div class="text-center row justify-center items-center" style="width: 60px;">
                      <q-btn
                        round
                        flat
                        size="md"
                        class="text-white bg-secondary text-body1"
                        icon="fas fa-edit"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- end table -->
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>



<script>
import { db } from "../router/index.js";
import { st } from "../router/index.js";
var xmlHttp;
function srvTime() {
  try {
    //FF, Opera, Safari, Chrome
    xmlHttp = new XMLHttpRequest();
  } catch (err1) {
    //IE
    try {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (err2) {
      try {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (eerr3) {
        //AJAX not supported, use CPU time.
        alert("AJAX not supported");
      }
    }
  }
  xmlHttp.open("HEAD", window.location.href.toString(), false);
  xmlHttp.setRequestHeader("Content-Type", "text/html");
  xmlHttp.send("");
  return xmlHttp.getResponseHeader("Date");
}

var st1 = srvTime();
var date = new Date(st1);

export default {
  data() {
    return {
      date: date,
      titleName: "เพิ่มข้อมูล",
      tabShow: "situation",

      // ดาต้า
      situation: {
        situationEng: "",
        situationThai: "",
        positionSelec: [],
        url: ""
      },
      speaker: {
        speakerEng: "",
        speakerThai: ""
      },
      dialog: {
        orderId: "",
        speakerKey: "",
        sentenceEng: "",
        sentenceThai: ""
      },
      positionData: [],
      sentenseData: [],
      speakerData: [],
      optionsSpeaker: [],

      columns: [
        {
          name: "nameEng",
          required: true,
          label: "ชื่อผู้สนทนาภาษาอังกฤษ",
          align: "center",
          field: "nameEng",
          sortable: true
        },
        {
          name: "nameThai",
          align: "center",
          label: "ชื่อผู้สนทนาภาษาไทย",
          field: "nameThai",
          sortable: true
        },
        {
          name: "delete",
          label: "ลบ",
          align: "center",
          style: "width: 80px"
        },
        { name: "edit", label: "แก้ไข", align: "center", style: "width: 80px" }
      ],

      fileVDO: null,
      isCheckAll: false,
      isVdo: false,
      isSpeakerMode: false,
      isSentenMode: false
    };
  },
  methods: {
    // start btn zone

    async saveSituBtn() {
      // ฟังกืชันเอาเวลาในเครื่อง เอาไว้ใส่ในเวลบาดราฟแล้วก็ปุ่มซิงค์ข้อมูล
      let api = "https://api.winner-english.com/data/api/gettime.php";

      let response = await axios.get(api);

      let date = response.data[0].date;
      let microtime = response.data[0].microtime;

      // เช็คการกรอกข้อมูลให้ครบถ้วน
      this.$refs.situationEng.validate(); // ช่องภาษาอังกฤษ
      this.$refs.situationThai.validate(); // ช่องภาษาไทย

      if (
        this.$refs.situationEng.hasError ||
        this.$refs.situationThai.hasError
      ) {
        this.$q.notify({
          message: "กรุณากรอกข้อมูลให้ครบถ้วน",
          color: "negative",
          position: "top",
          timeout: 1000,
          icon: "fas fa-exclamation-circle"
        });
        return;
      }

      if (this.situation.positionSelec.length == 0) {
        this.$q.notify({
          message: "กรุณาเลือกตำแหน่งอย่างน้อย 1 ตำแหน่ง",
          color: "negative",
          position: "top",
          timeout: 1000,
          icon: "fas fa-exclamation-circle"
        });
        return;
      }

      if (this.isVdo == false) {
        this.$q.notify({
          message: "กรุณาเพิ่มวีดีโอ",
          color: "negative",
          position: "top",
          timeout: 1000,
          icon: "fas fa-exclamation-circle"
        });
        return;
      }

      // เพิ่มไฟล์หน้าเพิ่มข้อมูล
      if (this.$route.name == "dialogadd") {
        this.$q.loading.show();
        db.collection("Dialog")
          .add(this.situation)
          .then(getId => {
            if (this.fileVDO.type == "video/mp4") {
              st.child("videos/dialog/" + getId.id + ".mp4")
                .put(this.fileVDO)
                .then(res => {
                  let vdoPath = res.ref.getDownloadURL();
                  vdoPath.then(url => {
                    let getURL = {
                      url: url,
                      savedraft: microtime,
                      saveserver: 0
                    };
                    db.collection("Dialog")
                      .doc(getId.id)
                      .update(getURL)
                      .then(() => {
                        this.$q.loading.hide();

                        this.tabShow = "speaker";
                        this.isSpeakerMode = true;
                        this.$q.notify({
                          message: "บันทึกข้อมูลเรียบร้อย",
                          color: "secondary",
                          position: "top",
                          timeout: 1000
                        });
                        let speaker = {
                          savedraft: microtime
                        };
                        let sentence = {
                          savedraft: microtime
                        };
                        db.collection("Dialog")
                          .doc(getId.id)
                          .collection("draft")
                          .add(speaker);
                        db.collection("Dialog")
                          .doc(getId.id)
                          .collection("draft")
                          .add(sentence);
                        this.$router.push("/dialog/edit/" + getId.id);
                      });
                  });
                });
            }
          });
      } else {
        // หน้าแก้ไขข้อมูล
        this.$q.loading.show();

        db.collection("Dialog")
          .doc(this.$route.params.key)
          .update(this.situation)
          .then(getId => {
            // เปลี่ยน VDO
            if (this.fileVDO == null) {
              this.$q.loading.hide();
              this.tabShow = "speaker";
              this.isSpeakerMode = true;
              this.$q.notify({
                message: "บันทึกข้อมูลเรียบร้อย",
                color: "secondary",
                position: "top",
                timeout: 1000
              });
            } else {
              // การบันทึก vdo เข้า
              this.situation = {};
              if (this.fileVDO.type == "video/mp4") {
                st.child("videos/dialog/" + this.$route.params.key + ".mp4")
                  .put(this.fileVDO)
                  .then(res => {
                    let vdoPath = res.ref.getDownloadURL();
                    vdoPath.then(url => {
                      let getURL = {
                        url: url,
                        savedraft: microtime,
                        saveserver: 0
                      };
                      db.collection("Dialog")
                        .doc(this.$route.params.key)
                        .update(getURL)
                        .then(() => {
                          this.$q.loading.hide();
                          this.loadDataSituation();
                          this.tabShow = "speaker";
                          this.isSpeakerMode = true;
                          this.$q.notify({
                            message: "บันทึกข้อมูลเรียบร้อย",
                            color: "secondary",
                            position: "top",
                            timeout: 1000
                          });
                        });
                    });
                  });
              }
            }

            // จบการเอา VDO เข้า
            // this.$q.loading.hide();
          });
      }
    },
    saveSpeakBtn() {
      this.$refs.speakerEng.validate(); // ช่องชื่อผู้สนทนาภาษาอังกฤษ
      this.$refs.speakerThai.validate(); // ช่องชื่อผู้สนทนาภาษาไทย

      if (this.$refs.speakerEng.hasError || this.$refs.speakerThai.hasError) {
        this.$q.notify({
          message: "กรุณากรอกข้อมูลให้ครบถ้วน",
          color: "negative",
          position: "top",
          timeout: 1000,
          icon: "fas fa-exclamation-circle"
        });
        return;
      }

      this.$q.loading.show();
      db.collection("Dialog")
        .doc(this.$route.params.key)
        .collection("draft")
        .doc("speaker")
        .collection("speaker")
        .add(this.speaker)
        .then(() => {
          this.isSentenMode = true;
          this.$q.notify({
            message: "บันทึกข้อมูลเรียบร้อย",
            color: "secondary",
            position: "top",
            timeout: 1000
          });
          this.speaker.speakerEng = "";
          this.speaker.speakerThai = "";
          this.loadDataSituation();
          this.$q.loading.hide();
          this.tabShow = "dialog";
        });
    },
    saveDialogBtn() {
      this.$refs.dialogOrder.validate(); // ช่องเลขลำดับ
      this.$refs.sentenceEng.validate(); // ช่องประโยคสนทนาภาษาอังกฤษ
      this.$refs.sentenceThai.validate(); // ช่องประโยคสนทนาภาษาไทย

      if (
        this.$refs.dialogOrder.hasError ||
        this.$refs.sentenceEng.hasError ||
        this.$refs.sentenceThai.hasError
      ) {
        this.$q.notify({
          message: "กรุณากรอกข้อมูลให้ครบถ้วน",
          color: "negative",
          position: "top",
          timeout: 1000,
          icon: "fas fa-exclamation-circle"
        });
        return;
      }

      this.$q.loading.show();
      db.collection("Dialog")
        .doc(this.$route.params.key)
        .collection("draft")
        .doc("sentence")
        .collection("sentence")
        .add(this.dialog)
        .then(() => {
          this.$q.notify({
            message: "บันทึกข้อมูลเรียบร้อย",
            color: "secondary",
            position: "top",
            timeout: 1000
          });

          this.dialog.orderId = "";
          this.dialog.sentenceEng = "";
          this.dialog.sentenceThai = "";
          this.loadDataSituation();
          this.$q.loading.hide();
        });
    },

    backBtn() {
      this.$router.push("/dialog");
    },
    addVdoBtn(val) {
      // this.$q.loading.show();
      let tagPath = document.querySelector("video");
      let file = val[0];
      let reader = new FileReader();

      reader.onload = function() {
        tagPath.src = reader.result;
      };

      if (file) {
        reader.readAsDataURL(file);
        this.fileVDO = file;
        this.isVdo = true;
      } else {
        tagPath.src = "";
        this.isVdo = false;
      }
      // this.$q.loading.hide()
    },
    delVdoBtn() {
      this.$q
        .dialog({
          title: "คำเตือน",
          message: "คุณต้องการลบวีดีโอหรือไม่",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.fileVDO = null;
          this.isVdo = false;
        });

      // document.querySelector("video").val("");
    },

    // end btn zone
    // start load data zone

    loadDataSituation() {
      this.speakerData = [];
      this.optionsSpeaker = [];
      this.sentenseData = [];
      let getData = db.collection("Dialog").doc(this.$route.params.key);

      getData.get().then(doc => {
        this.situation = doc.data();
        this.isSpeakerMode = true;
        this.isVdo = true;

        getData
          .collection("draft")
          .doc("speaker")
          .collection("speaker")
          .get()
          .then(docspeak => {
            if (docspeak.size > 0) {
              this.isSentenMode = true;
              docspeak.forEach(element => {
                let key = { key: element.id };
                let data = {
                  label:
                    element.data().speakerEng +
                    " - " +
                    element.data().speakerThai,
                  value: element.id
                };
                let final = { ...key, ...element.data() };

                this.speakerData.push(final);
                this.speakerData.sort((a, b) => {
                  return a.speakerEng > b.speakerEng ? 1 : -1;
                });

                this.optionsSpeaker.push(data);
                this.optionsSpeaker.sort((a, b) => {
                  return a.label > b.label ? 1 : -1;
                });
                this.dialog.speakerKey = this.optionsSpeaker[0].value;
              });
              getData
                .collection("draft")
                .doc("sentence")
                .collection("sentence")
                .get()
                .then(docsenten => {
                  if (docsenten.size > 0) {
                    docsenten.forEach(element => {
                      let speaker = {
                        speakerEng: "",
                        speakerThai: ""
                      };

                      for (let i = 0; i < this.speakerData.length; i++) {
                        if (
                          element.data().speakerKey == this.speakerData[i].key
                        ) {
                          speaker.speakerEng = this.speakerData[i].speakerEng;
                          speaker.speakerThai = this.speakerData[i].speakerThai;
                        }
                      }
                      let final = { ...element.data(), ...speaker };
                      this.sentenseData.push(final);
                      this.sentenseData.sort((a, b) => {
                        return a.orderId > b.orderId ? 1 : -1;
                      });
                    });
                  }
                });
            }
          });
      });
    },
    loadPosition() {
      this.$q.loading.show();
      db.collection("Position")
        .where("status", "==", true)
        .get()
        .then(doc => {
          doc.forEach(element => {
            let dataId = { key: element.id };
            let data = element.data();
            let final = { ...dataId, ...data };
            // console.log(final);
            this.positionData.push(final);
            this.$q.loading.hide();
          });
        });
    },
    // loadVdo() {

    // }

    // end load data zone
    // start ฟังกืชั่นการทำงานต่างๆ
    selecisCheckAll() {
      if (this.isCheckAll) {
        for (let i = 0; i < this.positionData.length; i++) {
          const element = this.positionData[i];
          this.situation.positionSelec.push(element.key);
        }
      } else {
        this.situation.positionSelec = [];
      }
    },
    checkBoxChanged() {
      if (this.situation.positionSelec.length == this.positionData.length) {
        this.isCheckAll = true;
      } else {
        this.isCheckAll = false;
      }
    }
    // end ฟังกืชั่นการทำงานต่างๆ
  },
  mounted() {
    this.loadPosition();

    if (this.$route.name == "dialogedit") {
      this.loadDataSituation();
      this.checkBoxChanged();
    }
  }
};
</script>
<style scoped >
</style>