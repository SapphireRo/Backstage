import { createStore } from "vuex";

export default createStore({
  state: {
    //用户列表
    userList: [],
    //角色列表
    rightsList: [],
    //权限列表
    rolesList: [],
    //添加用户的表单数据
    addForm: {
      username: "",
      password: "",
      email: "",
      mobile: "",
    },
    //总数
    total: 0,
    //获取用户列表的参数对象
    queryInfo: {
      query: "",
      //当前页数
      pagenum: 1,
      pagesize: 2,
    },
    //添加用户对话框
    IsAddDialogVisible: false,
    //修改用户对话框
    IsEditDialogVisible: false,
    //分配权限对话框
    IsPowerDialogVisible: false,
    //查询到的用户信息对象
    editForm: {},
  },
  getters: {},
  mutations: {
    //用户列表更新
    UpdataUserList: function (state, value) {
      state.userList = value;
    },
    //角色列表更新
    UpdataRightsList: function (state, value) {
      state.rightsList = value;
    },
    //权限列表更新
    UpdataRolesList: function (state, value) {
      state.rolesList = value;
    },
    //分页总数的改变
    UpdataTotal: function (state, value) {
      state.total = value;
    },
    //编辑框的改变
    updataEditForm: function (state, value) {
      state.editForm = value;
    },
    //pagesize改变的事件
    HandleSizeChange: function (state, value) {
      state.queryInfo.pagesize = value;
    },
    //页码改变的事件
    HandleCurrentChange: function (state, value) {
      state.queryInfo.pagenum = value;
    }, //修改用户
    EditForm: function (state, value) {
      state.editForm = value;
    },
    //展示添加用户对话框
    AddDialogVisible: function (state, value) {
      state.IsAddDialogVisible = value;
    },
    //展示修改用户对话框
    EditDialogVisible: function (state, value) {
      state.IsEditDialogVisible = value;
    },
    //分配权限对话框
    PowerDialogVisible: function (state, value) {
      state.IsPowerDialogVisible = value;
    },
  },
  actions: {},
  modules: {},
});
