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
        <div class="col-8" align="center">{{titelName}}</div>

        <div class="col-2 text-body1 self-center" align="right">
          <span>{{dataTime}}</span>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th colspan="2">
              <div class="q-mt-md"></div>
            </th>
          </tr>
          <tr
            class="text-white text-h6 q-mt-md"
            style="background-color:#6D6E71;border:1px solid#6D6E71;"
          >
            <th style="padding:14px;">
              <div align="left">ลำดับ</div>
            </th>
            <th style="padding:14px;">
              <div align="left">ประโยค</div>
            </th>
          </tr>
        </thead>

        <tbody v-if="expressionList.length > 0">
          <tr
            v-for="(item,index ) in    expressionList "
            :key="index "
            class="text-h6"
            style="border:1px solid#6D6E71;"
          >
            <td style="width:10%">
              <div class="q-pt-sm text-center">
                <span>{{index +1}}</span>
              </div>
            </td>
            <td style="width:90%">
              <div class="box q-py-sm">
                <div class="q-pl-md">
                  <span>{{item.sentenceEnglish}}</span>
                </div>
                <div class="q-pl-md">
                  <span>{{item.sentenceThai}}</span>
                </div>
                <div class="q-px-md">
                  <hr />
                </div>
                <div class="q-pl-md">
                  <span>{{item.situationName}}</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="expressionList.length == 0">
          <tr style="border:1px solid#646464;" class="text-h6">
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
      positions: this.$q.localStorage.getItem("currentposition"),
      titelName: "",
      dataTime: "",
      expressionList: [],

      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    };
  },
  methods: {
    printBtn() {
      window.print();
    },
    closeBtn() {
      this.$router.push("/expression");
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

      db.collection("Expression")
        .doc("draft")
        .collection("data")
        .where("positionKey", "==", this.positions)
        .get()
        .then(doc => {
          {
            this.expressionList = [];
            if (doc.size > 0) {
              doc.forEach(async element => {
                db.collection("Situation")
                  .doc(element.data().situationKey)
                  .get()
                  .then(doc => {
                    let dataKey = {
                      key: element.id,
                      situationName: doc.data().name
                    };
                    let final = {
                      ...element.data(),
                      ...dataKey
                    };
                    this.expressionList.push(final);
                    this.expressionList.sort((a, b) => {
                      return a.orderid - b.orderid;
                    });

                    this.loadingHide();
                  });
              });
            } else {
              this.loadingHide();
            }
          }
        });
    },

    loadposition() {
      db.collection("Position")
        .doc(this.positions)
        .get()
        .then(doc => {
          this.titelName = "ประโยค  : " + doc.data().name;
        });
    },

    onResize(size) {
      (this.innerWidth = size.width), (this.innerHeight = size.height);
    }
  },
  mounted() {
    this.loadData();
    this.loadposition();
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
.box {
  border-left: 1px solid grey;
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