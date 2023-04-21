<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-button
            type="primary"
            class="button"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table
        :data="store.state.rolesList"
        style="width: 100%"
        border
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="{row}">
            <el-row
              v-for="(item1, i1) in row.children"
              :key="item1.id"
              :class="['bdbottom',i1===0 ? 'bdtop' : '','vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightByid(row,item1.id)">{{ item1.authName }}</el-tag>
                <el-icon>
                  <CaretRight />
                </el-icon>
              </el-col>
              <!-- 渲染二、三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染而二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0 ? '' : 'bdtop','vcenter']"
                >
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="removeRightByid(row,item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <el-icon>
                      <CaretRight />
                    </el-icon>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightByid(row,item3.id)"
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>

            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          :prop=props.card.el_column1.prop
          :label=props.card.el_column1.label
          width="150px"
        />
        <el-table-column
          :prop=props.card.el_column2.prop
          :label=props.card.el_column2.label
        />
        <el-table-column
          :prop=props.card.el_column3.prop
          :label=props.card.el_column3.label
          width="300px"
        >
          <template
            v-slot="{row}"
            class="button"
          >
            <el-button
              type="primary"
              size="small"
              icon="EditPen"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              icon="Delete"
            >删除</el-button>
            <el-button
              type="warning"
              size="small"
              icon="UserFilled"
              @click="showSetRightDialog(row)"
            >分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      v-model="setRightDialogVisible"
      title="分配权限"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="treeRolesList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="allotRights"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { reactive, toRefs, ref } from "vue";
export default {
  props: ["card", "getRolesList"],
  setup(props, content) {
    const store = useStore();
    const treeRef = ref();
    const data = reactive({
      setRightDialogVisible: false,
      treeRolesList: [],
      //树形控件数据的绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中的节点id值数组
      defKeys: [],
      //选中用户的id
      roleId: [],
    });
    //根据id删除具体权限;
    const removeRightByid = (role, rightId) => {
      //弹框提示是否删除
      ElMessageBox.confirm("此操作将永久删除该权限，是否继续？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: result } = await axios.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          //console.log(result);
          if (result.meta.status !== 200) {
            ElMessage({
              type: "info",
              message: "取消权限失败",
            });
          } else {
            ElMessage({
              type: "success",
              message: "取消权限成功",
            });
            role.children == result.data;
            content.emit("getRolesList");
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
    //展示分配权限的对话框
    const showSetRightDialog = async (role) => {
      //获取所有权限的数据
      const { data: result } = await axios.get("rights/tree");

      if (result.meta.status !== 200) return ElMessage.error("获取权限失败");
      ElMessage({
        message: "获取权限成功！",
        type: "success",
      });

      data.treeRolesList = result.data;
      data.roleId = role.id;
      //console.log(data.treeRolesList);
      //递归获取三级节点
      getLeafKeys(role, data.defKeys);
      //console.log(data.defKeys);
      data.setRightDialogVisible = true;
    };
    //递归函数
    const getLeafKeys = (node, arr) => {
      //如果当前node节点不包含children，则说明是三级
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => getLeafKeys(item, arr));
    };
    //监听分配权限对话框的关闭事件
    const setRightDialogClosed = () => {
      data.defKeys = [];
    };
    //点击为角色分配权限
    const allotRights = async () => {
      //获取所有全选和半选的id
      const keys = [
        treeRef.value.getCheckedKeys(),
        treeRef.value.getHalfCheckedKeys(),
      ];

      //拼接字符串
      const idStr = keys.join(",");
      const { data: result } = await axios.post(`roles/${data.roleId}/rights`, {
        rids: idStr,
      });
      if (result.meta.status !== 200) return ElMessage.error("分配权限失败！");
      ElMessage({
        message: "分配权限成功！",
        type: "success",
      });
      content.emit("getRolesList");
      data.setRightDialogVisible = false;
    };
    return {
      ...toRefs(data),
      props,
      store,
      treeRef,
      removeRightByid,
      showSetRightDialog,
      getLeafKeys,
      setRightDialogClosed,
      allotRights,
    };
  },
};
</script>

<style lang="less" scoped>
.button {
  margin-bottom: 10px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>