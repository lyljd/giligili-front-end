<template>
  <div>
    <h1 style="text-align:center">注册</h1>
    <el-form ref="form" :model="form" label-width="80px" status-icon :rules="rules" hide-required-asterisk>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password_confirm">
        <el-input type="password" v-model="form.password_confirm" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button id="button" type="primary" @click="register()">注册</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button @click="toLoginPage()">去登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import * as API from '@/api/user'
import * as Common from '@/common'

export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.password_confirm !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePasswordConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback();
      }
    };
    return {
      form: {
        nickname: '',
        username: '',
        password: '',
        password_confirm: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' },
          { min: 8, max: 40, message: '长度在 8 到 40 个字符', trigger: 'blur' }
        ],
        password_confirm: [
          { validator: validatePasswordConfirm, trigger: 'blur' },
          { min: 8, max: 40, message: '长度在 8 到 40 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    register() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$notify.error({
            title: '注册失败',
            message: '填入信息有误',
            showClose: false
          });
        } else {
          let button = document.getElementById("button")
          button.disabled = true
          let preInner = button.innerHTML
          button.innerHTML = "注册中..."
          API.register(this.form).then((res) => {
            if (res.code === 0) {
              let msg = `您的用户id为${res.data.id}`
              if (Common.checkToken()) {
                this.$router.push('/me')
                msg += "；你已登陆，若想登陆新账号请先登出"
              } else {
                this.$router.push('/login')
              }
              this.$notify({
                title: '注册成功',
                message: msg,
                type: 'success',
                showClose: false
              });
            } else {
              this.$notify.error({
                title: '注册失败',
                message: res.msg,
                showClose: false
              });
              button.disabled = false
              button.innerHTML = preInner
            }
          }).catch((error) => {
            this.$notify.error({
              title: '注册失败',
              message: error,
              showClose: false
            });
            button.disabled = false
            button.innerHTML = preInner
          });
        }
      });
    },
    resetForm() {
      this.$refs['form'].resetFields();
    },
    toLoginPage() {
      this.$router.push('/login')
    },
  }
}
</script>
  