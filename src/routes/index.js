import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";

const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: LoginView,
    meta: {
      title: "Inicio de Sesion - CRUD Supabase",
    },
  },
  {
    path: "/register",
    name: "SignInPage",
    component: () => import("@/views/SingInView.vue"),
    meta: {
      title: "Registro - CRUD Supabase",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
