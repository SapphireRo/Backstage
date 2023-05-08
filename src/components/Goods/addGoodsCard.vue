<template>
  <div>
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="添加商品信息！"
        type="info"
        show-icon
        center
        :closable="false"
      />
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex -0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息" />
        <el-step title="商品参数" />
        <el-step title="商品属性" />
        <el-step title="商品图片" />
        <el-step title="商品内容" />
        <el-step title="完成" />
      </el-steps>

      <!-- tab栏 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormErules"
        label-width="120px"
        status-icon
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          class="demo-tabs"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-change="tabClicked"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品参数"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input
                v-model="addForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input
                v-model="addForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              />

            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 多选复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1,index) in item.attr_vals"
                  :key="index"
                  border
                />
              </el-checkbox-group></el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <!-- action图片上传到后台的api接口 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传jpn/png文件，且不超过500kb
                </div>
              </template>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <QuillEditor v-model="addForm.goods_introduce"></QuillEditor>
            <!-- 添加商品的按钮 -->
            <el-button
              type="primary"
              class="button"
              @click="addGoods"
            >添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- //图片预览 -->
    <el-dialog
      v-model="previewVisible"
      title="图片预览"
      width="50%"
    >
      <img
        :src="previewPath"
        alt=""
        class="previewImg"
      >
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import _ from "lodash";
import { useRouter } from "vue-router";
export default {
  components: {
    QuillEditor,
  },
  setup() {
    const addFormRef = ref("");
    const router = useRouter();
    const data = reactive({
      activeIndex: "0",
      //添加商品的表单数据项
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        //图片
        pics: [],
        //商品详情描述
        goods_introduce: "",
        attrs: [],
      },
      addFormErules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选中商品邓磊", trigger: "blur" },
        ],
      },
      //商品列表
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //动态参数列表
      manyTableData: [],
      //静态参数列表
      onlyTableData: [],
      //上传图片的接口地址
      uploadURL: "http://43.143.0.76:8889/api/private/v1/upload",
      //图片上传的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //预览图片
      previewPath: "",
      //预览图片对话框显示
      previewVisible: false,
    });
    //获取所有分类商品
    const getCateList = async () => {
      const { data: result } = await axios.get(`categories`);
      //console.log(result);
      if (result.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return ElMessage.error("更新商品列表失败");
      }
      data.catelist = result.data;
      //console.log(data.catelist);
    };
    getCateList();
    //级联选择器
    const handleChange = () => {
      //console.log(data.addForm.goods_cat);
      if (data.addForm.goods_cat.length !== 3) {
        data.addForm.goods_cat = [];
      }
    };
    //切换tabs
    const beforeTabLeave = (activeName, oldActiveName) => {
      if (oldActiveName === "0" && data.addForm.goods_cat.length !== 3) {
        ElMessage.error("请先选择商品分类!");
        return false;
      }
    };
    //切换tabs时触发的函数
    const tabClicked = async () => {
      console.log(data.activeIndex);
      //访问的是动态参数面板
      if (data.activeIndex === "1") {
        const { data: result } = await axios.get(
          `categories/${data.addForm.goods_cat[2]}/attributes`,
          { params: { sel: "many" } }
        );
        if (result.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return ElMessage.error("获取动态参数列表失败");
        }
        //console.log(result.data);
        result.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        data.manyTableData = result.data;
        //console.log(result.data.attr_vals);
      } else if (data.activeIndex === "2") {
        const { data: result } = await axios.get(
          `categories/${data.addForm.goods_cat[2]}/attributes`,
          { params: { sel: "only" } }
        );
        if (result.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return ElMessage.error("获取静态参数列表失败");
        }
        console.log(result.data);
        // result.data.forEach((item) => {
        //   item.attr_vals =
        //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        // });
        data.onlyTableData = result.data;
        //console.log(result.data.attr_vals);
      }
    };
    //处理图片预览效果
    const handlePreview = (file) => {
      data.previewPath = file.response.data.url;
      data.previewVisible = true;
    };
    //处理移除图片的操作
    const handleRemove = (file) => {
      //1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      //2.从pics数组中，找到这个图片对应的索引值
      const i = data.addForm.pics.findIndex((item) => {
        item.pic === filePath;
      });
      //3.调用数组的splice方法，把图片信息对象从pcis数组中移除
      data.addForm.pics.splice(i, 1);
      console.log(data.addForm.pics);
    };
    //监听图片上传成功的事件
    const handleSuccess = (response) => {
      //1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //2.将图片信息对象push到pics数组中
      data.addForm.pics.push(picInfo);
      console.log(data.addForm.pics);
    };
    //添加商品
    const addGoods = () => {
      addFormRef.value.validate(async (valid) => {
        if (!valid) {
          return ElMessage.error("请填写必要的表单项！");
        }
        //执行添加的业务逻辑
        //lodash cloneDeep(obj) 深拷贝
        const form = _.cloneDeep(data.addForm);
        form.goods_cat = form.goods_cat.join(",");
        //处理动态参数
        data.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(" "),
          };
          data.addForm.attrs.push(newInfo);
        });
        //静态属性
        data.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals,
          };
          data.addForm.attrs.push(newInfo);
        });
        form.attrs = data.addForm.attrs;
        console.log(form);

        //发起请求(商品名称唯一)
        const { data: result } = await axios.post(`goods`, form);
        if (result.meta.status !== 201) {
          userinfo.mg_state = !userinfo.mg_state;
          return ElMessage.error("添加商品失败");
        }
        ElMessage({
          type: "success",
          message: "添加商品成功",
        });
        router.push("/goods");
      });
    };
    return {
      ...toRefs(data),
      addFormRef,
      getCateList,
      handleChange,
      beforeTabLeave,
      tabClicked,
      handlePreview,
      handleRemove,
      handleSuccess,
      addGoods,
      router,
    };
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
/deep/ .el-step__title {
  font-size: 13px;
}
/deep/ .el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}

/deep/ .ql-editor {
  min-height: 200px;
}
.button {
  margin-top: 10px;
}
</style>