<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片区域 -->
    <addGoodsCard></addGoodsCard>

  </div>
</template>
  
  <script>
import Breadcrumb from "../../components/breadcrumb.vue";
import { reactive } from "vue";
import addGoodsCard from "../../components/Goods/addGoodsCard.vue";
export default {
  components: {
    Breadcrumb,
    addGoodsCard,
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