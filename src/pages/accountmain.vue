<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <div class="mobile-only text-grey-2 text-h5">ผู้ใช้งาน</div>
        <div class="desktop-only text-grey-2 text-h4">ผู้ใช้งาน</div>
        <q-space />
        <div align="right" class="col-2">
          <q-btn
            size="md"
            flat
            round
            push
            icon="fas fa-print"
            class="desktop-only text-body1 text-white bg-secondary q-mr-sm"
          />

          <q-btn
            size="md"
            flat
            round
            push
            icon="fas fa-plus"
            class="q-mr-sm bg-secondary text-body1 text-white"
            @click="plusBtn(dataObj.business)"
          />
        </div>
      </q-toolbar>
    </div>
    <div class="q-pa-md-md q-pa-sm-sm q-pa-xs-sm">
      <div>
        <div class="row justify-right">
          <div class="col-md-6 col-xs-12 q-pt-md">
            <q-select
              :options="optionsSelect"
              v-model="dataObj.business"
              outlined
              emit-value
              map-options
              bg-color="grey-2"
              label="สถานประกอบการ"
              @input="selectData()"
            ></q-select>
          </div>
        </div>
        <!-- เริ่มตาราง -->

        <div class="q-pt-md desktop-only">
          <q-table :data="data" :columns="columns" row-key="name" :pagination.sync="pagination">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="user" :props="props">
                  <div align="left">{{props.row.name+ " "+ props.row.surname}}</div>
                </q-td>
                <q-td key="positions" :props="props">{{props.row.positions}}</q-td>
                <q-td key="department" :props="props">{{props.row.department}}</q-td>
                <q-td key="userName" :props="props">{{showPhoneNumber(props.row.tel)}}</q-td>
                <q-td key="password" :props="props">{{props.row.password}}</q-td>
                <q-td key="delete" :props="props">
                  <q-btn
                    flat
                    round
                    text-color="blue-grey-10"
                    icon="fas fa-trash-alt"
                    @click="deleteBtn(props.row.key)"
                  ></q-btn>
                </q-td>
                <q-td key="edit" :props="props">
                  <q-btn
                    flat
                    round
                    text-color="blue-grey-10"
                    icon="fas fa-edit"
                    @click="editBtn(props.row.key)"
                  ></q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <div class="mobile-only">
          <q-card
            class="q-my-sm bg-grey-2"
            v-for="(item,index) in data"
            :key="index"
            @click="editBtn(item.key)"
          >
            <q-card-section>
              <div class="row">
                <div style="width:calc(100% - 20px)">{{item.name}} {{item.surname}}</div>
                <div style="width: 20px">
                  <q-icon name="fas fa-chevron-right"></q-icon>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      pagination: {
        rowsPerPage: 50
        // rowsNumber: xx if getting data from a server
      },
      dataObj: {
        business: ""
      },
      optionsSelect: [],
      data: [],
      columns: [
        {
          name: "user",
          align: "center",
          label: "ชื่อ-นามสกุล",
          field: "user",
          sortable: true
        },
        {
          name: "positions",
          align: "center",
          label: "ตำแหน่ง",
          field: "positions",
          style: "width:240px",
          sortable: true
        },
        {
          name: "department",
          align: "center",
          label: "แผนก",
          field: "department",
          style: "width:240px",
          sortable: true
        },
        {
          name: "userName",
          align: "center",
          label: "เบอร์โทรศัพท์",
          style: "width:150px"
        },
        {
          name: "password",
          align: "center",
          label: "รหัสผ่าน",
          style: "width:90px"
        },
        {
          name: "delete",
          align: "center",
          label: "ลบ",
          style: "width:90px"
        },
        {
          name: "edit",
          align: "center",
          label: "แก้ไข",
          style: "width:90px"
        }
      ]
    };
  },
  methods: {
    showPhoneNumber(data) {
      let output;
      output =
        data.toString().substring(0, 3) +
        "-" +
        data.toString().substring(3, 6) +
        "-" +
        data.toString().substring(6);
      return output;
    },
    selectData() {
      this.loadCustomer();
    },
    plusBtn(key) {
      this.$router.push("/account/add/" + key);
    },
    loadBusiness() {
      this.$q.loading.show({
        delay: 400
      });
      db.collection("Business")
        .where("status", "==", true)
        .get()
        .then(doc => {
          doc.forEach(element => {
            let loadData = {
              value: element.id,
              label: element.data().name
            };

            this.optionsSelect.push(loadData);
          });
          this.optionsSelect.sort((a, b) => {
            return a.label - b.label ? 1 : -1;
          });
          this.dataObj.business = this.optionsSelect[0].value;
          this.loadCustomer();
        });
    },
    loadCustomer() {
      db.collection("CustomerAccounts")
        .where("businessKey", "==", this.dataObj.business)
        .where("status", "==", true)
        .get()
        .then(doc => {
          this.data = [];
          let departmentname = "";
          let Positionname = "";

          if (doc.size > 0) {
            doc.forEach(element => {
              db.collection("Department")
                .doc(element.data().departmentKey)
                .get()
                .then(amm => {
                  if (amm.exists) {
                    db.collection("Position")
                      .doc(element.data().positionKey)
                      .get()
                      .then(job => {
                        if (job.exists) {
                          let dataname = {
                            department: amm.data().name,
                            positions: job.data().name,
                            key: element.id
                          };
                          let final = {
                            ...dataname,
                            ...element.data()
                          };
                          this.data.push(final);
                          this.$q.loading.hide();
                        }
                      });
                  }
                });
            });
          } else {
            this.$q.loading.hide();
          }
        });
    },
    editBtn(key) {
      console.log(key);
      this.$router.push("/account/edit/" + key + "/" + this.dataObj.business);
    },
    deleteBtn(key) {
      this.$q
        .dialog({
          title: "ลบข้อมูล",
          message: "ยืนยันการลบข้อมูล",
          cancel: "ยกเลิก",
          ok: "ตกลง",
          persistent: true
        })
        .onOk(() => {
          db.collection("CustomerAccounts")
            .doc(key)
            .update({
              status: false
            })
            .then(() => {
              this.loadCustomer();
              this.$q.notify({
                message: "ลบข้อมูลเสร็จสิ้น",
                color: "secondary",
                position: "bottom",
                timeout: 1000,
                icon: "fas fa-check-circle"
              });
            });
        });
    }
  },
  mounted() {
    this.loadBusiness();
  }
};
</script>