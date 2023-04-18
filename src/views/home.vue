<template>
    <div class="common-layout">
    <el-container>
        <!-- 头部区域 -->
      <el-header>
        <div class="header_left">
            <img src="../assets/monkey.jpg" alt="">
            <span>猴子电商后台管理系统</span>
        </div>
        <div class="header_button">
            <el-button type="info" @click="loginOut">退出</el-button>
        </div>
      </el-header>
      <!-- 页面主体区 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'" 
         >
            <navigationMeun @changeCollapse="collapseWidth"/>
        </el-aside>
        <!-- 右边页面主体区 -->
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import navigationMeun from '../components/navigationMeun.vue'
import { reactive, ref, toRefs } from 'vue'
export default {
components:{navigationMeun},
setup(){
    const isCollapse=ref("");
    const router=useRouter()
    //退出
    const loginOut=()=>{
        sessionStorage.clear()
        router.push('/login')
        ElMessage({
                    message: '退出成功！',
                    type: 'success',
                })
    }
    const collapseWidth = (val) => {
        isCollapse.value=val 
    }
    return {
        isCollapse,
        loginOut,useRouter,collapseWidth
    }
}
}
</script>

<style lang="less" scoped>
 .common-layout, .el-container{
    height: 100%;
}

.el-header{
    background-color: #373d41;
    display: flex;
    padding-left: 0;
    justify-content: space-between;
    .header_left{
        display: flex;
        align-items: center;
        margin-left: 15px;
        img{
            width: 50px;
            height: 50px;
            border-radius: 25px;
            margin-top: 5px;
        }
        span{
            color: #fff;
            margin-left: 20px;
        }
        
    }
    .header_button{
        display: flex;
        align-items: center;
    }
}
.el-aside{
    background-color: #333744;
}
.el-main{
    background-color: #eaedf1;
}

</style>