<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片区域 -->
    <GoodsCard></GoodsCard>

  </div>
</template>

<script>
import Breadcrumb from "../../components/breadcrumb.vue";
import { reactive } from "vue";
import GoodsCard from "../../components/Goods/GoodsCard.vue";
export default {
  components: {
    Breadcrumb,
    GoodsCard,
  },
  setup() {
    //面包屑数据
    const breadcrumb = reactive({
      name1: "商品管理",
      name2: "商品列表",
    });
    return {
      breadcrumb,
    };
  },
};
</script>

<style>
</style>