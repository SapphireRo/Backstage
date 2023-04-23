<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片区域 -->
    <CateCard></CateCard>
  </div>
</template>

<script>
import { reactive } from "vue";
import Breadcrumb from "../../components/breadcrumb.vue";
import CateCard from "../../components/Goods/cateCard.vue";
export default {
  components: {
    Breadcrumb,
    CateCard,
  },
  setup() {
    //面包屑数据
    const breadcrumb = reactive({
      name1: "商品管理",
      name2: "商品分类",
    });
    return {
      breadcrumb,
    };
  },
};
</script>

<style>
</style>