<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">เพิ่มคำศัพท์</div>
        <div class="desktop-only text-grey-2 text-h4">เพิ่มคำศัพท์</div>
        <q-space />
      </q-toolbar>
    </div>
    <div class="bg-grey-2 q-mt-md-md q-mx-md-md">
      <div class="row q-pa-sm">
        <div class="q-pt-md-md q-px-md-sm q-pt-xs-md col-md-6 col-xs-12">
          <q-select label="ตำแหน่ง" outlined :options="generalPosition" v-model="position"></q-select>
        </div>
        <div class="q-pt-md-md q-px-md-sm q-pt-xs-md col-md-6 col-xs-12">
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
                    <u @click="playsound(url)" class="cursor-pointer">ฟังเสียงคำศัพท์</u>
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

        <div class="q-pt-md-md q-px-md-sm q-pt-xs-lg col-md-6 col-xs-12">
          <q-input
            style="height:57px;"
            :rules="[ val => !!val ]"
            ref="vocabInput"
            outlined
            v-model="general.vocab"
            label="คำศัพท์"
          />
        </div>
        <div class="q-pt-md-md q-px-md-sm q-pt-xs-md col-md-6 col-xs-12">
          <q-input
            style="height:57px;"
            ref="meaning"
            :rules="[ val => !!val ]"
            outlined
            v-model="general.meaning"
            label="ความหมาย"
          />
        </div>
      </div>
      <div class="q-pt-md row justify-center">
        <q-btn class="q-ma-sm btn" @click="backBtn()" label="ยกเลิก" />
        <q-btn class="q-ma-sm btn" @click="seveBtn()" color="secondary" label="บันทึก" />
        <div icon="fas fa-push"></div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      generalPosition: [],
      general: {
        positionKey: "",
        vocab: "",
        meaning: ""
      },
      position: "",
      isFile: false
    };
  },
  methods: {
    loadData() {
      db.collection("Position")
        .get()
        .then(doc => {
          doc.forEach(element => {
            let dataKey = {
              value: element.id,
              label: element.data().name
            };
            this.general.positionKey = dataKey.value;
            this.generalPosition.push(dataKey);
            this.position = this.generalPosition[0].label;
          });
        });
    },
    backBtn() {
      this.$router.push("/vocabulary");
    },
    seveBtn() {
      this.$refs.vocabInput.validate();
      this.$refs.meaning.validate();
      if (this.$refs.vocabInput.hasError || this.$refs.meaning.hasError) {
        this.$q.notify({
          icon: "fas fa-exclamation-circle",
          message: "กรุณากรอกข้อมูลให้ครบ",
          color: "red",
          position: "top"
        });
        return;
      } else {
        console.log(141);
        db.collection("Vocabulary").add(this.general);
      }
    }
  },
  mounted() {
    this.loadData();
    this.$refs.vocabInput.focus();
  }
};
</script>
<style scoped >
.btn {
  width: 120px;
}
</style>