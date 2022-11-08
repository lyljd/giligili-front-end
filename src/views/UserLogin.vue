<template>
    <div>
        <h1 style="text-align:center">登陆</h1>
        <el-form ref="form" :model="form" label-width="80px" status-icon :rules="rules" hide-required-asterisk>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password" autocomplete="off" @keyup.enter.native="login">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button id="button" type="primary" @click="login">登陆</el-button>
                <el-button @click="toRegisterPage">去注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
import * as Common from '@/common'
import * as API from '@/api/user'

export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 8, max: 40, message: '长度在 8 到 40 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        login() {
            let button = document.getElementById("button")
            if (button.disabled === true) {
                return
            }
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    this.$notify.error({
                        title: '登陆失败',
                        message: '填入信息有误',
                        showClose: false
                    });
                } else {
                    button.disabled = true
                    let preInner = button.innerHTML
                    button.innerHTML = "登陆中..."
                    API.login(this.form).then((res) => {
                        if (res.code === 0) {
                            let ip_location = res.data.ip_location
                            let msg = `上次登陆IP属地：${ip_location}`
                            if (ip_location === '') {
                                msg = "这是您账户的第一次登陆"
                            }
                            localStorage.setItem("token", res.data.token);
                            localStorage.setItem("refresh_token", res.data.refresh_token);
                            localStorage.setItem("uid", res.data.id)
                            this.$notify({
                                title: '登陆成功',
                                message: msg,
                                type: 'success',
                                showClose: false
                            });
                            this.$router.push('/')
                        } else {
                            this.$notify.error({
                                title: '登陆失败',
                                message: res.msg,
                                showClose: false
                            });
                            button.disabled = false
                            button.innerHTML = preInner
                        }
                    }).catch((error) => {
                        this.$notify.error({
                            title: '登陆失败',
                            message: error,
                            showClose: false
                        });
                        button.disabled = false
                        button.innerHTML = preInner
                    });
                }
            });
        },
        toRegisterPage() {
            this.$router.push('/register')
        },
    },
    beforeMount() {
        if (Common.checkToken()) {
            this.$router.push('/me')
            this.$notify.error({
                title: "拒绝访问",
                message: "你已登录",
                showClose: false
            })
        }
    }
}
</script>
  