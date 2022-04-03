<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="25">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
              clearable
              @clear="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>

            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
              :open-delay="500"
              :hide-after="3000"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框dialog -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="40%"
      @close="addUserDialogClosed"
    >
      <!-- 添加的dialog内容主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加的dialog底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框dialog -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialogVisible"
      width="40%"
      @close="editUserDialogClosed"
    >
      <!-- 修改的dialog内容主体区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 修改的dialog底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="40%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      //获取用户列表参数
      queryInfo: {
        query: "",
        //当前页码
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 5,
      },
      //需要被分配角色的用户信息
      userInfo: {},
      //用户列表
      userList: [],
      //所有角色的数据列表
      rolesList: [],
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //查询用户的信息
      editForm: {},
      //添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "用户名在3-6个字符之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 13, message: "密码在6-13个字符之间", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern:
              /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "邮箱格式不符合",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            message: "手机号码格式不符合",
            trigger: "blur",
          },
        ],
      },

      //编辑时dialog对话框校验规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern:
              /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "邮箱格式不符合",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            message: "手机号码格式不符合",
            trigger: "blur",
          },
        ],
      },
      total: 0,
      //被下拉框选中的角色id
      selectedRoleId: '',
      //控制添加用户的dialog对话框状态
      addUserDialogVisible: false,
      //控制修改用户的dialog对话框状态
      editUserDialogVisible: false,
      //控制分配角色的dialog对话框状态
      setRoleDialogVisible: false,
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },

    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      const temporaryTotal = this.queryInfo.pagesize * this.queryInfo.pagenum
      this.queryInfo.pagesize = newSize;
      //切换分页大小时不将pagenum改为1将会导致切换完后显示为空
      this.queryInfo.pagenum = (temporaryTotal/this.queryInfo.pagesize) + 1;
      this.getUserList();
    },

    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    //监听Swich开关状态的改变
    async userStateChanged(userqueryInfo) {
      const { data: res } = await this.$http.put(
        `users/${userqueryInfo.id}/state/${userqueryInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userqueryInfo.mg_state = !userqueryInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },

    //监听添加用户对话框dialog的关闭事件
    addUserDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    //点击按钮添加用户预校验方法
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        //验证失败实际返回
        if (!valid) return;
        //验证通过发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        } else {
          //显示成功消息
          this.$message.success("添加用户成功");
          //重新渲染用户列表
          this.getUserList();
          //将dialog对话框关闭
          this.addUserDialogVisible = false;
        }
      });
    },

    //展示修改用户的dialog对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editForm = res.data;
      this.editUserDialogVisible = true;
    },

    //监听修改用户对话框dialog的关闭事件
    editUserDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    //点击修改按钮修改用户信息预校验方法
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        //验证通过发起修改用户信息的网络请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        } else {
          //关闭对话框
          this.editUserDialogVisible = false;
          //刷新数据列表
          this.getUserList();
          //提示修改成功
          this.$message.success("更新用户信息成功");
        }
      });
    },

    //根据id删除用户信息的方法
    async removeUserById(id) {
      //弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果用户点击确认，返回值为字符串‘confirm’
      //如果用户点击取消，返回值为字符串‘cancel’
      if (confirmResult !== "confirm") {
        return this.$message("已经取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户信息失败");
      }
      this.$message.success("删除用户信息成功");
      this.getUserList();
    },

    //展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      //获取所有的角色列表给用户选择
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    //点击确定按钮分配角色
    async saveRoleInfo(){
        if(!this.selectedRoleId){
            return this.$message.error('请选择要分配的角色')
        }
        const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {
            rid: this.selectedRoleId
        })
        if(res.meta.status !== 200){
            return this.$message.error('更新用户角色信息失败')
        }

        this.$message.success('更新用户角色信息成功')
        this.getUserList()
        this.setRoleDialogVisible = false
    },

    //监听分配角色Dialog对话框关闭时的事件
    setRoleDialogClosed(){
        this.selectedRoleId = ''
        this.userInfo = {}
    }
  },
  created() {
    this.getUserList();
  },
};
</script>

<style scoped lang="less">
</style>