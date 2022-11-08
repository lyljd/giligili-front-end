<template>
    <el-form ref="form" :model="user" label-width="80px" style="margin-top: 30px;">
        <el-form-item label="头像">
            <el-avatar :src=user.avatar>
                <el-avatar icon="el-icon-user-solid"></el-avatar>
            </el-avatar>
        </el-form-item>
        <el-form-item label="用户ID">
            <el-input v-model="user.id" readonly class="inpWid"></el-input>
        </el-form-item>
        <el-form-item label="注册日期">
            <el-input v-model="user.created_at" readonly class="inpWid"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
            <el-input v-model="user.nickname" readonly class="inpWid"></el-input>
        </el-form-item>
        <el-form-item label="签名">
            <el-input v-model="user.signature" readonly class="inpWid"></el-input>
        </el-form-item>
        <el-form-item label="IP属地">
            <el-input v-model="user.ip_location" readonly class="inpWid"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import * as API from '@/api/user';

export default {
    data() {
        return {
            user: {},
        }
    },
    methods: {
        load() {
            API.getUser(this.$route.params.userID).then((res) => {
                if (res.code === 0) {
                    document.title = res.data.nickname + "的个人空间 - giligili"
                    this.user = res.data
                    this.user.created_at = new Date(this.user.created_at * 1000).toLocaleString()
                } else {
                    this.$notify.error({
                        title: "获取用户信息失败",
                        message: res.msg,
                        showClose: false
                    });
                    this.$router.push('/')
                }
            }).catch((error) => {
                this.$notify.error({
                    title: '获取信息失败',
                    message: error,
                    showClose: false
                });
                this.$router.push('/')
            });
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