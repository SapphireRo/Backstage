<template>
  <div>
    <el-card>
      <el-row>
        <!-- 按钮 -->
        <el-col class="button">
          <el-button
            type="primary"
            @click="addCate(true)"
          >添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类 -->
      <el-table
        :data="store.state.cateList"
        style="width: 100%"
        row-key="cat_id"
        border
        stripe
      >
        <el-table-column type="selection" />
        <el-table-column
          prop="cat_name"
          label="分类名称"
        />
        <el-table-column
          prop="cat_deleted"
          label="是否有效"
          width="150px"
        >
          <template v-slot="{row}">
            <div
              v-if="row.cat_deleted==true"
              style="color:lightgreen"
            >
              <el-icon>
                <CircleCheckFilled />
              </el-icon>
            </div>
            <div
              v-else
              style="color:brown"
            >
              <el-icon>
                <CircleCloseFilled />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="cat_level"
          label="排序"
        >
          <template v-slot="{row}">
            <div>
              <el-tag v-if="row.cat_level==0">一级</el-tag>
              <el-tag
                v-else-if="row.cat_level==1"
                type="success"
              >二级</el-tag>
              <el-tag
                v-else
                type="warning"
              >三级</el-tag>
            </div>
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
              content="编辑"
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
              content="删除"
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
          </template>

        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        class="pagination"
        v-model:current-page="queryInfo.num"
        v-model:page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 5, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="store.state.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加分类 -->
    <AddDialog @getCateList="getCateList"></AddDialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import AddDialog from "../../components/Goods/Dialog/addDialog.vue";
export default {
  components: { AddDialog },
  setup() {
    const store = useStore();
    const data = reactive({
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
    });
    const defaultProps = {
      children: "children",
      label: "cat_name",
    };
    //获取商品分类
    const getCateList = async () => {
      const { data: result } = await axios.get("categories", {
        params: data.queryInfo,
      });
      console.log(result);
      if (result.meta.status !== 200)
        return ElMessage.error("获取商品分类失败");
      ElMessage({
        type: "success",
        message: "获取商品分类成功",
      });
      store.commit("UpdataCateList", result.data.result);
      store.commit("UpdataTotal", result.data.total);
    };
    getCateList();
    //分页
    const handleSizeChange = (newSize) => {
      data.queryInfo.pagesize = newSize;
      getCateList();
    };
    const handleCurrentChange = (newPage) => {
      data.queryInfo.pagenum = newPage;
      getCateList();
    };
    //添加分类对话框
    const addCate = (visible) => {
      store.commit("CateDialogVisible", visible);
    };
    return {
      store,
      ...toRefs(data),
      getCateList,
      defaultProps,
      handleSizeChange,
      handleCurrentChange,
      addCate,
    };
  },
};
</script>

<style lang="less" scoped>
.button {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 20px;
}
</style>