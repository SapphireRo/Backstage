<template>
  <div>
    <el-dialog
      v-model="store.state.IsAddCateDialog"
      title="添加分类"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 主内容区 -->
      <el-form
        :model="addCateForm"
        label-width="120px"
      >
        <el-form-item label="分类名称">
          <el-input v-model="addCateForm.cat_name" />
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="value"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          />
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="store.state.IsAddCateDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="addCate"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  props: ["getCateList"],
  setup(props, content) {
    const store = useStore();
    const data = reactive({
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0,
      },
      //选中的父级分类Id数组
      value: {},
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
    });
    //获取父级分类列表
    const getParentCateList = async () => {
      const { data: result } = await axios.get("categories", {
        params: { type: 2 },
      });
      //console.log(result);
      if (result.meta.status !== 200) return;
      data.parentCateList = result.data;
    };
    getParentCateList();
    //选项改变触发
    const parentCateChanged = () => {
      console.log(data.value);
      if (data.value.length > 0) {
        data.addCateForm.cat_pid = data.value[data.value.length - 1];
        data.addCateForm.cat_level = data.value.length;
        return;
      } else {
        data.addCateForm.cat_pid = 0;
        data.addCateForm.cat_level = 0;
      }
    };
    //确定
    const addCate = async () => {
      const { data: result } = await axios.post("categories", data.addCateForm);
      console.log(result);
      if (result.meta.status !== 201)
        return ElMessage.error("添加商品分类失败");
      ElMessage({
        type: "success",
        message: "添加商品分类成功",
      });
      content.emit("getCateList");
      store.commit("CateDialogVisible", false);
    };
    //取消→重置
    const addCateDialogClosed = () => {
      data.value = [];
      data.addCateForm.cat_name = "";
      data.addCateForm.cat_level = 0;
      data.addCateForm.cat_pid = 0;
    };
    return {
      store,
      ...toRefs(data),
      getParentCateList,
      parentCateChanged,
      addCate,
      addCateDialogClosed,
    };
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  height: 200px;
  width: 100%;
}
</style>