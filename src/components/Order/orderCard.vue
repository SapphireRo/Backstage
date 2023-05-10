<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-input
          v-model="queryInfo.query"
          placeholder="请输入内容"
        >
          <template #append>
            <el-button icon="Search" />
          </template>
        </el-input>
      </el-row>

      <el-table
        :data="orderList"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
        ></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="是否付款"
          prop="pay_status"
        >
          <template v-slot="{row}">
            <div>
              <el-tag
                type="success"
                v-if="row.pay_status==='1'"
              >
                已付款
              </el-tag>
              <el-tag
                type="danger"
                v-else
              >
                未付款
              </el-tag>
            </div>
          </template></el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
        >
          <template v-slot="{ row }">
            {{days(parseInt(row.create_time)*1000).format("YYYY-MM-DD HH:mm:ss")}}
          </template></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
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
                @click="showBox"
              />
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="物流进度"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="Location"
                size="small"
                @click="showProgressBox"
              />
            </el-tooltip>

          </template>

        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        v-model:current-page="queryInfo.pagenum"
        v-model:page-size="queryInfo.pagesize"
        :page-sizes="[5,10,15,20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 展示修改地址的对话框 -->
      <el-dialog
        v-model="addressVisible"
        title="修改地址"
        width="50%"
        @close="addressDialogClose"
      >
        <!-- 添加参数的文本框 -->
        <el-form
          :model="addressForm"
          :rules="addressRules"
          ref="addressRef"
        >
          <el-form-item
            label="省市区/县"
            prop="address1"
          >
            <el-cascader
              :options="cityData"
              v-model="addressForm.address1"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="详细地址"
            prop="address2"
          >
            <el-input v-model="addressForm.address2" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addressVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="addressVisible=false"
            >
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 展示物流进度的对话框 -->
      <el-dialog
        v-model="progressVisible"
        title="物流进度"
        width="50%"
      >
        <template
          v-for="(item,index) in addressProgress"
          :key="index"
        >
          <el-timeline>
            <el-timeline-item
              :timestamp="item.time"
              placement="top"
            >
              <el-card>
                <h4>{{item.context}}</h4>
                <p>{{item.ftime}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </template>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="progressVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="progressVisible=false"
            >
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
import cityData from "./citydata.js";
import { reactive, ref, toRefs } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { forEach } from "lodash";
export default {
  setup() {
    //时间戳转换
    const days = require("dayjs");
    const addressRef = ref("");
    const data = reactive({
      //商品信息
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表
      orderList: [],
      //商品总数
      total: 0,
      //隐藏对话框
      addressVisible: false,
      progressVisible: false,
      //表单
      addressForm: {
        address1: [],
        address2: "",
      },
      addressRules: {
        address1: [
          {
            required: true,
            message: "请选择省市区",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请选择详细地址",
            trigger: "blur",
          },
        ],
      },
      //地址选择
      cityData,
      //物流信息
      addressProgress: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
    });
    const getOrderList = async () => {
      const { data: result } = await axios.get(`orders`, {
        params: data.queryInfo,
      });
      console.log(result);
      if (result.meta.status !== 200) {
        return ElMessage.error("更新商品列表失败");
      }

      data.orderList = result.data.goods;
      data.total = result.data.total;
      console.log(data.orderList);
    };
    getOrderList();
    const handleSizeChange = (newSize) => {
      data.queryInfo.pagesize = newSize;
      getOrderList();
    };
    const handleCurrentChange = (newPage) => {
      data.queryInfo.pagenum = newPage;
      getOrderList();
    };
    const showBox = () => {
      data.addressVisible = true;
    };
    // 关闭时重置对话框
    const addressDialogClose = () => {
      addressRef.value.resetFields();
    };
    //物流地址对话框
    const showProgressBox = () => {
      data.progressVisible = true;
    };

    //关闭         @close="progressDialogClose"
    return {
      ...toRefs(data),
      days,
      addressRef,
      getOrderList,
      handleSizeChange,
      handleCurrentChange,
      showBox,
      addressDialogClose,
      showProgressBox,
    };
  },
};
</script>

<style lang="less" scoped>
.el-input {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
/deep/ .el-cascader {
  width: 100% !important;
}
</style>