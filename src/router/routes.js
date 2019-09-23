const routes = [
  {
    path: "/",
    component: () => import("pages/login.vue"),
    name: "login"
  },
  {
    path: "/welcomeback",
    component: () => import("pages/welcomeback.vue"),
    name: "welcomeback"
  },
  // logout
  {
    path: "/logout",
    component: () => import("pages/logout.vue"),
    name: "logout"
  },
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      {
        path: "/welcome",
        component: () => import("pages/Index.vue"),
        name: "welcome"
      },
      // หน้า Admin
      {
        path: "/admin",
        component: () => import("pages/adminmain.vue"),
        name: "adminmain"
      },
      {
        path: "/admin/add",
        component: () => import("pages/adminadd.vue"),
        name: "adminadd"
      },
      {
        path: "/admin/edit/:key",
        component: () => import("pages/adminadd.vue"),
        name: "adminedit"
      },
      {
        path: "/user/edit",
        component: () => import("pages/adminadd.vue"),
        name: "useredit"
      },

      // pages workplace
      {
        path: "/workplace",
        component: () => import("pages/workplacemain.vue"),
        name: "workplacemain"
      },
      {
        path: "/workplace/add",
        component: () => import("pages/workplaceadd.vue"),
        name: "workplaceadd"
      },
      {
        path: "/workplace/edit/:key",
        component: () => import("pages/workplaceadd.vue"),
        name: "workplaceedit"
      },

      // page Account
      {
        path: "/account",
        component: () => import("pages/accountmain.vue"),
        name: "accountmain"
      },
      {
        path: "/account/add/:businesskey",
        component: () => import("pages/accountadd.vue"),
        name: "accountadd"
      },
      {
        path: "/account/edit/:userkey/:businesskey?",
        component: () => import("pages/accountadd.vue"),
        name: "accountedit"
      },

      // pages position
      {
        path: "/position",
        component: () => import("pages/positionmain.vue"),
        name: "positionmain"
      },
      {
        path: "/position/add",
        component: () => import("pages/positionadd.vue"),
        name: "positionadd"
      },
      {
        path: "/position/edit/:key",
        component: () => import("pages/positionadd.vue"),
        name: "positionedit"
      },

      // pages vocabulary
      {
        path: "/vocabulary",
        component: () => import("pages/vocabularymain.vue"),
        name: "vocabularymain"
      },
      {
        path: "/vocabulary/add",
        component: () => import("pages/vocabularyadd.vue"),
        name: "vocabularyadd"
      },
      {
        path: "/vocabulary/edit/:key",
        component: () => import("pages/vocabularyadd.vue"),
        name: "vocabularyedit"
      },

      // pages expression
      {
        path: "/expression",
        component: () => import("pages/expressionmain.vue"),
        name: "expressionmain"
      },
      {
        path: "/expression/add",
        component: () => import("pages/expressionadd.vue"),
        name: "expressionadd"
      },
      {
        path: "/expression/edit/:key",
        component: () => import("pages/expressionadd.vue"),
        name: "expressionedit"
      },

      // pages reading
      {
        path: "/dialog",
        component: () => import("pages/dialogmain.vue"),
        name: "dialogmain"
      },
      {
        path: "/dialog/add",
        component: () => import("pages/dialogadd.vue"),
        name: "dialogadd"
      },
      {
        path: "/dialog/edit/:key/:page",
        component: () => import("pages/dialogadd.vue"),
        name: "dialogedit"
      },

      // pages writing
      {
        path: "/writing",
        component: () => import("pages/writingmain.vue"),
        name: "writingmain"
      },
      {
        path: "/writing/add",
        component: () => import("pages/writingadd.vue"),
        name: "writingadd"
      },
      {
        path: "/landing/:key/:page",
        component: () => import("pages/landing.vue"),
        name: "landingpage"
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
