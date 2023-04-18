<template>
  <div>
    <!-- 分页区 -->
    <el-pagination
      :current-page="store.state.queryInfo.pagenum"
      :page-size="store.state.queryInfo.pagesize"
      :page-sizes="[1, 2, 5, 10]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="store.state.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useStore } from "vuex";
export default {
  props: ["getUserList"],
  setup(props, content) {
    const store = useStore();
    //数据
    const data = reactive({
      userList: [],

      //操作对话框显示
      editDialogVisible: false,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //查询到的用户信息对象
      editForm: {},
    });
    //监听pagesize改变的事件
    const handleSizeChange = (newSize) => {
      store.commit("HandleSizeChange", newSize);
      content.emit("getUserList");
    };
    //监听页码改变的事件
    const handleCurrentChange = (newPage) => {
      //console.log(newPage);
      store.commit("HandleCurrentChange", newPage);
      content.emit("getUserList");
    };
    return {
      ...toRefs(data),
      store,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>

<style>
</style>