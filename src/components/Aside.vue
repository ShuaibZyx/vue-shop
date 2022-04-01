<template>
  <div>
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!-- 侧边栏菜单 -->
    <el-menu
      background-color="#e16c96"
      text-color="#132c33"
      active-text-color="#c7d2d4"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath"
    >
      <!-- 一级菜单 -->
      <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
        <!-- 一级菜单模板区域开始 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconObj[menu.id]"></i>
          <!-- 文本 -->
          <span>{{ menu.authName }}</span>
        </template>
        <!-- 一级菜单模板区域结束 -->

        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/' + subMenu.path"
          v-for="subMenu in menu.children"
          :key="subMenu.id"
          @click="saveNavState('/' + subMenu.path)"
        >
          <!-- 二级菜单模板区域开始 -->
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{ subMenu.authName }}</span>
          </template>
          <!-- 二级菜单模板区域结束 -->
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      menuList: [],
      iconObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-opportunity",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-data",
      },
      //用于判断是否折叠
      isCollapse: false,

      //被激活的链接地址
      activePath: "",
    };
  },
  methods: {
    //获取所有菜单项
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    //点击按钮切换菜单的折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$bus.$emit("collapseChange", this.isCollapse);
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
};
</script>

<style lang="less" scoped>
//使得图标与字体有间距
.iconfont {
  margin-right: 10px;
}

//去除el-menu的border-right
.el-menu {
  border-right: none;
}

//折叠按钮样式
.toggle-button {
  background-color: #e16c96;
  font-size: 10px;
  line-height: 24px;
  color: #132c33;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #d2568c;
}
</style>