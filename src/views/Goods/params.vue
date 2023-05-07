<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片区域 -->
    <ParamsCard></ParamsCard>
  </div>
</template>

<script>
import { reactive } from "vue";
import Breadcrumb from "../../components/breadcrumb.vue";
import ParamsCard from "../../components/Goods/paramsCard.vue";
export default {
  components: {
    Breadcrumb,
    ParamsCard,
  },
  setup() {
    //面包屑数据
    const breadcrumb = reactive({
      name1: "商品管理",
      name2: "参数列表",
    });
    return {
      breadcrumb,
    };
  },
};
</script>

<style>
</style>