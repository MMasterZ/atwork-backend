<template>
  <div class="bg">
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <q-space />
        <q-toolbar-title class="col-10 mobile-only text-white text-h5" align="center">จัดการบทสนทนา</q-toolbar-title>
        <q-toolbar-title class="col-11 desktop-only text-white text-h4" align="center">จัดการบทสนทนา</q-toolbar-title>
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
            <q-tab name="vdo" label="วีดีโอ" :disable="!isVdoMode" />
            <q-tab name="speaker" :disable="!isSpeakerMode" label="ผู้สนทนา" />
            <q-tab name="dialog" :disable="!isSentenceMode" label="บทสนทนา" />
          </q-tabs>
        </div>

        <q-tab-panels v-model="tabShow" animated>
          <!-- สถานการณ์ -->
          <q-tab-panel name="situation">
            <div class="row">
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
                  <span>บทเรียน</span>
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
                    :label="positionData[index].name"
                  />
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

          <!-- วีดีโอ -->
          <q-tab-panel name="vdo">
            <div class="q-pb-md col-12" align="center">
              <div
                style="border: 1px solid #A4A8AB; width:90%; max-width: 400px; "
                class="relative-position"
              >
                <!-- show VDO -->
                <q-icon
                  name="fas fa-video-slash"
                  style="font-size: 70px; padding: 100px;"
                  v-show="!isUploadComplete"
                ></q-icon>
                <video
                  :src="situation.url"
                  controls
                  style="width:100%"
                  class="q-px-sm q-pt-sm"
                  v-show="isUploadComplete"
                />
                <!-- input VDO -->
                <div v-show="!isUploadComplete">
                  <table>
                    <tr>
                      <td style="width: 50px;">
                        <div class="q-pl-md text-body1 text-grey-7 q-pr-md">วีดีโอ</div>
                      </td>
                      <td>
                        <q-input
                          class="q-px-sm q-pt-md"
                          @input="saveVdo($event)"
                          type="file"
                          borderless
                          style="height:50px;"
                          accept=".mp4"
                          ref="fileInput"
                        />
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- delete btn  -->
                <div class="q-px-sm q-pb-sm" v-show="isUploadComplete">
                  <q-btn style="width: 120px" @click="delVdoBtn()">ลบวีดีโอ</q-btn>
                </div>
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
                  :error="isErrorHasSpeakerEng"
                />
              </div>
              <div class="q-pl-md-sm col-md-6 col-xs-12">
                <q-input
                  outlined
                  v-model="speaker.speakerThai"
                  label="ชื่อผู้สนทนาภาษาไทย"
                  :error="isErrorHasSpeakerThai"
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
                    <q-tr :props="props" style="height:70px;">
                      <q-td key="nameEng" :props="props">{{ props.row.speakerEng }}</q-td>
                      <q-td key="nameThai" :props="props">{{ props.row.speakerThai }}</q-td>
                      <q-td key="delete" :props="props">
                        <q-btn
                          round
                          color="secondary"
                          size="md"
                          icon="fas fa-trash-alt"
                          @click="deleteSpeaker(props.row.key)"
                        />
                      </q-td>
                      <q-td key="edit" :props="props">
                        <q-btn
                          round
                          color="secondary"
                          size="md"
                          icon="fas fa-edit"
                          @click="editSpeaker(props.row.key)"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <!-- end table -->

              <!-- หน้าแก้ไข -->
              <div>
                <q-dialog v-model="isSpeakerEditMode" persistent>
                  <q-card style="max-width: 400px; width:100%">
                    <q-card-section>
                      <div class="text-h6" align="center">แก้ไขผู้สนทนา</div>
                    </q-card-section>
                    <q-card-section>
                      <q-input
                        outlined
                        label="ชื่อผู้สนทนาภาษาอังกฤษ"
                        :error="isErrorHasSpeakerEng"
                        v-model="speaker.speakerEng"
                        autofocus
                      />
                      <q-input
                        outlined
                        label="ชื่อผู้สนทนาภาษาไทย"
                        :error="isErrorHasSpeakerThai"
                        v-model="speaker.speakerThai"
                      />
                    </q-card-section>

                    <q-card-actions align="center" class="text-primary">
                      <q-btn
                        style="width:120px;"
                        class="q-mr-sm text-black"
                        label="ยกเลิก"
                        v-close-popup
                        @click="cancelEditSpeakerBtn()"
                      />
                      <q-btn
                        style="width:120px;"
                        class="bg-secondary text-white q-ml-sm"
                        label="บันทึก"
                        v-close-popup
                        @click="saveSpeakBtn()"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
            </div>
          </q-tab-panel>

          <!-- บทสนทนา -->
          <q-tab-panel name="dialog">
            <div class="row">
              <div class="q-pr-md-sm q-py-xs-sm col-md-4 col-xs-12" style="height:70px">
                <q-input
                  outlined
                  v-model.number="dialog.orderId"
                  label="ลำดับประโยค"
                  type="number"
                  :error="isErrorHasOrder"
                />
              </div>
              <div class="q-pr-md-sm q-py-xs-sm col-md-4 col-xs-12">
                <q-select
                  outlined
                  v-model="dialog.speakerKey"
                  :options="optionsSpeaker"
                  emit-value
                  map-options
                  label="ผู้สนทนา"
                />
              </div>
              <div class="q-py-xs-sm col-md-4 col-xs-12">
                <div class="col-md-4 col-xs-12">
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
                              ref="fileInput"
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
                            <u @click="playsound(dialog.url)" class="cursor-pointer">ฟังเสียงคำศัพท์</u>
                          </div>
                        </div>
                        <div>
                          <q-btn
                            class="q-my-sm text-body1 text-blue-grey-10"
                            flat
                            @click="deleteSoundBtn()"
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
              </div>

              <div class="q-py-md q-py-xs-sm col-md-12 col-xs-12" style="height:70px">
                <q-input
                  outlined
                  v-model="dialog.sentenceEng"
                  label="ประโยคภาษาอังกฤษ"
                  :error="isErrorHasSentenceEng"
                />
              </div>
              <div class="q-py-xs-sm col-md-12 col-xs-12" style="height:70px">
                <q-input
                  outlined
                  v-model="dialog.sentenceThai"
                  label="ประโยคภาษาไทย"
                  :error="isErrorHasSentenceThai"
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
              <div class="row relative-position" style="width:100%">
                <div style="width: 100%" class="desktop-only">
                  <div
                    class="q-my-md row text-subtitle1"
                    style="border: 1px solid #BDBDBD; "
                    v-for="(i,index) in sentenceData "
                    :key="index"
                  >
                    <div
                      class="bg-blue-grey-10 text-white row justify-center text-center items-center"
                      style="width: 70px; "
                    >{{i.orderId}}</div>
                    <div
                      class="bg-blue-grey-2 text-white row justify-center text-center items-center"
                      style="width: 70px; "
                    >
                      <q-btn
                        :disable="i.url==''"
                        @click="playsound(i.url)"
                        flat
                        style="width:70px; height:90px"
                        push
                        icon="fas fa-volume-up"
                        class="text-body1 text-grey-2"
                        :class="{'bg-secondary': i.url, 'bg-grey-7': !i.url}"
                      />
                    </div>

                    <div
                      class="row items-center"
                      style="width: 180px; border-right: 1px solid #BDBDBD"
                    >
                      <div class="col-12 q-py-sm">
                        <span class="q-px-md">{{i.speakerEng}}</span>
                      </div>
                      <div class="col-12" style="border: 1px dashed #BDBDBD"></div>
                      <div class="col-12 q-py-sm">
                        <span class="q-px-md">{{i.speakerThai}}</span>
                      </div>
                    </div>
                    <div class="row items-center" style="width: calc(100% - 380px);">
                      <div class="col-12 q-py-sm">
                        <span class="q-px-md">{{i.sentenceEng}}</span>
                      </div>
                      <div class="col-12" style="border: 1px dashed #BDBDBD"></div>
                      <div class="col-12 q-py-sm">
                        <span class="q-px-md">{{i.sentenceThai}}</span>
                      </div>
                    </div>

                    <div class="text-center row justify-center items-center" style="width: 60px;">
                      <q-btn
                        round
                        flat
                        size="md"
                        class="text-white bg-secondary text-body1"
                        icon="fas fa-edit"
                        @click="editDialog(i.sentencekey)"
                      />
                    </div>
                  </div>
                </div>
                <div class="mobile-only">
                  <q-card
                    v-for="(m,indexm) in sentenceData "
                    :key="indexm"
                    class="q-my-md"
                    @click="editDialog(m.sentencekey)"
                  >
                    <div class="bg-blue-grey-10 text-white row q-pa-sm">
                      <div class style="width: 50px">{{m.orderId}}</div>
                      <div
                        class
                        style="width: calc(100% - 100px)"
                      >{{m.speakerEng}} - {{m.speakerThai}}</div>
                      <div class style="width: 40px">
                        <q-btn
                          :disable="m.url==''"
                          @click="playsound(m.url)"
                          round
                          flat
                          style="width:40px; height:40px"
                          push
                          icon="fas fa-volume-up"
                          class="text-body1 col-3"
                          :class="{'text-white': m.url, 'text-grey-2': !m.url}"
                        />
                      </div>
                    </div>
                    <div class="row q-pa-md">
                      <div class="col-12">{{m.sentenceEng}}</div>
                      <hr class="col-12" style="border-top: 1px dashed" />
                      <div class="col-12">{{m.sentenceThai}}</div>
                    </div>
                  </q-card>
                </div>
              </div>
              <!-- end table -->

              <!-- แสดงไดอล็อคแก้ไขข้อมูล -->
              <div>
                <q-dialog v-model="editDialogMode" persistent>
                  <q-card style="max-width: 400px; width:100%">
                    <q-card-section class="relative-position">
                      <div class="text-h6" align="center">แก้ไขบทสนทนา</div>
                      <div class="absolute-right q-pa-sm">
                        <q-btn
                          round
                          flat
                          size="md"
                          class="text-white bg-secondary text-body1"
                          icon="fas fa-trash-alt"
                          @click="deleteDialog(sentenceKey)"
                          v-close-popup
                        />
                      </div>
                    </q-card-section>
                    <q-card-section>
                      <q-input
                        outlined
                        v-model.number="dialog.orderId"
                        label="ลำดับประโยค"
                        type="number"
                        :rules="[value => !!value ]"
                        ref="dialogOrder"
                        autofocus
                        class="q-py-sm"
                      />
                      <q-select
                        class="q-py-sm"
                        outlined
                        v-model="dialog.speakerKey"
                        :options="optionsSpeaker"
                        emit-value
                        map-options
                        label="ผู้สนทนา"
                      />
                      <div class="q-py-sm">
                        <div
                          style="height: 57px;  border: 1px solid #bdbdbd"
                          class="rounded-borders"
                        >
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
                                    ref="fileInput"
                                  ></q-input>
                                </td>
                              </tr>
                            </table>
                          </div>

                          <div v-if="isFile">
                            <div class="row justify-between">
                              <div class="q-my-xs q-pt-sm text-secondary">
                                <div class="text-body1 q-pt-xs q-px-sm">
                                  <!-- <span class="text-grey-7"></span> -->
                                  <q-icon class="q-px-md" name="fas  fa-play" />
                                  <u
                                    @click="playsound(dialog.url)"
                                    class="cursor-pointer"
                                  >ฟังเสียงคำศัพท์</u>
                                </div>
                              </div>
                              <div>
                                <q-btn
                                  class="q-my-sm text-body1 text-blue-grey-10"
                                  flat
                                  @click="deleteSoundBtn()"
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

                      <q-input
                        class="q-py-sm"
                        outlined
                        v-model="dialog.sentenceEng"
                        label="ประโยคภาษาอังกฤษ"
                        :rules="[value => !!value ]"
                        ref="sentenceEng"
                      />

                      <q-input
                        class="q-py-sm"
                        outlined
                        v-model="dialog.sentenceThai"
                        label="ประโยคภาษาไทย"
                        :rules="[value => !!value ]"
                        ref="sentenceThai"
                      />
                    </q-card-section>

                    <q-card-actions align="center" class="text-primary">
                      <q-btn
                        style="width:120px;"
                        class="q-mr-sm text-black"
                        label="ยกเลิก"
                        @click="cancelEditDialogBtn()"
                        v-close-popup
                      />
                      <q-btn
                        style="width:120px;"
                        class="bg-secondary text-white q-ml-sm"
                        label="บันทึก"
                        @click="saveDialogBtn()"
                        v-close-popup
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
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
import { async } from "q";

