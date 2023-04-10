import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../components/login.vue";
import Home from "../components/home.vue";
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
  if (tokenStr) next();
  return next("./login");
  ElMessage.error("请先登录");
});
export default router;
