<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input
            placeholder="请输入内容"
            v-model="store.state.queryInfo.query"
            clearable
          >
            <template #append>
              <el-button
                icon="Search"
                @click="getUserList"
              />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible(true)"
          > 添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table
        :data="store.state.userList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          prop="username"
          label="姓名"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          width="150px"
        />
        <el-table-column
          prop="mobile"
          label="电话"
        />
        <el-table-column
          prop="role_name"
          label="角色"
        />
        <el-table-column
          prop="mg_state"
          label="状态"
        >
          <template v-slot="{row}">
            <el-switch
              v-model="row.mg_state"
              class="ml-2"
              @change="userStateChanged(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template v-slot="{row}">
            <!-- 修改按钮 -->
            <el-tooltip
              effect="dark"
              content="修改用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="Edit"
                size="small"
                @click="EditDialog(row.id)"
              />
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click="removeUserById(row.id)"
              />
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="User"
                size="small"
                @click="setRole(row)"
              />
            </el-tooltip>
          </template>

        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <pagination @getUserList="getUserList"></pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <addDialog
      @getUserList="getUserList"
      @addDialogVisible="addDialogVisible"
    ></addDialog>
    <!-- 修改用户的对话框 -->
    <editDialog
      @getUserList="getUserList"
      @showEditDialogVisible="showEditDialogVisible"
    ></editDialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :model-value="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div class="power">
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
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
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import addDialog from "./Diglog/addDialog.vue";
import editDialog from "./Diglog/editDialog.vue";
import pagination from "../pagination.vue";
//消息弹框
import { Action } from "element-plus";
export default {
  components: { addDialog, editDialog, pagination },
  setup() {
    const store = useStore();
    //数据
    const data = reactive({
      //操作对话框显示
      editDialogVisible: false,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //查询到的用户信息对象
      editForm: {},
      // 需要被分配角色的用户信息
      userInfo: {},
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: "",
    });
    //用户数据列表获取
    const getUserList = async () => {
      const { data: res } = await axios.get("users", {
        params: store.state.queryInfo,
      });
      //console.log(res);
      if (res.meta.status != 200) return ElMessage.error("获取用户列表失败");
      store.commit("UpdataUserList", res.data.users);
      store.state.total = res.data.total;
      //console.log(store.state.userList);
    };
    getUserList();

    //改变用户状态
    const userStateChanged = async (userinfo) => {
      //console.log(userinfo);
      const { data: res } = await axios.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return ElMessage.error("更新用户状态失败");
      }
      ElMessage({
        message: "更新用户状态成功！",
        type: "success",
      });
    };

    //展示添加用户对话框
    const addDialogVisible = (visible) => {
      //console.log(store.state.IsAddDialogVisible);
      store.commit("AddDialogVisible", visible);
      //console.log(store.state.IsAddDialogVisible);
    };
    //展示修改用户对话框
    const showEditDialogVisible = (visible) => {
      store.commit("EditDialogVisible", visible);
      console.log(store.state.IsEditDialogVisible);
    };
    //修改用户
    const EditDialog = async (id) => {
      const { data: result } = await axios.get("users/" + id);
      if (result.meta.status !== 200) {
        return ElMessage.error("查询用户状态失败");
      }
      store.commit("updataEditForm", result.data);
      store.state.IsEditDialogVisible = true;
    };
    //删除用户
    const removeUserById = (id) => {
      console.log(id);
      ElMessageBox.confirm("此操作将永久删除该用户，是否继续？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: result } = await axios.delete("users/" + id);
          if (result.meta.status !== 200) {
            ElMessage({
              type: "info",
              message: "删除失败",
            });
          } else {
            ElMessage({
              type: "success",
              message: "删除成功",
            });
            getUserList();
          }
        })
        //取消删除
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消操作",
          });
          console.log("22222");
        });
    };
    // 展示分配角色的对话框
    const setRole = async (userInfo) => {
      data.userInfo = userInfo;
      console.log(data.userInfo);
      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await axios.get("roles");
      if (res.meta.status !== 200) {
        return ElMessage.error("获取角色列表失败！");
      }
      data.rolesList = res.data;
      data.setRoleDialogVisible = true;
    };
    // 点击按钮，分配角色
    const saveRoleInfo = async () => {
      if (!data.selectedRoleId) {
        return ElMessage.error("请选择要分配的角色！");
      }
      const { data: res } = await axios.put(`users/${data.userInfo.id}/role`, {
        rid: data.selectedRoleId,
      });
      console.log(res);
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
      store,
      getUserList,
      userStateChanged,
      addDialogVisible,
      EditDialog,
      showEditDialogVisible,
      removeUserById,
      setRoleDialogClosed,
      saveRoleInfo,
      setRole,
    };
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  z-index: 1;
}
/deep/ .el-table {
  margin-top: 15px;
  font-size: 12px;
}
/deep/ .el-pagination {
  margin-top: 15px;
}
.power {
  margin: 0;
  p {
    margin-bottom: 10px;
  }
}
.dialog-footer {
  .el-button {
    margin-top: 20px;
  }
}
</style>