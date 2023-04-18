<template>
  <div>
    <!-- 添加用户的对话框 -->
    <el-dialog
      :model-value="store.state.IsAddDialogVisible"
      title="添加用户"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        ref="addFormRef"
        :model="store.state.addForm"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="store.state.addForm.username" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="store.state.addForm.password"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="store.state.addForm.email" />
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="store.state.addForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <!-- 底部区域 -->
        <span class="dialog-footer">
          <el-button @click="addDialogVisible(false)">取消</el-button>
          <el-button
            type="primary"
            @click="addUser"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

export default {
  props: ["getUserList", "addDialogVisible", "addFormRules"],
  setup(props, content) {
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
    const data = reactive({
      //添加用户的表单校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, message: "请输入正确的手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    });
    const addFormRef = ref();
    //展示对话框
    const store = useStore();
    const addDialogVisible = (visible) => {
      content.emit("addDialogVisible", visible);
    };
    // 添加新用户
    const addUser = () => {
      addFormRef.value.validate(async (valid) => {
        if (!valid) return;
        const { data: result } = await axios.post("users", store.state.addForm);
        console.log(result);
        if (result.meta.status !== 201) return ElMessage.error("添加用户失败");
        ElMessage({
          message: "添加用户成功！",
          type: "success",
        });
        //隐藏
        addDialogVisible(false);
        content.emit("getUserList");
      });
    };

    //重置
    const addDialogClosed = () => {
      addFormRef.value.resetFields();
    };
    return {
      ...toRefs(data, props),
      addFormRef,
      store,
      addDialogVisible,
      addUser,
      addDialogClosed,
    };
  },
};
</script>

<style>
</style>