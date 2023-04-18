<template>
  <div>
    <!-- 修改用户的对话框 -->
    <el-dialog
      :model-value="store.state.IsEditDialogVisible"
      @close="editDialogClosed"
      title="修改用户"
      width="50%"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="store.state.editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="store.state.editForm.username"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="store.state.editForm.email" />
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="store.state.editForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <!-- 底部区域 -->
        <span class="dialog-footer">
          <el-button @click="editDialogVisible(false)">取消</el-button>
          <el-button
            type="primary"
            @click="editUserInfo"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { reactive, toRefs, ref } from "vue";

export default {
  props: ["showEditDialogVisible", "getUserList"],
  setup(props, content) {
    const store = useStore();
    //邮箱验证
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) return callback();
      callback(new Error("请输入合法的邮箱"));
    };
    //手机验证
    const checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) return callback();
      callback(new Error("请输入合法的手机号"));
    };
    const editFormRef = ref();
    const data = reactive({
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入用户手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    });
    const editDialogVisible = (visible) => {
      content.emit("showEditDialogVisible", visible);
    };
    //重置
    const editDialogClosed = () => {
      editFormRef.value.resetFields();
    };
    //修改用户信息
    const editUserInfo = () => {
      editFormRef.value.validate(async (valid) => {
        if (!valid) return ElMessage.error("请添加修改的信息");
        // 发起修改用户信息的数据请求
        const { data: result } = await axios.put(
          "users/" + store.state.editForm.id,
          {
            email: store.state.editForm.email,
            mobile: store.state.editForm.mobile,
          }
        );
        if (result.meta.status !== 200) return ElMessage.error("修改用户失败");
        console.log(result);
        ElMessage({
          message: "修改用户成功！",
          type: "success",
        });
        //关闭对话框
        content.emit("showEditDialogVisible", false);
        //更新
        content.emit("getUserList");
      });
    };

    return {
      ...toRefs(data),
      store,
      editDialogVisible,
      editUserInfo,
      editDialogClosed,
      editFormRef,
    };
  },
};
</script>

<style>
</style>