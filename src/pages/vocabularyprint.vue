<template>
  <div class="bg-print">
    <q-resize-observer @resize="onResize" />
    <div
      align="right"
      id="printBtn"
      :class="{'print-bar ':innerWidth < 1035,'fixed fixed-top-right q-pa-sm':innerWidth >= 1035}"
    >
      <div :class="{'print-bar-color':innerWidth < 1035}">
        <q-btn
          class="q-ma-sm"
          :flat="innerWidth < 1035"
          :class="{'fix-btn1':innerWidth < 1035,'bg-blue':innerWidth >= 1035}"
          @click="printBtn()"
          round
        >
          <q-icon name="fas fa-print" color="white" />
        </q-btn>
        <q-btn
          class="q-ma-sm"
          :flat="innerWidth < 1035"
          :class="{'fix-btn':innerWidth < 1035,'bg-red':innerWidth >= 1035}"
          @click="closeBtn()"
          round
        >
          <q-icon name="fas fa-times" color="white" />
        </q-btn>
      </div>
    </div>

    <div size="A4" class="q-pa-md printMe">
      <div
        align="center"
        class="rounded-borders text-h5 row"
        style="border:1px solid#6D6E71;padding:9px;"
      >
        <div class="col-2"></div>
        <div class="col-8" align="center">
          <span>คำศัพท์ : {{lessonName}}</span>
        </div>

        <div class="col-2 text-body1 self-center" align="right">
          <span>{{dataTime}}</span>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th colspan="3">
              <div class="q-mt-md"></div>
            </th>
          </tr>
          <tr
            class="text-white text-h5 q-mt-md"
            style="background-color:#6D6E71;border:1px solid#6D6E71;"
          >
            <td style="padding:14px;">
              <div align="left">ลำดับ</div>
            </td>
            <td style="padding:14px;">
              <div align="left">คำศัพท์</div>
            </td>
            <td style="padding:14px;">
              <div align="left">ความหมาย</div>
            </td>
          </tr>
        </thead>

        <tbody v-if="vocabularyList.length > 0">
          <tr
            v-for="(item,index) in vocabularyList"
            :key="index"
            class="text-h6"
            style="border:1px solid#6D6E71;"
          >
            <td style="width:100px;padding:13px;vertical-align: top;margin-bottom:5px;">
              <div align="left" class="q-pl-md">
                <span>{{index + 1}}</span>
              </div>
            </td>
            <td style="width:350px;padding:13px;vertical-align: top;">
              <div align="left">
                <span>{{item.vocab}}</span>
              </div>
            </td>
            <td style="width:450px;padding:13px;vertical-align: top;">
              <div align="left">
                <span>{{item.meaning}}</span>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="vocabularyList.length == 0">
          <tr style="border:1px solid#6D6E71;" class="text-h6">
            <td colspan="3" style="padding:13px;">
              <div align="center">
                <span>ไม่มีข้อมูล</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      lessonName: "",
      vocabularyList: [],
      dataTime: "",
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    };
  },
  methods: {
    printBtn() {
      window.print();
    },
    closeBtn() {
      window.close();
    },
    async loadData() {
      this.loadingShow();

      let st = await this.loadTime();
      let date = new Date(st);

      this.dataTime =
        date.getDate() +
        "/" +
        date.getMonth() +
        "/" +
        (date.getFullYear() + 543);

      db.collection("Vocabulary")
        .doc("draft")
        .collection("data")
        .where("positionKey", "==", this.$route.params.key)
        .get()
        .then(doc => {
          if (doc.size > 0) {
            doc.forEach(element => {
              let dataKey = {
                key: element.id
              };
              let final = {
                ...dataKey,
                ...element.data()
              };
              this.vocabularyList.push(final);
            });

            this.vocabularyList.sort((a, b) => {
              return a.vocab > b.vocab ? 1 : -1;
            });
          }
          if (this.$route.params.key != "ทั่วไป") {
            this.loadPosition();
          } else {
            this.lessonName = "ทั่วไป";
            this.loadingHide();
          }
        });
    },
    loadPosition() {
      db.collection("Position")
        .doc(this.$route.params.key)
        .get()
        .then(doc => {
          this.lessonName = doc.data().name;
          this.loadingHide();
        });
    },
    onResize(size) {
      (this.innerWidth = size.width), (this.innerHeight = size.height);
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style>
body {
  background: rgb(204, 204, 204);
}
.bg-print {
  background: rgb(204, 204, 204);
  min-height: 100vh;
  max-height: fit-content;
  counter-reset: page;
}
.print-bar {
  width: 100%;
  min-width: max-content;
  margin-bottom: 80px;
}
.print-bar-color {
  position: fixed;
  top: 0;
  height: 60px;
  width: 100%;
  background: rgb(43, 43, 43);
  z-index: 5000;
}
.fix-btn {
  position: fixed;
  right: 0;
}
.fix-btn1 {
  position: fixed;
  right: 0;
  margin-right: 65px;
}
.printMe {
  position: relative;
  background: white;
  display: block;
  margin: 15px auto;
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
  font-family: Pridi;
}

.printMe[size="A4"] {
  width: 210mm;
  min-height: 297mm;
  max-height: fit-content;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.brx {
  border: 1px solid#f00;
}

@media print {
  body {
    background: #ffffff;
  }
  .bg-print {
    padding: 0px 0px;
  }
  body,
  .printMe {
    background: #ffffff;
    margin: 0px 0px;
    margin-bottom: 0px;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    border: transparent;
  }
  #printBtn {
    display: none;
  }
}
@page {
  margin: 0mm;
  size: 210mm 297mm;
}
</style>