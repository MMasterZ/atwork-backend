<template>
  <q-page>
    <div class="my-border-left bg-blue-grey-10 q-py-md">
      <q-toolbar class="text-primary">
        <div></div>
        <q-space />
        <q-toolbar-title class="text-white text-h4" align="center">welcome</q-toolbar-title>
        <q-space />
        <div>
          <q-btn flat round push icon="fas fa-print" class="text-body1 text-white" />
          <q-btn flat round push icon="fas fa-plus" class="text-body1 text-white" />
        </div>
      </q-toolbar>
    </div>
    <div class="q-pa-md-md">
      <div class="bg-grey-2">
        <div class="q-pa-sm">
          <q-input type="file" multiple @input="addimage($event)" />
          <!-- <q-input type="file" multiple @change="addimage($event.target.files)" /> -->

          <div v-for="(item,index) in imageList" :key="index" style="width:250px">
            <div style="width:250px">
              <q-btn class="q-ma-sm" @click="deleteImage(index)">
                <q-img :src="item" style="width:250px" />
              </q-btn>
            </div>
            <div align="center">{{imageLog[index].name}}</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { st } from "../router/index.js";
export default {
  data() {
    return {
      progressUpload: 0,
      uploadTask: "",
      imageList: [],
      uploadFileList: [],
      imageLog: [],
      image: ""
    };
  },
  methods: {
    deleteImage(index) {
      st.child(this.imageLog[index].path)
        .delete()
        .then(() => {
          this.imageLog.splice(index, 1);
          this.imageList.splice(index, 1);
        });
    },
    loadImage() {
      st.child("images")
        .listAll()
        .then(doc => {
          doc.items.forEach(result => {
            result.getDownloadURL().then(item => {
              this.imageList.push(item);
            });
          });
        });
    },
    addimage(file) {
      let saveFiles = file;

      for (let i = 0; i < saveFiles.length; i++) {
        st.child("/images/" + saveFiles[i].name)
          .put(saveFiles[i])
          .then(doc => {
            doc.ref.getDownloadURL().then(item => {
              let dataName = {
                name: saveFiles[i].name,
                path: doc.ref.fullPath
              };
              this.imageLog.push(dataName);
              this.imageList.push(item);
            });
          });
      }
    }
  },
  mounted() {}
};
</script>