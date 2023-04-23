import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login/login.vue";
import Home from "../views/home.vue";
import Welcome from "../components/welcome.vue";
import Users from "../views/User/users.vue";
import Rights from "../views/Rights/rights.vue";
import Roles from "../views/Rights/roles.vue";
import Categories from "../views/Goods/categories.vue";
import { ElMessage } from "element-plus";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: Welcome,
      },
      {
        path: "/users",
        component: Users,
      },
      {
        path: "/rights",
        component: Rights,
      },
      {
        path: "/roles",
        component: Roles,
      },
      {
        path: "/categories",
        component: Categories,
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
//路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  //获取Token
  const tokenStr = sessionStorage.getItem("token");
  if (tokenStr) return next();
  next("./login");
  ElMessage.error("请先登录");
});
export default router;
