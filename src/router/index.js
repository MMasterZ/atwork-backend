import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

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
      appVersion: "0.0.6",
      SystemAccounts: this.$q.localStorage.getItem('systemAccountData'),
      currentPage: this.$q.localStorage.getItem('currentPage'),
      drawer: true,
    };
  },
  methods: {

  },
  mounted() {

  },
  watch: {


  }
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
  })

  return Router
}
