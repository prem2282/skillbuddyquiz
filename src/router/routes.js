const routes = [
  {
    path: "/",
    component: () => import("layouts/HomeLayout.vue"),
    children: [{ path: "", component: () => import("pages/HomePage.vue") }],
  },
  {
    path: "/quiz",
    component: () => import("layouts/HomeLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/academics/QuizPage.vue"),
      },
    ],
  },
  {
    path: "/match",
    component: () => import("layouts/HomeLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/academics/MatchType.vue"),
      },
    ],
  },
  {
    path: "/result",
    component: () => import("layouts/HomeLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/academics/ResultPage.vue"),
      },
    ],
  },

  // {
  //   path: "/explorer",
  //   component: () => import("components/local/ChapterViewer.vue"),
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
