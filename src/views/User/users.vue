<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片区域 -->
    <UserCard></UserCard>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

import Breadcrumb from "../../components/breadcrumb.vue";
import UserCard from "../../components/User/userCard.vue";
export default {
  components: {
    Breadcrumb,
    UserCard,
  },
  setup() {
    //面包屑数据
    const breadcrumb = reactive({
      name1: "用户管理",
      name2: "用户列表",
    });
    return {
      breadcrumb,
    };
  },
};
</script>

<style lang="less" scoped>
</style>