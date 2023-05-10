<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片区域 -->
    <ReportCard></ReportCard>
  </div>
</template>
    
    <script>
import Breadcrumb from "../../components/breadcrumb.vue";
import { reactive } from "vue";
import ReportCard from "../../components/Report/reportsCard.vue";
export default {
  components: {
    Breadcrumb,
    ReportCard,
  },
  setup() {
    //面包屑数据
    const breadcrumb = reactive({
      name1: "数据统计",
      name2: "用户报表",
    });
    return {
      breadcrumb,
    };
  },
};
</script>
    
    <style>
</style>