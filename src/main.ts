import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import "./index.css";

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      component: () => import("./pages/Index.vue"),
      children: [
        { path: "", component: () => import("./pages/StandingsPage.vue"), meta: { title: "Таблица" } },
        { path: "tours", component: () => import("./pages/ToursPage.vue"), meta: { title: "Туры" } },
        { path: "teams", component: () => import("./pages/TeamsPage.vue"), meta: { title: "Команды" } },
        { path: "teams/:id", component: () => import("./pages/TeamPage.vue"), meta: { title: "Команда" } },
        { path: "analytics", component: () => import("./pages/AnalyticsPage.vue"), meta: { title: "Аналитика" } },
        { path: "playoff", component: () => import("./pages/PlayoffPage.vue"), meta: { title: "Плей-офф" } },
        { path: "playground", component: () => import("./pages/PlaygroundPage.vue"), meta: { title: "Площадка" } },
        { path: "calendar", component: () => import("./pages/Calendar.vue"), meta: { title: "Календарь" } },
      ],
    },
    { path: "/:pathMatch(.*)*", component: () => import("./pages/NotFound.vue"), meta: { title: "404" } },
  ],
});

router.afterEach((to) => {
  const title = to.meta?.title as string | undefined;
  document.title = title ? `${title} | МЛЛ` : "Могилёвская Любительская Лига";
  const main = document.getElementById("main-content");
  if (main) main.focus();
});

createApp(App).use(router).mount("#root");
