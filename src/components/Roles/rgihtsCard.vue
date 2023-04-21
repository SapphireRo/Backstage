<template>
  <div>
    <el-card>
      <!-- 用户列表 -->
      <el-table
        :data="store.state.rightsList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          :prop=props.card.el_column1.prop
          :label=props.card.el_column1.label
        />
        <el-table-column
          :prop=props.card.el_column2.prop
          :label=props.card.el_column2.label
        />
        <el-table-column
          :prop=props.card.el_column3.prop
          :label=props.card.el_column3.label
        >
          <template v-slot="{row}">
            <el-tag v-if="row.level==='0'">一级</el-tag>
            <el-tag
              type="success"
              v-else-if="row.level==='1'"
            >二级</el-tag>
            <el-tag
              type="warning"
              v-else-if="row.level==='2'"
            >三级</el-tag>

          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  props: ["card"],
  setup(props) {
    const store = useStore();
    return {
      props,
      store,
    };
  },
};
</script>

<style>
</style>