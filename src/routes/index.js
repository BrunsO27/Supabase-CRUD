import { createRouter, createWebHistory } from "vue-router";
import supabase from "@/supabase/client";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("@/views/HomeView.vue"),
    meta: {
      title: "Home - CRUD Supabase",
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/views/LoginView.vue"),
    meta: {
      title: "Inicio de Sesión - CRUD Supabase",
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

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();

  console.log({ data });

  const isAuth = !!data.session;

  if (to.meta.requiresAuth && !isAuth) {
    return next("/login");
  }

  // Evitar ir a login si ya está autenticado
  if ((to.path === "/login" || to.path === "/register") && isAuth) {
    return next("/");
  }

  next();
});

export default router;
