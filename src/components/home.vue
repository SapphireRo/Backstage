<template>
  <div>
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
export default {
setup(){
    const router=useRouter()
    const loginOut=()=>{
        sessionStorage.clear()
        router.push('/login')
        ElMessage({
                    message: '退出成功！',
                    type: 'success',
                })
    }
    return {
        loginOut,
        useRouter
    }
}
}
</script>

<style>

</style>