<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片区域 -->
    <RolesCard
      :card="card"
      @getRolesList="getRolesList"
    >
    </RolesCard>

  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import Breadcrumb from "../../components/breadcrumb.vue";
import RolesCard from "../../components/Roles/rolesCard.vue";
export default {
  components: {
    Breadcrumb,
    RolesCard,
  },
  setup() {
    const store = useStore();
    //面包屑数据
    const breadcrumb = reactive({
      name1: "权限管理",
      name2: "角色列表",
    });
    //卡片屑数据
    const card = reactive({
      el_column1: {
        label: "角色名称",
        prop: "roleName",
      },
      el_column2: {
        label: "角色描述",
        prop: "roleDesc",
      },
      el_column3: {
        label: "操作",
        prop: "id",
      },
    });
    //角色管理列表
    const getRolesList = async () => {
      const { data: result } = await axios.get("roles");
      //console.log(result);
      if (result.meta.status !== 200)
        return ElMessage.error("获取权限列表失败");
      ElMessage({
        message: result.meta.msg,
        type: "success",
      });
      store.commit("UpdataRolesList", result.data);
      //console.log(store.state.rolesList);
    };
    getRolesList();
    return {
      breadcrumb,
      card,
      store,
      getRolesList,
    };
  },
};
</script>

<style>
</style>