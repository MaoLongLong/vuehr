<template>
  <div id="login">
    <el-card class="login-card">
      <h2 class="login-form-title">登录</h2>
      <el-form :model="loginForm" ref="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user" ref="usernameInput"
                    placeholder="请输入用户名" @keyup.enter.native="$refs.passwordInput.focus()"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" show-password
                    placeholder="请输入密码" ref="passwordInput" @keyup.enter.native="submitLoginForm"/>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="loginBtnDisabled" type="primary"
                     class="login-btn" @click="submitLoginForm">登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { setUser } from '../utils/localStore';

export default {
  name: 'Login',
  data() {
    return {
      loginBtnDisabled: false,
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    submitLoginForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loginBtnDisabled = true;
          this.$http.post('/login', this.loginForm)
            .then((value) => {
              if (value) {
                setUser(value.obj);
                if (this.$route.query.to) {
                  this.$router.replace(this.$route.query.to);
                } else {
                  this.$router.replace('/home');
                }
              }
            })
            .finally(() => {
              this.loginBtnDisabled = false;
            });
          return true;
        }
        this.$message.error('请输入用户名和密码');
        return false;
      });
    },
  },
  mounted() {
    this.$refs.usernameInput.focus();
  },
};
</script>

<style lang="scss" scoped>
  .login-card {
    width: 450px;
    margin: 200px auto 0;

    .login-form-title {
      text-align: center;
      margin-bottom: 20px;
    }

    .login-btn {
      width: 100%;
    }
  }
</style>
