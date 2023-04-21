<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片区域 -->
    <RightsCard :card="card">
    </RightsCard>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import Breadcrumb from "../components/breadcrumb.vue";
import RightsCard from "../components/Roles/rgihtsCard.vue";
export default {
  components: {
    Breadcrumb,
    RightsCard,
  },
  setup() {
    //面包屑数据
    const breadcrumb = reactive({
      name1: "权限管理",
      name2: "权限列表",
    });
    //卡片屑数据
    const card = reactive({
      el_column1: {
        label: "权限名称",
        prop: "authName",
      },
      el_column2: {
        label: "路径",
        prop: "path",
      },
      el_column3: {
        label: "权限等级",
        prop: "level",
      },
    });
    //获取权限列表
    const store = useStore();
    const getRightsList = async () => {
      const { data: result } = await axios.get("rights/list");
      //console.log(result);
      if (result.meta.status !== 200)
        return ElMessage.error("获取权限列表失败");
      ElMessage({
        message: result.meta.msg,
        type: "success",
      });
      store.commit("UpdataRightsList", result.data);
      //console.log(store.state.rightsList);
    };
    getRightsList();
    return {
      breadcrumb,
      store,
      card,
      getRightsList,
    };
  },
};
</script>

<style>
</style>