export default {
  data() {
    return {
      has: false,
      tabShow: "situation",
      dockey: "",
      dataDb: "",
      db: {
        dialogData: db
          .collection("Dialog")
          .doc("draft")
          .collection("data"),
        dialog: db.collection("Dialog").doc("draft")
      },
      //tab control

      // Data ในสถานการณ์
      situation: {
        situationEng: "",
        situationThai: "",
        positionSelec: [],
        url: ""
      },
      positionData: [],
      isCheckAll: false,

      //upload vdo
      isVdoMode: true,
      isUploadComplete: false,

      //ผู้สนทนา
      isErrorHasSpeakerEng: false,
      isErrorHasSpeakerThai: false,
      isSpeakerMode: true, // ตัวเปิดแถบ ผู้สนทนา - true เปิดได้ / false ปิด
      isSpeakerEditMode: false,
      speaker: {
        speakerEng: "",
        speakerThai: ""
      },
      speakerEditKey: "",
      speakerData: [],
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

      //บทสนทนา
      isErrorHasOrder: false,
      isErrorHasSentenceEng: false,
      isErrorHasSentenceThai: false,
      isSentenceMode: true, // ตัวเปิดแถบ บทสนทนา - true เปิดได้ / false ปิด
      isSentenceEditMode: false,
      optionsSpeaker: [],
      sentenceKey: "",
      dialog: {
        orderId: "",
        speakerKey: "",
        sentenceEng: "",
        sentenceThai: "",
        url: ""
      },
      sentenceData: [],
      isFile: false,
      file: "",
      editDialogMode: false
    };
  },
  methods: {
    //****************** ทั่วไปใช้ร่วมกัน ******************/

    /****** ปุ่มยกเลิกใช้กับทุกหน้า ******/
    backBtn() {
      this.$router.push("/dialog");
    },

    //****************** Start Zone สถานการณ์ ******************/

    /****** บันทึกสถานการณ์ ******/
    async saveSituBtn() {
      // ฟังกืชันเอาเวลาในเครื่อง เอาไว้ใส่ในเวลบาดราฟแล้วก็ปุ่มซิงค์ข้อมูล
      let microtime = await this.loadTime();

      // เช็คการกรอกข้อมูลให้ครบถ้วน
      this.$refs.situationEng.validate(); // ช่องภาษาอังกฤษ
      this.$refs.situationThai.validate(); // ช่องภาษาไทย

      if (
        this.$refs.situationEng.hasError ||
        this.$refs.situationThai.hasError
      ) {
        this.notifyRed("กรุณากรอกชื่อสถานการณ์");
        return;
      }

      if (this.situation.positionSelec.length == 0) {
        this.notifyRed("กรุณาเลือกบทเรียนอย่างน้อย 1 บทเรียน");
        return;
      }

      // add ข้อมูลเข้าฐานข้อมูล
      this.isVdoMode = true;
      this.isSpeakerMode = true;
      this.loadingShow();
      if (this.dockey.length) {
        // หน้าแก้ไข
        this.db.dialogData
          .doc(this.dockey)
          .set(this.situation)
          .then(doc => {
            this.db.dialog
              .set({
                saveDraft: microtime
              })
              .then(() => {
                this.loadingHide();
                this.tabShow = "vdo";
              });
          });
      } else {
        // หน้าเพิ่มข้อมูล
        this.db.dialogData.add(this.situation).then(doc => {
          this.dockey = doc.id;
          this.db.dialog.set({
            saveDraft: microtime
          });
          this.loadingHide();
          this.tabShow = "vdo";
          this.$router.push("/dialog/edit/" + this.dockey + "/1");
        });
      }
    },

    /****** โหลดข้อมูลตำแหน่งในหน้าสถานการณ์ ******/
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

    /****** Select All ในหน้าสถานการณ์ ******/
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

    /****** select All ในหน้าสถานการณ์ ******/
    checkBoxChanged() {
      if (this.situation.positionSelec.length == this.positionData.length) {
        this.isCheckAll = true;
      } else {
        this.isCheckAll = false;
      }
    },

    //****************** Start Zone VDO ******************/

    /****** บันทึกไฟล์ VDO ******/
    async saveVdo(data) {
      let microtime = await this.loadTime();
      let fileVdo = data[0];
      this.loadingShow();
      st.child("videos/dialog/" + this.dockey + ".mp4")
        .put(fileVdo)
        .then(res => {
          res.ref.getDownloadURL().then(url => {
            //ทำการ update url ใน database
            this.db.dialogData.doc(this.dockey).update({ url: url });
            this.db.dialog.set({ saveDraft: microtime });
            this.situation.url = url;
            this.isUploadComplete = true;
            this.tabShow = "speaker";
            this.loadingHide();
          });
        });
    },

    /****** ลบไฟล์ VDO ******/
    async delVdoBtn() {
      let microtime = await this.loadTime();
      this.$q
        .dialog({
          title: "คำเตือน",
          message: "คุณต้องการลบวีดีโอหรือไม่",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.loadingShow();
          this.db.dialogData
            .doc(this.dockey)
            .update({
              url: ""
            })
            .then(() => {
              st.child("videos/dialog/" + this.dockey + ".mp4").delete();

              // window.location.reload();
              // this.$router.push("/dialog/edit/" + this.dockey + "/2");

              this.db.dialog.set({ saveDraft: microtime });
              this.isUploadComplete = false;
              this.loadingHide();
            });
        });
    },

    /****** โหลดข้อมูลใน mode edit ******/
    async loadBasicData() {
      //load ข้อมูลหน้า
      try {
        let dataPath = await st
          .child("videos/dialog/" + this.dockey + ".mp4")
          .getDownloadURL();

        this.isUploadComplete = true;
      } catch (err) {
        this.isUploadComplete = false;
      }
      this.dataDb.get().then(data => {
        //load ข้อมูลหน้าสถานการณ์
        this.situation = data.data();
        this.checkBoxChanged();
      });
    },

    //****************** Start Zone ผู้สนทนา ******************/

    /****** บันทึกผู้สนทนา ******/
    saveSpeakBtn() {
      // ช่องชื่อผู้สนทนาภาษาอังกฤษ

      if (this.speaker.speakerEng == "") {
        this.isErrorHasSpeakerEng = true;
        this.notifyRed("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      } else {
        this.isErrorHasSpeakerEng = false;
      }
      // ช่องชื่อผู้สนทนาภาษาไทย
      if (this.speaker.speakerThai == "") {
        this.isErrorHasSpeakerThai = true;
        this.notifyRed("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      } else {
        this.isErrorHasSpeakerThai = false;
      }

      this.$q.loading.show();
      let editMode = this.isSpeakerEditMode;

      this.db.dialogData
        .doc(this.dockey)
        .collection("speaker")
        .where("speakerEng", "==", this.speaker.speakerEng)
        .get()
        .then(doc => {
          // เช็คข้อมูลซ้ำก่อนเซฟ

          if (editMode == true) {
            /******  edit mode ******/
            // console.log("edit");
            this.db.dialogData
              .doc(this.dockey)
              .collection("speaker")
              .doc(this.speakerEditKey)
              .set(this.speaker)
              .then(async () => {
                let microtime = await this.loadTime();
                this.db.dialog.set({ saveDraft: microtime });
                this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                this.speaker.speakerEng = "";
                this.speaker.speakerThai = "";
                this.loadSpeaker();
                this.isSpeakerEditMode = false;
                this.isErrorHasSpeakerEng = false;
                this.isErrorHasSpeakerThai = false;
                this.$q.loading.hide();
              });
          } else {
            /****** add mode ******/
            // console.log("add");
            this.db.dialogData
              .doc(this.dockey)
              .collection("speaker")
              .add(this.speaker)
              .then(async () => {
                let microtime = await this.loadTime();
                this.db.dialog.set({ saveDraft: microtime });
                this.isSentenceMode = true;
                this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
                this.speaker.speakerEng = "";
                this.speaker.speakerThai = "";
                this.isErrorHasSpeakerEng = false;
                this.isErrorHasSpeakerThai = false;
                this.loadSpeaker();
                this.$q.loading.hide();
              });
          }
        });
    },

    /****** โหลดข้อมูลผู้สนทนาเพื่อแสดงข้อมูลในตาราง ******/
    loadSpeaker() {
      this.speakerData = [];
      this.optionsSpeaker = [];
      this.db.dialogData
        .doc(this.dockey)
        .collection("speaker")
        .get()
        .then(doc => {
          if (doc.size) {
            doc.forEach(data => {
              // สำหรับหน้าผู้สนทนา
              let key = { key: data.id };
              let final = { ...key, ...data.data() };
              this.speakerData.push(final);

              //สำหรับหน้าบทสนทนา
              let data2 = {
                label: data.data().speakerEng + " - " + data.data().speakerThai,
                value: data.id
              };
              this.optionsSpeaker.push(data2);
            });
            this.speakerData.sort((a, b) => {
              return a.speakerEng - b.speakerEng ? 1 : -1;
            });

            this.optionsSpeaker.sort((a, b) => {
              return a.label - b.label ? 1 : -1;
            });
            this.dialog.speakerKey = this.optionsSpeaker[0].value;

            this.loadingHide();
          }
        });
    },

    /****** ลบผู้สนทนา ******/
    async deleteSpeaker(key) {
      let microtime = await this.loadTime();
      this.$q
        .dialog({
          title: "คำเตือน",
          message: "คุณต้องการลบผู้สนทนานี้หรือไม่",
          ok: "ยืนยัน",
          cancel: "ยกเลิก",
          persistent: true
        })
        .onOk(() => {
          this.db.dialogData
            .doc(this.dockey)
            .collection("sentence")
            .where("speakerKey", "==", key)
            .get()
            .then(doc => {
              if (doc.size > 0) {
                this.notifyRed("ถูกใช้งานอยู่ ไม่สามารถลบได้");
              } else {
                this.db.dialog.set({ saveDraft: microtime });
                this.loadingShow();
                this.db.dialogData
                  .doc(this.dockey)
                  .collection("speaker")
                  .doc(key)
                  .delete()
                  .then(() => {
                    this.checkSpeakerHas();
                    this.loadSpeaker();
                    this.loadingHide();
                    this.notifyGreen("ลบข้อมูลเรียบร้อย");
                  });
              }
            });
        });
    },

    /****** โหลดข้อมูลผู้สนทนาเพื่อแก้ไข แต่ยังไม่บันทึก ******/
    editSpeaker(key) {
      this.isSpeakerEditMode = true;
      this.speakerEditKey = key;
      db.collection("Dialog")
        .doc("draft")
        .collection("data")
        .doc(this.dockey)
        .collection("speaker")
        .doc(key)
        .get()
        .then(data => {
          this.speaker = data.data();
        });
    },

    /******  เมื่อกดยกเลิก ช่องที่กรอกจจะถูกเครียค่า  ******/
    cancelEditSpeakerBtn() {
      this.speaker.speakerEng = "";
      this.speaker.speakerThai = "";
    },

    /******  เช็คถ้ามีการลบข้อมูลผู้สนทนา  ******/
    checkSpeakerHas() {
      // console.log(this.dockey);
      db.collection("Dialog")
        .doc("draft")
        .collection("data")
        .doc(this.dockey)
        .collection("speaker")
        .get()
        .then(doc => {
          // console.log(doc.size);
          if (doc.size > 0) {
            this.isSentenceMode = true;
          } else {
            this.isSentenceMode = false;
          }
        });
    },

    //****************** Start Zone บทสนทนา ******************/

    /****** โหลดข้อมูลบทสนทนาเพื่อแสดงในตาราง ******/
    loadDialog() {
      this.loadingShow();
      this.sentenceData = [];
      this.db.dialogData
        .doc(this.dockey)
        .collection("sentence")
        .get()
        .then(doc => {
          doc.forEach(data => {
            let datakey = {
              sentencekey: data.id
            };

            this.db.dialogData
              .doc(this.dockey)
              .collection("speaker")
              .doc(data.data().speakerKey)
              .get()
              .then(data2 => {
                let speaker = {
                  speakerEng: data2.data().speakerEng,
                  speakerThai: data2.data().speakerThai,
                  url: data2.data().url
                };
                let datafinal = { ...datakey, ...speaker, ...data.data() };
                this.sentenceData.push(datafinal);
                this.sentenceData.sort((a, b) => {
                  return Number(a.orderId) - Number(b.orderId);
                });
                this.loadingHide();
              });
          });
        });
    },

    /****** บันทึกบทสนทนา ******/
    async saveDialogBtn() {
      // console.log(this.dialogData);
      let microtime = await this.loadTime();
      let pageNo = this.$route.params.page;

      // ช่องชื่อผู้สนทนาภาษาอังกฤษ
      if (this.dialog.orderId == "") {
        this.isErrorHasOrder = true;
        this.notifyRed("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      } else {
        this.isErrorHasOrder = false;
      }

      // ช่องชื่อผู้สนทนาภาษาอังกฤษ
      if (this.dialog.sentenceEng == "") {
        this.isErrorHasSentenceEng = true;
        this.notifyRed("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      } else {
        this.isErrorHasSentenceEng = false;
      }

      // ช่องชื่อผู้สนทนาภาษาอังกฤษ
      if (this.dialog.sentenceThai == "") {
        this.isErrorHasSentenceThai = true;
        this.notifyRed("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      } else {
        this.isErrorHasSentenceThai = false;
      }

      db.collection("Dialog")
        .doc("draft")
        .update({
          saveDraft: microtime
        });

      if (this.isSentenceEditMode) {
        // เข้าแก้ไขข้อมูล
        this.loadingShow();
        this.db.dialogData
          .doc(this.dockey)
          .collection("sentence")
          .doc(this.sentenceKey)
          .set(this.dialog)
          .then(doc => {
            //save sound file
            if (this.file != "") {
              // เช็ค เมื่อมีการอัพไฟล์เสียงใหม่เข้าระบบ
              st.child("audios/dialog/" + this.sentenceKey + ".mp3")
                .put(this.file[0])
                .then(res => {
                  st.child("audios/dialog/" + this.sentenceKey + ".mp3")
                    .getDownloadURL()
                    .then(res => {
                      this.dataDb
                        .collection("sentence")
                        .doc(this.sentenceKey)
                        .update({
                          url: res
                        })
                        .then(() => {
                          this.loadDialog();
                          this.file = "";
                          this.isFile = false;
                        });
                    });
                });
            } else {
              // ไม่มีการอัพไฟล์เสียงใหม่ เช็คว่ามีการลบไฟล์เสียงแล้วทำการบันทึก
              if (this.isFile) {
                // บันทึกเสียงเก่า
                this.db.dialogData
                  .doc(this.dockey)
                  .collection("sentence")
                  .doc(this.sentenceKey)
                  .update({
                    url: this.dialog.url
                  })
                  .then(() => {
                    this.dialog = {
                      orderId: "",
                      sentenceEng: "",
                      sentenceThai: "",
                      speakerKey: "",
                      url: ""
                    };
                    this.isFile = false;
                    this.loadDialog();
                  });
              } else {
                // ไม่มีเสียงแล้วบันทึก
                this.db.dialogData
                  .doc(this.dockey)
                  .collection("sentence")
                  .doc(this.sentenceKey)
                  .update({
                    url: ""
                  })
                  .then(() => {
                    this.dialog = {
                      orderId: "",
                      sentenceEng: "",
                      sentenceThai: "",
                      speakerKey: "",
                      url: ""
                    };
                    // this.isFile = false;
                    this.loadDialog();
                  });
              }
            }

            this.loadingHide();
          });
      } else {
        // เพิ่มข้อมูลใหม่

        this.loadingShow();
        this.db.dialogData
          .doc(this.dockey)
          .collection("sentence")
          .add(this.dialog)
          .then(doc => {
            //save sound file
            if (this.file != "") {
              st.child("audios/dialog/" + doc.id + ".mp3")
                .put(this.file[0])
                .then(res => {
                  st.child("audios/dialog/" + doc.id + ".mp3")
                    .getDownloadURL()
                    .then(res => {
                      this.dataDb
                        .collection("sentence")
                        .doc(doc.id)
                        .update({
                          url: res
                        });
                    });
                });
            } else {
              this.db.dialogData
                .doc(this.dockey)
                .collection("sentence")
                .doc(doc.id)
                .update({
                  url: ""
                });
            }
            this.notifyGreen("บันทึกข้อมูลเรียบร้อย");
            this.dialog = {
              orderId: "",
              sentenceEng: "",
              sentenceThai: "",
              speakerKey: "",
              url: ""
            };
            this.file = "";
            this.loadDialog();
            this.dialog.speakerKey = this.optionsSpeaker[0].value;
            // ตัวเช็ค Error สั่งปิด
            this.isErrorHasSentenceThai = false;
            this.isErrorHasSentenceEng = false;
            this.isErrorHasOrder = false;
            this.isSentenceEditMode = false;

            // this.loadingHide();
          });
      }
    },

    /****** เล่นเสียง ******/
    playsound(url) {
      let audio = new Audio(url);
      setTimeout(() => {
        audio.play();
      }, 1000);
    },

    /****** โหลดข้อมูลแก้ไข Dialog ******/
    editDialog(key) {
      this.loadingShow();
      this.isSentenceEditMode = true;
      this.editDialogMode = true;
      this.dataDb
        .collection("sentence")
        .doc(key)
        .get()
        .then(data => {
          this.sentenceKey = key;
          this.dialog = data.data();
          if (this.dialog.url.length) {
            this.isFile = true;
          }
          this.loadingHide();
        });
    },

    /****** ลบ Dialog ******/
    async deleteDialog(key) {
      let microtime = await this.loadTime();
      this.$q
        .dialog({
          title: "คำเตือน",
          message: "คุณต้องการลบข้อมูลหรือไม่",
          ok: "ยืนยัน",
          cancel: "ยกเลิก",
          persistent: true
        })
        .onOk(() => {
          this.loadingShow();

          db.collection("Dialog")
            .doc("draft")
            .update({
              saveDraft: microtime
            });

          this.dataDb
            .collection("sentence")
            .doc(key)
            .delete()
            .then(() => {
              this.dialog = {
                orderId: "",
                sentenceEng: "",
                sentenceThai: "",
                speakerKey: "",
                url: ""
              };
              this.isFile = false;
              this.notifyRed("ลบข้อมูลเรียบร้อย");
              this.loadDialog();
            });
          this.loadingHide();
        });
    },

    /****** ลบไฟล์เสียงในบทสนทนา ******/
    deleteSoundBtn() {
      this.$q
        .dialog({
          title: "คำเตือน",
          message: "คุณต้องการลบเสียงหรือไม่",
          cancel: "ยกเลิก",
          ok: "ยืนยัน",
          persistent: true
        })
        .onOk(() => {
          this.isFile = false;
        });
    },

    /****** เช็คไฟล์เสียงว่ามีไหม ******/
    checkSoundHas() {
      if (this.dialog.url == "") {
        this.isFile = false;
      } else {
        this.isFile = true;
      }
    },

    /****** ปุ่มยกเลิก ******/
    cancelEditDialogBtn() {
      this.isFile = false;
      this.dialog = {
        orderId: "",
        sentenceEng: "",
        sentenceThai: "",
        speakerKey: "",
        url: ""
      };
    }
  },

  mounted() {
    this.loadPosition();
    this.checkSoundHas();
    // this.loadSpeaker(); ///temp
    // this.loadDialog(); // temp

    if (this.$route.name == "dialogedit") {
      this.dockey = this.$route.params.key;
      let pageNo = this.$route.params.page;
      if (pageNo == 1) {
        this.tabShow = "situation";
      } else if (pageNo == 2) {
        this.tabShow = "vdo";
      } else if (pageNo == 3) {
        this.tabShow = "speaker";
      } else {
        this.tabShow = "dialog";
      }

      this.dataDb = this.db.dialogData.doc(this.dockey);

      // this.loadDataSituation();
      this.checkSpeakerHas();
      this.loadSpeaker();
      this.loadDialog();
      this.loadBasicData();
    } else {
      this.isVdoMode = false;
      this.isSpeakerMode = false;
      this.isSentenceMode = false;
    }
  }
};
</script>
<style scoped >
</style>