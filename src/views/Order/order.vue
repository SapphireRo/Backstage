<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片区域 -->
    <OrderCard></OrderCard>
  </div>
</template>
  
  <script>
import Breadcrumb from "../../components/breadcrumb.vue";
import { reactive } from "vue";
import OrderCard from "../../components/Order/orderCard.vue";
export default {
  components: {
    Breadcrumb,
    OrderCard,
  },
  setup() {
    //面包屑数据
    const breadcrumb = reactive({
      name1: "订单管理",
      name2: "订单列表",
    });
    return {
      breadcrumb,
    };
  },
};
</script>
  
  <style>
</style>