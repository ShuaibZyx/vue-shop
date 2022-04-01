<template>
  <el-container class="home-container">
    <!-- 头部区域开始 -->
    <el-header>
      <div>
        <img src="../assets/dou.png" alt="网站头像" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 头部区域结束 -->

    <!-- 页面主体区开始 -->
    <el-container>
      <!-- 主体区侧边栏开始 -->
      <el-aside :width="collapseWith + 'px'">
        <Aside></Aside>
      </el-aside>
      <!-- 主体区侧边栏结束 -->

      <!-- 主体区右侧内容开始 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 主体区右侧内容结束 -->
    </el-container>
    <!-- 页面主体区结束 -->
  </el-container>
</template>

<script>
import Aside from "./Aside.vue";
export default {
  name: "Home",
  data() {
    return {
      collapseWith: 200,
    };
  },
  components: { Aside },
  methods: {
    loginOut() {
      window.sessionStorage.clear(), this.$router.push("/login");
    },
  },

  mounted() {
    this.$bus.$on("collapseChange", (isCollapse) => {
      if (isCollapse) {
        this.collapseWith = 64;
      } else {
        this.collapseWith = 200;
      }
    });
  },

  beforeDestroy() {
    this.$bus.$off("collapseChange");
  },
};
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}

.el-header {
  background-color: #d2568c;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 8%;
      height: 20%;
    }
  }
}

.el-aside {
  background-color: #d2568c;
}

.el-main {
  background-color: #d1c2d3;
}
</style>