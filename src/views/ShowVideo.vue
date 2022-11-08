<template>
    <el-row :gutter="10" type="flex">
        <el-col :span="4"><br></el-col>
        <el-col :span="16">
            <span class="title">{{ video.title }}</span>
            <el-row class="viewAndTime">
                <el-col :span="6">点击量：{{ video.view }}</el-col>
                <el-col :span="9">发布时间：{{ new Date(video.created_at * 1000).toLocaleString() }}</el-col>
                <el-col :span="9" v-if="video.updated_at">更新时间：{{ new Date(video.updated_at * 1000).toLocaleString() }}</el-col>
            </el-row>
            <video-player :options="playerOptions" class="video-player vjs-custom-skin">
            </video-player>
            <el-row style="height: 0;">
                <el-button v-show="this.checkOwner" type="success" @click="goUpdateVideoPage">更新</el-button>
                <el-button v-show="this.checkOwner" type="danger" @click="deleteVideo">删除</el-button>
            </el-row>
        </el-col>
        <el-col :span="4" style="padding-top: 15px;">
            <el-row style="height: 55px;">
                <el-col :span="6">
                    <span @click="goUser(video.u_id)" style="cursor: pointer;">
                        <el-avatar :src=video.u_avatar>
                            <el-avatar icon="el-icon-user-solid"></el-avatar>
                        </el-avatar>
                    </span>
                </el-col>
                <el-col :span="18">
                    <span class="uname" @click="goUser(video.u_id)">{{ video.u_nickname }}</span>
                    <span class="sig">{{ video.u_signature || '用户没有留下签名' }}</span>
                </el-col>
            </el-row>
            <el-row style="height: 90%;">
                <span>简介：</span>
                <textarea v-if="video.info !== ''" v-model="video.info" readonly></textarea>
                <textarea v-else readonly>作者没有留下简介</textarea>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import * as API from '@/api/video'

export default {
    data() {
        return {
            video: {
                title: '',
                info: '',
                video: '',
                u_id: '',
                u_nickname: '',
                u_signature: '',
                u_avatar: ''
            },
            playerOptions: {
                fluid: true,
                playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
                sources: [{
                    type: "video/mp4",
                    src: ""
                }],
                controlBar: {
                    volumeControl: true,
                    remainingTimeDisplay: false
                }
            },
            checkOwner: false,
        }
    },
    methods: {
        load() {
            API.getVideo(this.$route.params.videoID).then((res) => {
                if (res.code === 0) {
                    document.title = res.data.title + " - giligili"
                    this.video = res.data
                    this.playerOptions.sources[0].src = this.video.video
                    if (this.video.u_id.toString() === localStorage.getItem("uid")) {
                        this.checkOwner = true
                    } else {
                        this.checkOwner = false
                    }
                } else {
                    this.$notify.error({
                        title: "获取视频信息失败",
                        message: res.msg,
                        showClose: false
                    });
                    this.$router.push('/')
                }
            }).catch((error) => {
                this.$notify.error({
                    title: '获取视频信息失败',
                    message: error,
                    showClose: false
                });
                this.$router.push('/')
            });
        },
        goUser(id) {
            let routeData = this.$router.resolve({ path: '/user/' + id })
            window.open(routeData.href, '_blank');
        },
        deleteVideo() {
            this.$confirm('你确定要删除该视频吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                API.deleteVideo(this.$route.params.videoID).then((res) => {
                    if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.$router.push('/')
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch((error) => {
                    this.$message.error(error);
                });
            }).catch(() => {
                return
            })
        },
        goUpdateVideoPage() {
            this.$router.push({
                name: 'updatevideo',
                params: {
                    id: this.$route.params.videoID,
                    title: this.video.title,
                    info: this.video.info,
                    uid: this.video.u_id
                }
            })
        }
    },
    beforeMount() {
        this.load()
    },
    components: {
        videoPlayer
    }
}
</script>
<style>
.title {
    color: #000000;
    font-size: 24px;
    margin-top: 10px;
}

.uname {
    font-size: 16px;
    color: #000000;
}

.uname:hover {
    color: #606266;
    cursor: pointer;
}

.viewAndTime,
.sig {
    font-size: 14px;
    color: #909399;
}

span,
.viewAndTime {
    margin-bottom: 5px;
}

textarea {
    border: none;
    resize: none;
    overflow: hidden;
    padding: 0;
    width: 100%;
    height: 100%;
    font-size: 16px;
    color: #606266;
}

textarea:focus {
    outline: none;
}
</style>