<template>
  <div>
    <!-- 面包屑导航区 -->
  <el-breadcrumb >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>

.el-breadcrumb{
  margin-bottom: 15px;
  font-size: 12px;
}

</style>