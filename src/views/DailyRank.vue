<template>
    <div>
        <h1 style="text-align:center;">今天又是美好的一天</h1>
        <el-row :gutter="5">
            <div v-if="videos === null || videos.length === 0">
                <span></span>
            </div>
            <div v-else>
                <el-col :span="4" v-for="video in videos" :key="video.id">
                    <el-card class="el-card">
                        <img width=100% :src=video.cover @error="setDefaultCover" @click="goVideo(video)"
                            style="cursor: pointer;">
                        <span @click="goVideo(video)" class="tit">{{ video.title }}</span>
                        <span @click="goUser(video)" class="info">{{ video.u_nickname }} · {{ new Date(video.created_at
                                *
                                1000).toLocaleDateString()
                        }}</span>
                    </el-card>
                </el-col>
            </div>
        </el-row>
    </div>
</template>
  
<script>
import * as API from '@/api/video';
import defaultCover from '@/../public/default.png'

export default {
    data() {
        return {
            videos: []
        }
    },
    methods: {
        load() {
            API.getVideoDailyRank().then((res) => {
                if (res.code === 0) {
                    if (res.data == null) {
                        this.$notify.info({
                            title: '消息',
                            message: '今日还没有视频被观看',
                            showClose: false
                        });
                    }
                    this.videos = res.data
                } else {
                    this.$notify.error({
                        title: '获取视频列表失败',
                        message: res.msg,
                        showClose: false
                    });
                }
            }).catch((error) => {
                this.$notify.error({
                    title: '获取视频列表失败',
                    message: error,
                    showClose: false
                });
            });
        },
        goVideo(video) {
            this.$router.push('/video/' + video.id)
        },
        goUser(video) {
            let routeData = this.$router.resolve({ path: '/user/' + video.u_id })
            window.open(routeData.href, '_blank');
        },
        setDefaultCover(e) {
            e.target.src = defaultCover
        }
    },
    beforeMount() {
        this.load()
    },
}
</script>
  
<style>
span {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/*不能取title*/
.tit {
    color: #000000;
}

.tit:hover {
    color: #606266;
    cursor: pointer
}

.info {
    color: #909399;
    font-size: 12px;
}

.info:hover {
    color: #C0C4CC;
    cursor: pointer;
}

.el-card {
    margin-bottom: 5px;
}
</style>