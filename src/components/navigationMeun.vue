<template>
<div >
  <!-- 折叠栏 -->
  <div class="toggle_button" @click="toggleCollapse">
                {{isCollapse==true?"展开＞":"收起＜"}}
                <!-- <el-icon><ArrowRight /></el-icon> -->
  </div>
  <!-- 侧边区域 -->
    <el-row class="tac" >
        <el-menu
        active-text-color="#409eff"
        background-color="#333744"
        class="el-menu-vertical-demo"
        :default-active="acvtivePath"
        text-color="#fff"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
      >
      <!-- 一级菜单 -->
        <el-sub-menu :index="item.id+''" v-for="item in menulist" :key="item.id">
          <!-- 一级菜单模板区 -->
          <template #title>
            <!-- 图标 -->
            <i :class="iconObj[item.id]"></i>
            <!-- 文本 -->
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="subItem.path+''" 
          v-for="subItem in item.children" 
          :key="subItem.id"
          @click="savaNavState(subItem.path)">
            <!-- 二级菜单模板区 -->
          <template #title>
            <!-- 图标 -->
            <el-icon><Menu /></el-icon>
            <!-- 文本 -->
            <span>{{subItem.authName}}</span>
          </template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-row>
</div>
  </template>
  
  <script>
  import  axios  from  "axios"
  import { reactive,toRefs } from 'vue'
  import { ElMessage } from 'element-plus'
  export default {
  setup(props,context){
    const data=reactive({
      //左侧菜单数据
      menulist:[],
      //字体组件
      iconObj:{
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      //是否折叠
      isCollapse:false,
      //保存激活的链接
      acvtivePath:''
    })
    //获取所有菜单
    const getMenuList=async()=>{
      const {data:result}=await axios.get('menus')
      //console.log(result);
      if(result.meta.status!==200) return ElMessage.error(res.meta.msg)
      data.menulist=result.data
      //console.log(data.menulist);
    }
    getMenuList()
    //点击按钮切换菜单栏
    const toggleCollapse=()=>{
        data.isCollapse=!data.isCollapse
        //改变折叠宽度→传值给子组件
        context.emit('changeCollapse',data.isCollapse)
    }
    //保存链接的激活状态
    const savaNavState=(acvtivePath)=>{
      sessionStorage.setItem('activePath',acvtivePath)
      data.acvtivePath=sessionStorage.getItem('activePath')
    }
    savaNavState()
    return{
      ...toRefs(data),
      getMenuList,toggleCollapse,savaNavState
    }
 }
  }
  </script>

  <style lang="less" scoped>
  .el-menu{
    border-right: none;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle_button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
  </style>