<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <!-- 搜索与添加区域 -->
        <el-col :span="8">

          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodList"
          >
            <template #append>
              <el-button
                icon="Search"
                @click="getGoodList"
              />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="goAddPage"
          > 添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table
        :data="goodlist"
        border
        stripe
      >
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
        >
        </el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        >
        </el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="add_time"
          width="180px"
        >
          <template v-slot="{ row }">
            {{days(parseInt(row.add_time)*1000).format("YYYY-MM-DD HH:mm:ss")}}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          width="130px"
        >
          <template v-slot="{row}">
            <!-- 编辑按钮 -->
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="Edit"
                size="small"
              />
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click="removeById(row.goods_id)"
              />
            </el-tooltip>

          </template>

        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[5, 10,15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
      />
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import { reactive, toRefs } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const data = reactive({
      //查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表
      goodlist: [],
      total: 0,
    });
    const getGoodList = async () => {
      const { data: result } = await axios.get(`goods`, {
        params: data.queryInfo,
      });
      //console.log(result);
      if (result.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return ElMessage.error("更新商品列表失败");
      }

      data.goodlist = result.data.goods;
      data.total = result.data.total;
    };
    getGoodList();
    //时间戳转换
    const days = require("dayjs");
    //分页
    const handleSizeChange = (newSize) => {
      data.queryInfo.pagesize = newSize;
      getGoodList();
    };
    const handleCurrentChange = (newPage) => {
      data.queryInfo.pagenum = newPage;
      getGoodList();
    };
    //删除操作
    const removeById = (id) => {
      //弹框提示是否删除
      ElMessageBox.confirm("此操作将永久删除该权限，是否继续？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: result } = await axios.delete(`goods/${id}`);
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
            getGoodList();
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
    const goAddPage = () => {
      router.push("/goods/add");
    };
    return {
      ...toRefs(data),
      router,
      getGoodList,
      days,
      handleSizeChange,
      handleCurrentChange,
      removeById,
      goAddPage,
    };
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 10px;
}
.el-pagination {
  margin-top: 10px;
}
</style>