<template>
  <div>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :model-value="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{data.userInfo.username}}</p>
        <p>当前的角色：{{data.userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select
            v-model="selectedRoleId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveRoleInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
  props: ["getUserList"],
  setup(props) {
    const data = reactive({
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: true,

      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: "",
    });
    // 展示分配角色的对话框
    const setRole = async (userInfo) => {
      data.userInfo = userInfo;

      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await axios.get("roles");
      if (res.meta.status !== 200) {
        return ElMessage.error("获取角色列表失败！");
      }

      data.rolesList = res.data;
    };
    // 点击按钮，分配角色
    const saveRoleInfo = async () => {
      if (!data.selectedRoleId) {
        return ElMessage.error("请选择要分配的角色！");
      }

      const { data: res } = await axios.put(`users/${data.userInfo.id}/role`, {
        rid: data.selectedRoleId,
      });

      if (res.meta.status !== 200) {
        return ElMessage.error("更新角色失败！");
      }

      ElMessage({
        message: "更新角色成功",
        type: "success",
      });
      props.getUserList();
      data.setRoleDialogVisible = false;
    };
    // 监听分配角色对话框的关闭事件
    const setRoleDialogClosed = () => {
      data.selectedRoleId = "";
      data.userInfo = {};
    };
    return {
      ...toRefs(data),
      props,
      setRole,
      saveRoleInfo,
      setRoleDialogClosed,
    };
  },
};
</script>

<style>
</style>