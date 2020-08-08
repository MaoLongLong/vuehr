<template>
  <div id="home" style="height: 100%">
    <el-container style="height: 100%">
      <el-header class="header">
        <h1 class="title">微人事</h1>
        <el-dropdown class="user-info" @command="commandHandler">
          <span class="el-dropdown-link">
            {{ user.name }}<img :src="user.avatar" alt="avatar"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside class="aside" width="200px">
          <el-menu router :default-active="$route.path" unique-opened>
            <el-menu-item index="/home">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu v-for="(route, i) in routes"
                        :key="i" :index="(i).toString()">
              <template slot="title">
                <i :class="route.iconCls"></i>
                <span>{{ route.name }}</span>
              </template>
              <el-menu-item v-for="(child, j) in route.children" :key="j" :index="child.path">
                {{ child.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <el-breadcrumb separator="/" v-if="$route.path !== '/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(r, i) in $route.matched" :key="i">
              {{ r.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <div v-else>
            <h1>Hello World</h1>
          </div>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { clearLocalStorage, getUser } from '../utils/localStore';

export default {
  name: 'Home',
  data() {
    return {
      user: getUser(),
    };
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
  },
  methods: {
    commandHandler(cmd) {
      console.log(cmd);
      this.$confirm('此操作将注销登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http.post('/logout');
          clearLocalStorage();
          this.$store.commit('initRoutes', []);
          this.$router.replace('/');
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
  .header {
    background-color: #409EFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;

    .title {
      color: #ffffff;
      font-size: 20px;
    }

    .user-info {
      cursor: pointer;

      .el-dropdown-link {
        display: flex;
        align-items: center;
        font-weight: bold;
        color: #ffffff;

        img {
          border-radius: 50%;
          margin-left: 8px;
          width: 48px;
          height: 48px;
        }
      }
    }
  }

  .aside {
    border-right: solid 1px #e6e6e6;
    border-right-color: rgb(230, 230, 230);
    overflow: hidden;

    .el-menu {
      border-right: none;
    }
  }
</style>
