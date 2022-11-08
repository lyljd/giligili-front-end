<template>
    <el-form ref="form" :model="user" label-width="80px" style="margin-top: 30px;">
        <el-form-item label="头像">
            <el-upload action="" :http-request="uploadAvatar" :before-upload="beforeUploadAvatar" :on-exceed="onExceed"
                :limit="1" accept=".jpg,.jpeg,.png" ref="avatar">
                <el-avatar :src=user.avatar>
                    <el-avatar icon="el-icon-user-solid"></el-avatar>
                </el-avatar>
            </el-upload>
        </el-form-item>
        <el-form-item label="用户ID">
            <el-input v-model="user.id" readonly class="inpWid"></el-input>
        </el-form-item>
        <el-form-item label="注册日期">
            <el-input v-model="user.created_at" readonly class="inpWid"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
            <el-input v-model="user.nickname" readonly class="inpWid"></el-input>
            <el-button type="success" @click="updateNickname">修改</el-button>
        </el-form-item>
        <el-form-item label="签名">
            <el-input v-model="user.signature" readonly class="inpWid"></el-input>
            <el-button type="success" @click="updateSignature">修改</el-button>
        </el-form-item>
        <el-form-item label="IP属地">
            <el-input v-model="user.ip_location" readonly class="inpWid"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="updatePassword">修改密码</el-button>
            <el-button type="danger" @click="logout">登出</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import * as API from '@/api/user';
import * as Common from '@/common';

export default {
    data() {
        return {
            user: {},
        }
    },
    methods: {
        load() {
            API.me().then((res) => {
                if (res.code === 0) {
                    this.user = res.data
                    this.user.created_at = new Date(this.user.created_at * 1000).toLocaleString()
                } else {
                    this.$notify.error({
                        title: "获取用户信息失败",
                        message: res.msg,
                        showClose: false
                    });
                }
            }).catch((error) => {
                this.$notify.error({
                    title: '获取用户信息失败',
                    message: error,
                    showClose: false
                });
            });
        },
        logout() {
            Common.clearAllTokenAndToLoginPage()
            this.$notify({
                title: '登出成功',
                type: 'success',
                showClose: false
            });
        },
        updateNickname() {
            this.$prompt('请输入新昵称', '修改昵称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                if (value.length < 2 || value.length > 30) {
                    this.$message.error('昵称的长度需在 2 到 30 个字符之间');
                } else if (value === this.user.nickname) {
                    this.$message.error('新昵称与原昵称相同');
                } else {
                    API.updateNickname({ "new_nickname": value }).then((res) => {
                        if (res.code === 0) {
                            this.user.nickname = res.data.nickname
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            });
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).catch((error) => {
                        this.$message.error(error);
                    });
                }
            }).catch(() => {
                return
            })
        },
        updateSignature() {
            this.$prompt('请输入新签名', '修改签名', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                if (value.length > 50) {
                    this.$message.error('签名的长度需小于 50 个字符');
                } else if (value === this.user.signature) {
                    this.$message.error('新签名与原签名相同');
                } else {
                    API.updateSignature({ "new_signature": value }).then((res) => {
                        if (res.code === 0) {
                            this.user.signature = res.data.signature
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            });
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).catch((error) => {
                        this.$message.error(error);
                    });
                }
            }).catch(() => {
                return
            })
        },
        updatePassword() {
            const h = this.$createElement;
            this.$msgbox({
                title: '修改密码',
                message: h('div', null, [
                    h('span', null, '请输入新密码'),
                    h('h1'),
                    h('input', {
                        attrs: {
                            class: 'el-input__inner',
                            id: 'password',
                            type: 'password',
                        },
                    }),
                    h('h1'),
                    h('span', null, '请输入新确认密码'),
                    h('h1'),
                    h('input', {
                        attrs: {
                            class: 'el-input__inner',
                            id: 'password_confirm',
                            type: 'password',
                        },
                    }),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action !== 'confirm') {
                        document.getElementById('password').value = ""
                        document.getElementById('password_confirm').value = ""
                    }
                    done();
                },
            }).then(() => {
                let pw = document.getElementById('password')
                let pwc = document.getElementById('password_confirm')
                if (pw.value.length < 8 || pw.value.length > 40 || pwc.value.length < 8 || pwc.value.length > 40) {
                    this.$message.error('密码的长度需在 8 到 40 个字符之间');
                } else if (pw.value !== pwc.value) {
                    this.$message.error('两次密码输入不一致');
                } else {
                    API.updatePassword({ 'new_password': pw.value, 'new_password_confirm': pwc.value }).then((res) => {
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            });
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).catch((error) => {
                        this.$message.error(error);
                    });
                }
                pw.value = ""
                pwc.value = ""
            }).catch(() => {
                return
            })
        },
        onExceed() {
            this.$message.warning("文件只能为1个")
        },
        uploadAvatar(option) {
            let form = new FormData()
            form.append("avatar", option.file)

            API.uploadAvatar(form).then((res) => {
                if (res.code === 0) {
                    this.user.avatar = res.data.avatar
                    this.$message({
                        type: 'success',
                        message: '上传成功'
                    });
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((error) => {
                this.$message.error(error);
            });

            this.$refs['avatar'].clearFiles()
        },
        beforeUploadAvatar(file) {
            if (file.size / 1024 / 1024 > 2) {
                this.$message.error('头像大小不能超过2MB');
                return false
            }
            return true
        },
    },
    beforeMount() {
        this.load()
    },
}
</script>

<style>
.inpWid {
    width: 80%;
}
</style>