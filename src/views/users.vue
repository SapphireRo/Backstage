<template>
  <div>
    <!-- 面包屑导航区 -->
    <Breadcrumb></Breadcrumb>
    <!-- 卡片区域 -->
    <UserCard ></UserCard>
  </div>
</template>

<script>

import Breadcrumb from '../components/User/breadcrumb.vue'
import UserCard from '../components/User/userCard.vue'
export default {
  components:{
    Breadcrumb,UserCard
  },
  setup(){
  
  }
}
</script>

<style lang="less" scoped>

</style>