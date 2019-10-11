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
      <table class="table">
        <tr>
          <th
            style=" background: rgb(43, 43, 43);"
            class="q-pa-sm text-h6 text-white"
            colspan="3"
          >{{this.titelName }}</th>
        </tr>
      </table>
      <div class="q-pt-md">
        <div
          v-for="(item,index ) in    expressionList "
          :key="index "
          class="row text-h6"
          style="border: 1px solid grey;width:100%; border-collapse: collapse; "
        >
          <div class="col-1 q-pt-sm text-center">
            <span>{{index +1}}</span>
          </div>
          <div class="col-11 box q-py-sm">
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
        </div>
        <div class="q-pt-xl text-body1" align="right">
          <span>{{dataTime}}</span>
        </div>
      </div>
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
      lessonName: "",
      vocabularyList: [],
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
    loadData() {
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
                    this.loadTime();
                    this.loadingHide();
                  });
              });
            } else {
              this.loadingHide();
            }
          }
        });
    },
    loadTime() {
      let date = new Date(st);
      var thday = new Array(
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัส",
        "ศุกร์",
        "เสาร์"
      );
      var thmonth = new Array(
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม"
      );

      this.dataTime =
        "วันที่ " +
        date.getDate() +
        "/" +
        date.getMonth() +
        "/" +
        (date.getYear() - 100);
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