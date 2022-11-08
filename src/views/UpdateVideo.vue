<template>
    <div>
        <h1 style="text-align:center">更新视频</h1>
        <el-form ref="form" :model="form" label-width="80px" status-icon :rules="rules" hide-required-asterisk>
            <el-form-item label="视频ID">
                <el-input v-model="form.id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="info">
                <el-input type="textarea" v-model="form.info" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="封面">
                <el-upload action="" :http-request="uploadCover" :before-upload="beforeUploadCover"
                    :on-exceed="onExceed" :on-remove="onRemoveCover" :before-remove="beforeRemove" :limit="1"
                    accept=".jpg,.jpeg,.png">
                    <el-button size="mini">选择封面</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="视频">
                <el-upload action="" :http-request="uploadVideo" :before-upload="beforeUploadVideo"
                    :on-exceed="onExceed" :on-remove="onRemoveVideo" :before-remove="beforeRemove" :limit="1"
                    accept=".mp4">
                    <el-button size="mini">选择视频</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <span v-if="showProgress" style="color: #606266;">上传中，过程可能较慢，请勿关闭页面或操作被上传的文件;
                    在token刷新时可能会造成进度条不动，此时属于正常现象</span>
                <el-progress v-if="showProgress" :percentage="progressPercentage"></el-progress>
                <el-button id="button" type="primary" @click="updatevideo">更新<i
                        class="el-icon-upload el-icon--right"></i>
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
import * as API from '@/api/video'

export default {
    data() {
        return {
            form: {
                id: '',
                title: '',
                info: '',
                cover: '',
                video: '',
            },
            progressPercentage: 0,
            showProgress: false,
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
                ],
                info: [
                    { max: 255, message: '长度需小于等于255个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        updatevideo() {
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    this.$notify.error({
                        title: '更新失败',
                        message: '填入信息有误',
                        showClose: false
                    });
                } else {
                    let form = new FormData()
                    form.append("title", this.form.title)
                    form.append("info", this.form.info)
                    if (this.form.cover !== '') {
                        form.append("cover", this.form.cover)
                    }
                    if (this.form.video !== '') {
                        form.append("video", this.form.video)
                    }
                    let button = document.getElementById("button")
                    button.disabled = true
                    let preInner = button.innerHTML
                    button.innerHTML = "更新中..."
                    let _this = this
                    _this.showProgress = true
                    API.updateVideo(this.form.id, form, function (e) {
                        _this.progressPercentage = parseInt(e.loaded / e.total * 100)
                    }).then((res) => {
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '更新成功'
                            });
                            this.$router.push('/video/' + res.data.id)
                        } else {
                            this.$notify.error({
                                title: '更新失败',
                                message: res.msg,
                                showClose: false
                            });
                            button.disabled = false
                            button.innerHTML = preInner
                            this.showProgress = false
                            this.progressPercentage = 0
                        }
                    }).catch((error) => {
                        this.$notify.error({
                            title: '更新失败',
                            message: error,
                            showClose: false
                        });
                        button.disabled = false
                        button.innerHTML = preInner
                        this.showProgress = false
                        this.progressPercentage = 0
                    });
                }
            });
        },
        onExceed() {
            this.$message.warning("文件只能为1个")
        },
        uploadCover(option) {
            this.form.cover = option.file
        },
        beforeUploadCover(file) {
            if (file.size / 1024 / 1024 > 2) {
                this.$message.error('封面大小不能超过2MB');
                return false
            }
            return true
        },
        onRemoveCover(file) {
            if (file.size / 1024 / 1024 <= 2) { //封面大小超过2MB时会自动触发移除钩子
                this.form.cover = ""
            }
        },
        uploadVideo(option) {
            this.form.video = option.file
        },
        beforeUploadVideo(file) {
            if (file.size / 1024 / 1024 > 1024) {
                this.$message.error('视频大小不能超过1GB');
                return false
            }
            return true
        },
        onRemoveVideo(file) {
            if (file.size / 1024 / 1024 <= 100) { //视频大小超过1GB时会自动触发移除钩子
                this.form.video = ""
            }
        },
        beforeRemove() {
            if (this.showProgress) {
                this.$message({
                    message: '上传时禁止移除文件',
                    type: 'warning'
                });
                return false
            }
            return true
        },
    },
    beforeMount() {
        let id = this.$route.params.id
        if (id === undefined) {
            this.$notify.error({
                title: "拒绝访问",
                message: "非法操作",
                showClose: false
            });
            this.$router.push('/')
            return
        }
        if (this.$route.params.uid.toString() !== localStorage.getItem("uid")) {
            this.$notify.error({
                title: "拒绝访问",
                message: "该视频不属于你",
                showClose: false
            });
            this.$router.push('/')
            return
        }
        this.form.id = id
        this.form.title = this.$route.params.title
        this.form.info = this.$route.params.info
    }
}
</script>
  