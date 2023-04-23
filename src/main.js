import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//树形插件
import ZkTable from "vue-table-with-tree-grid";

// 导入字体图标
import "./assets/fonts/iconfont.css";
//引入全局样式
import "./assets/css/golble.css";
//配置axios全部变量
const app = createApp(App);
import axios from "axios";
axios.defaults.baseURL = "http://43.143.0.76:8889/api/private/v1/";
axios.interceptors.request.use((config) => {
  //console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
app.config.globalProperties.$http = axios; //进行全局挂载

app.use(ElementPlus).use(store).use(router).use(ZkTable);
app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.config.globalProperties.$message = "Message";
