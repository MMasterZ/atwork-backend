<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">สถานประกอบการ</div>
        <div class="desktop-only text-grey-2 text-h6">สถานประกอบการ</div>

        <q-space />
        <div align="right" class="q-pr-sm">
          <q-btn
            @click="addBtn()"
            size="md"
            color="secondary"
            round
            icon="fas fa-plus"
            class="text-body1 text-grey-2"
          />
        </div>
      </q-toolbar>
    </div>
    <div>
      <!-- table -->
      <div class="q-pa-md-md desktop-only">
        <div class="bg-grey-2">
          <q-table :data="data" :columns="columns" :pagination.sync="pagination" row-key="name">
            <template v-slot:body="props">
              <q-tr class="text-blue-grey-10" :props="props">
                <q-td key="workplacemain" :props="props">
                  <div align="left">{{ props.row.name }}</div>
                </q-td>
                <q-td key="province" :props="props">{{ props.row.provinceKey }}</q-td>
                <q-td key="delete" :props="props">
                  <q-btn
                    round
                    flat
                    text-color="blue-grey-10"
                    icon="fas fa-trash-alt"
                    @click="deleteBtn(props.row.key)"
                    size="md"
                  />
                </q-td>
                <q-td key="edit" :props="props">
                  <q-btn
                    round
                    flat
                    text-color="blue-grey-10"
                    icon="fas fa-edit"
                    @click="editBtn(props.row.key)"
                    size="md"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>

      <!-- mobile-->
      <div class="mobile-only">
        <q-card
          class="q-ma-sm"
          v-for="(item,index) in data"
          :key="index"
          @click="editBtn(item.key)"
        >
          <q-card-section class="bg-grey-2">
            <div class="row">
              <div style="width:calc(100% - 20px)">{{item.name}} - {{item.provinceKey}}</div>
              <div style="width: 20px">
                <q-icon name="fas fa-chevron-right"></q-icon>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { db } from "../router";

export default {
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 50
      },
      data: [],
      columns: [
        {
          name: "workplacemain",
          align: "center",
          label: "ชื่อสถานประกอบการ",
          sortable: true,
          field: "wordplacemain",
          style: " height:60px"
        },
        {
          name: "province",
          align: "center",
          label: "จังหวัด",
          sortable: true,
          style: "width:300px",
          field: "province"
        },
        { name: "delete", align: "center", label: "ลบ", style: "width:90px" },
        { name: "edit", align: "center", label: "แก้ไข", style: "width:90px" }
      ]
    };
  },
  methods: {
    // การเช็คค่า ถ้าเป็นจริงให้ ออกมาโชว์
    loadtrue() {
      db.collection("Business")
        .where("status", "==", true)
        .onSnapshot(doc => {
          doc.forEach(element => {
            let dataKey = {
              key: element.id
            };
          });
        });
    },
    // โหลดข้อมูลออกมาโชว์ของสถานประกอบการณ์
    loadData() {
      this.loadingShow();
      db.collection("Business")
        .where("status", "==", true)
        .onSnapshot(data => {
          this.data = [];
          data.forEach(element => {
            let dataKey = {
              key: element.id
            };
            let datafirnal = {
              ...dataKey,
              ...element.data()
            };
            this.data.push(datafirnal);
            this.data.sort((a, b) => {
              return a.name > b.name ? 1 : -1;
            });
            this.loadingHide();
          });
        });
    },
    // ปุ่มลบข้อมูลสถานประกอบการ แล้วเช็คว่า มีผู้ใช้งานอยู่ไหม ถ้าไม่มีลบได้ ถ้ามีลบไม่ได้
    deleteBtn(key) {
      db.collection("CustomerAccounts")
        .where("businessKey", "==", key)
        .get()
        .then(doc => {
          if (doc.size > 0) {
            this.$q
              .dialog({
                class: "no-margin ",
                style: "padding: 0px;",
                title:
                  "<div class='row'> <div class='col-11'> แจ้งเตือน </div><div class='col-1' align='right'></div> </div> ",
                html: true,
                message: "<div class='text-body1'>  ยืนยันการลบข้อมูล </div>",
                ok: "ยืนยัน",
                cancel: "ยกเลิก",
                persistent: true
              })
              .onOk(() => {
                this.notifyRed("มีผู้ใช้งานอยู่ไม่สามารลบได้");
              });
          } else {
            this.$q
              .dialog({
                class: "no-margin ",
                style: "padding: 0px;",
                title:
                  "<div class='row'> <div class='col-11'> แจ้งเตือน </div><div class='col-1' align='right'></div> </div> ",
                html: true,
                message: "<div class='text-body1'>  ยืนยันการลบข้อมูล </div>",
                ok: "ยืนยัน",
                cancel: "ยกเลิก",
                persistent: true
              })
              .onOk(() => {
                db.collection("Business")
                  .doc(key)
                  .update({
                    status: false
                  });
                this.notifyGreen("ลบข้อมูลเรียบร้อย");
              });
          }
        });
    },
    // ปุ่มแก้ไขข้อมูล
    editBtn(key) {
      this.$router.push("/workplace/edit/" + key);
    },
    // ปุ่มเพิ่มข้อมูล
    addBtn() {
      this.$router.push("/workplace/add");
    }
  },
  mounted() {
    this.loadtrue();
    this.loadData();
  }
};
</script>

<style >
</style>