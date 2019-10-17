import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";

Vue.use(VueRouter);

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC7z3iQu1mE3fOu2x_ZAEEoBUaZEqAtD3o",
  authDomain: "winneratwork-818f5.firebaseapp.com",
  databaseURL: "https://winneratwork-818f5.firebaseio.com",
  projectId: "winneratwork-818f5",
  storageBucket: "winneratwork-818f5.appspot.com",
  messagingSenderId: "442368358232",
  appId: "1:442368358232:web:51453ebef86d316b"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

const storage = firebase.storage();
export const st = storage.ref();

Vue.mixin({
  data() {
    return {
      appVersion: "0.1.2",
      SystemAccounts: this.$q.localStorage.getItem("systemAccountData"),
      currentPage: this.$q.localStorage.getItem("currentPage"),
      drawer: true
    };
  },
  methods: {
    notifyRed(text) {
      this.$q.notify({
        icon: "fas fa-exclamation-circle",
        message: text,
        color: "negative",
        timeout: 1000
      })
    },
    notifyGreen(text) {
      this.$q.notify({
        icon: "fas fa-exclamation-circle",
        message: text,
        color: "secondary",
        timeout: 1000,
      });
    },
    loadingShow() {
      this.$q.loading.show({
        message: "รอสักครู่...",
        delay: 400,
      })
    },
    loadingHide() {
      this.$q.loading.hide()
    },
    async loadTime() {
      let api = "https://api.winner-english.com/data/api/gettime.php";
      let response = await axios.get(api);
      let microtime = response.data[0].microtime;

      return microtime

    }
  },
  mounted() {},
});

export default function ( /* { store, ssrContext } */ ) {
  const Router = new VueRouter({
    scrollBehavior: () => ({
      x: 0,
      y: 0
    }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  return Router;
}
