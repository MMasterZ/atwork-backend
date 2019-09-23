<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <q-toolbar-title class="col-10 mobile-only text-white text-h5" align="center">Vocabulary</q-toolbar-title>
        <q-toolbar-title class="col-11 desktop-only text-white text-h4" align="center">คำศัพท์</q-toolbar-title>
        <q-space />
        <div align="right" class="q-pr-sm">
          <q-btn
            @click="reloadBtn()"
            size="md"
            color="secondary"
            round
            icon="fas fa-sync-alt"
            class="text-body1 text-white"
          />
        </div>
      </q-toolbar>
    </div>
    <div class="q-mx-md q-mt-md bg-grey-2">
      <div>
        <q-tabs
          v-model="tab"
          inline-label
          class="bg-grey-2 text-grey-7 shadow-2 relative-position"
          align="left"
          active-color="secondary"
          style="border-bottom:1px solid #757575;height:60px"
        >
          <q-tab name="draft" label="แบบร่าง" icon="fas fa-pen"></q-tab>
          <q-tab name="server" label="เซิร์ฟเวอร์" icon="fas fa-cloud"></q-tab>
          <q-input filled class="absolute-top-right" label="ค้นหา">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-tabs>
      </div>
      <div class="row q-pa-md">
        <div class="col-md-6">
          <q-select
            outlined
            label="ตำแหน่งทั่วไป"
            v-model="vocab.position"
            :options="positionOptions"
          />
        </div>
        <div class="col-md-6 q-py-sm" align="right">
          <q-btn
            @click="addBtn()"
            size="md"
            color="secondary"
            round
            icon="fas fa-plus"
            class="text-body1 text-white q-mx-md"
          />
          <q-btn
            @click="printBtn()"
            size="md"
            color="secondary"
            round
            icon="fas fa-print"
            class="text-body1 text-white"
          />
        </div>
      </div>
      <div class="q-pb-lg flex flex-center">
        <q-pagination v-model="page" :max="6" color="blue-grey-10" :direction-links="true" />
      </div>
      <div class="row">
        <div
          v-for="(item,index ) in    vocabularyList "
          :key="index"
          class="col-md-3 col-sm-6 col-xs-12 q-px-md q-py-sm"
        >
          <q-toolbar class="no-padding q-py-sm col-md-3 shadow-10 bg-grey-2">
            <q-btn
              flat
              dense
              icon="fas fa-volume-up"
              style="width:60px; height:70px"
              class="bg-secondary text-grey-2"
            />
            <q-toolbar-title>{{item.vocab}}</q-toolbar-title>
            <q-toolbar-title>{{item.meaning}}</q-toolbar-title>
            <q-btn flat @click="editBtn()" dense icon="fas fa-chevron-right" style=" height:70px" />
          </q-toolbar>
        </div>
      </div>

      <div class="q-pt-lg q-pb-md flex flex-center">
        <q-pagination v-model="page" :max="6" color="blue-grey-10" :direction-links="true" />
      </div>
    </div>
  </q-page>
</template>



<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      tab: "draft",
      vocabularyList: [],
      vocab: { position: "", positionKey: "" },
      page: 1,
      positionOptions: []
    };
  },
  methods: {
    loadData() {
      db.collection("Vocabulary")
        .where("positionKey", "==", this.vocab.positionKey)
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
          }
        });
    },
    loadPosition() {
      db.collection("Position")
        .get()
        .then(doc => {
          doc.forEach(element => {
            let loadPosi = {
              value: element.id,
              label: element.data().name
            };
            let final = {
              ...loadPosi,
              ...element.data()
            };
            this.vocab.positionKey = loadPosi.value;
            this.positionOptions.push(final);
            this.vocab.position = this.positionOptions[0].label;
            console.log(this.vocab.positionKey);
          });
        });
    },
    editBtn() {
      this.$router.push("/vocabulary/add/" + key);
    },
    addBtn() {
      this.$router.push("/vocabulary/add");
    }
  },
  mounted() {
    this.loadPosition();
  }
};
</script>
<style scoped >
</style>