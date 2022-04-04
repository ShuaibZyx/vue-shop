<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="图标" />
      </div>

      <!-- 登录表单区域开始 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="60px"
        class="login_form"
      >

        <!-- 用户名 -->
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            prefix-icon="el-icon-s-custom"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-lock"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 登录表单区域结束 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      //登录表单的数据绑定对象
      loginForm: {
        username: "",
        password: "",
      },
      //表单验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 13,
            message: "长度在 6 到 13 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //点击重置按钮触发此函数，重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        this.$message.success("登录成功");
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #ef3473;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 20%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 20%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0px 30px;
  box-sizing: border-box;
}
</style>