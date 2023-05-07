<template>
  <div>
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      />

      <!-- 选择参数列表 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectCate"
            :options="store.state.cateList"
            :props="cateProps"
            @change="selectedChange"
          />
        </el-col>
        <!-- tab页签区 -->
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-change="handleTabClick"
        >
          <!-- 添加动态参数面板 -->
          <el-tab-pane
            label="动态参数"
            name="many"
          >
            <!-- 添加动态参数按钮 -->
            <el-button
              type="primary"
              size="small"
              :disabled="isBtnDisabled"
              @click="addDialogVisible=true"
            >添加参数</el-button>
            <!-- 添加动态参数表格 -->
            <el-table
              :data="manyTableData"
              border
              stripe
              style="width: 100%"
              row-key="id"
            >
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template
                  v-slot="{row}"
                  #default="props"
                >
                  <!-- 循环渲染tag标签 -->
                  <el-tag
                    v-for="(item,index) in row.attr_vals"
                    :key="index"
                    closable
                    @close="handleClose(index,row)"
                  >
                    {{ item }}
                  </el-tag>
                  <!-- 输入文本框 -->
                  <el-input
                    v-if="row.inputVisible"
                    ref="InputRef"
                    v-model="row.inputValue"
                    class="input_new_tag"
                    size="small"
                    @keyup.enter="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                  />
                  <!-- 按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(row)"
                  >
                    + New Tag
                  </el-button>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button
                    type="primary"
                    icon="Edit"
                    size="small"
                    @click="showEditDialog(row.attr_id)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="Delete"
                    size="small"
                    @click="removeParams(row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 添加静态属性面板 -->
          <el-tab-pane
            label="静态属性"
            name="only"
          >
            <!-- 添加静态参数按钮 -->
            <el-button
              type="primary"
              size="small"
              :disabled="isBtnDisabled"
              @click="addDialogVisible=true"
            >添加属性</el-button>
            <!-- 添加静态参数表格 -->
            <el-table
              :data="onlyTableData"
              border
              stripe
              row-key="id"
            >
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template
                  v-slot="{row}"
                  #default="props"
                >
                  <!-- 循环渲染tag标签 -->
                  <el-tag
                    v-for="(item,index) in row.attr_vals"
                    :key="index"
                    closable
                    @close="handleClose(index,row)"
                  >
                    {{ item }}
                  </el-tag>
                  <!-- 输入文本框 -->
                  <el-input
                    v-if="row.inputVisible"
                    ref="InputRef"
                    v-model="row.inputValue"
                    class="input_new_tag"
                    size="small"
                    @keyup.enter="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                  />
                  <!-- 按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(row)"
                  >
                    + New Tag
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                style="width:60px"
              ></el-table-column>
              <el-table-column
                label="属性名称"
                prop="attr_name"
                style="width:60px"
              ></el-table-column>
              <el-table-column
                label="操作"
                style="width:60px"
              >
                <template v-slot="{row}">
                  <el-button
                    type="primary"
                    icon="Edit"
                    size="small"
                    @click="showEditDialog(row.attr_id)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="Delete"
                    size="small"
                    @click="removeParams(row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table></el-tab-pane>

        </el-tabs>
      </el-row>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="'添加' +titleText"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的文本框 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="addParams"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      v-model="EditDialogVisible"
      :title="'修改' +titleText"
      width="30%"
      @close="EditDialogClosed"
    >
      <!-- 修改的文本框 -->
      <el-form
        :model="EditForm"
        :rules="EditFormRules"
        ref="EditFormRef"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="EditForm.attr_name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="EditDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="editParams"
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
import { computed, nextTick, reactive, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { trim } from "lodash";
export default {
  setup() {
    const addFormRef = ref("");
    const EditFormRef = ref("");
    const InputRef = ref();
    const expandedRowKeys = ref("");
    const data = reactive({
      //级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        children: "children",
        label: "cat_name",
      },
      //级联选择框双向绑定
      selectCate: [],
      // 激活的页签
      activeName: "many",
      //动态表格数据
      manyTableData: [],
      //静态表格数据
      onlyTableData: [],
      //控制添加对话框的显示与隐藏
      addDialogVisible: false,
      EditDialogVisible: false,
      //表单校验
      addForm: {
        attr_name: "",
      },
      //添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      //修改表单的数据对象
      EditForm: {},
      //修改表单的验证规则对象
      EditFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
    });
    const store = useStore();
    //获取所有商品的分类列表
    const getCateList = async () => {
      const { data: result } = await axios.get("categories");
      // console.log(result);
      if (result.meta.status !== 200)
        return ElMessage.error("获取商品分类失败");
      ElMessage({
        type: "success",
        message: "获取商品分类成功",
      });
      store.commit("UpdataCateList", result.data);
      // console.log(store.state.cateList);
    };
    getCateList();
    // 级联选择框变化后
    const selectedChange = () => {
      getParamsData();
    };
    //获取参数的列表数据
    const getParamsData = async () => {
      const { data: result } = await axios.get(
        `categories/${cateId.value}/attributes`,
        {
          params: {
            sel: data.activeName,
          },
        }
      );
      if (result.meta.status !== 200)
        return ElMessage.error("获取商品分类失败");
      ElMessage({
        type: "success",
        message: "获取商品分类成功",
      });
      //console.log(result.data);
      result.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        //控制文本框的显示与隐藏
        item.inputVisible = false;
        //文本框中输入的值
        item.inputValue = "";
      });
      //console.log(result.data);
      if (data.activeName === "many") {
        data.manyTableData = result.data;
      } else {
        data.onlyTableData = result.data;
      }
    };
    //tab页签点击事件的处理函数
    const handleTabClick = () => {
      //console.log(data.activeName);
      getParamsData();
    };
    //计算属性
    //如果按钮需要被禁用则返回true
    const isBtnDisabled = computed(() => {
      if (data.selectCate.length !== 3) {
        return true;
      }
      return false;
    });
    //当前选中的三级分类的id
    const cateId = computed(() => {
      if (data.selectCate.length === 3) {
        return data.selectCate[2];
      }
      return null;
    });
    //动态计算标题的文本
    const titleText = computed(() => {
      if (data.activeName === "many") {
        return "动态参数";
      }
      return "静态参数";
    });
    //监听添加对话框的关闭事件
    const addDialogClosed = () => {
      //重置
      addFormRef.value.resetFields();
    };
    //添加参数
    const addParams = () => {
      addFormRef.value.validate(async (valid) => {
        if (!valid) return;
        const { data: result } = await axios.post(
          `categories/${cateId.value}/attributes`,
          {
            attr_name: data.addForm.attr_name,
            attr_sel: data.activeName,
          }
        );
        //console.log(result);
        if (result.meta.status !== 201) return ElMessage.error("添加参数失败");
        ElMessage({
          type: "success",
          message: "添加参数成功",
        });
        //console.log(result.data);
        data.addDialogVisible = false;
        getParamsData();
      });
    };
    //修改参数的对话框
    const showEditDialog = async (attr_id) => {
      //查询当前参数的信息
      const { data: result } = await axios.get(
        `categories/${cateId.value}/attributes/${attr_id}`,
        {
          params: { attr_sel: data.activeName },
        }
      );
      if (result.meta.status !== 200) return ElMessage.error("添加参数失败");
      ElMessage({
        type: "success",
        message: "添加参数成功",
      });
      console.log(result.data);
      data.EditForm = result.data;
      data.EditDialogVisible = true;
    };
    //重置修改的表单
    const EditDialogClosed = () => {
      EditFormRef.value.resetFields();
    };
    //修改对话框的确定按钮
    const editParams = () => {
      EditFormRef.value.validate(async (valid) => {
        if (!valid) return;
        const { data: result } = await axios.put(
          `categories/${cateId.value}/attributes/${data.EditForm.attr_id}`,
          {
            attr_name: data.EditForm.attr_name,
            attr_sel: data.activeName,
          }
        );
        //console.log(result);
        if (result.meta.status !== 200) return ElMessage.error("修改参数失败");
        ElMessage({
          type: "success",
          message: "修改参数成功",
        });
        getParamsData();
        data.EditDialogVisible = false;
      });
    };
    //根据id删除
    const removeParams = (attr_id) => {
      //弹框提示是否删除
      ElMessageBox.confirm("此操作将永久删除该权限，是否继续？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: result } = await axios.delete(
            `categories/${cateId.value}/attributes/${attr_id}`
          );
          //console.log(result);
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
            //data.EditForm = result.data;
            getParamsData();
          }
          //console.log("1111");
        })
        //取消删除
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消操作",
          });
          //console.log("22222");
        });
    };
    //文本框失去焦点
    const handleInputConfirm = async (row) => {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //如果没有return,则证明输入的内容需要做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      saveAttrVals(row);
    };
    //点击按钮展示
    const showInput = (row) => {
      row.inputVisible = true;
      nextTick(() => {
        InputRef.value.input.focus();
      });
    };
    //发起请求(避免重复)
    const saveAttrVals = async (row) => {
      //发起请求保存到aixos中
      const { data: result } = await axios.put(
        `categories/${cateId.value}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        }
      );
      //console.log(result);
      if (result.meta.status !== 200) return ElMessage.error("更新失败");
      ElMessage({
        type: "success",
        message: "更新成功",
      });
    };
    //关闭tag
    const handleClose = (index, row) => {
      row.attr_vals.splice(index, 1);
      saveAttrVals(row);
    };
    return {
      ...toRefs(data),
      store,
      getCateList,
      selectedChange,
      handleTabClick,
      isBtnDisabled,
      cateId,
      getParamsData,
      titleText,
      addDialogClosed,
      addFormRef,
      addParams,
      showEditDialog,
      EditDialogClosed,
      EditFormRef,
      editParams,
      removeParams,
      handleInputConfirm,
      showInput,
      InputRef,
      handleClose,
      saveAttrVals,
    };
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tabs {
  width: 100%;
}
.el-button {
  margin-bottom: 10px;
}
.el-tag {
  margin: 10px;
}
.input_new_tag {
  width: 100px;
  margin: 10px;
}
.button-new-tag {
  margin: 10px;
}
</style>