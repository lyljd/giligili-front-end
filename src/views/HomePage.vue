<template>
  <div>
    <h1 style="text-align:center;">Ciallo～(∠・ω＜)⌒☆</h1>

    <el-row type="flex" justify="center" style="margin-bottom: 30px;">
      <el-col :span="10">
        <el-input v-model="keyword" placeholder="请输入欲搜索的关键字" ref="input" @keyup.enter.native="search"></el-input>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="search" :disabled="videos === null && !searchStatus">搜索<i
            class="el-icon-search"></i></el-button>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <div v-if="videos === null || videos.length === 0">
        <span></span>
      </div>
      <div v-else>
        <el-col :span="4" v-for="video in videos" :key="video.id">
          <el-card class="el-card">
            <img width=100% :src=video.cover @error="setDefaultCover" @click="goVideo(video)" style="cursor: pointer;">
            <span @click="goVideo(video)" class="tit">{{ video.title }}</span>
            <span @click="goUser(video)" class="info">{{ video.u_nickname }} · {{ new Date(video.created_at *
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
      videos: [],
      keyword: '',
      preKeyword: '',
      searchStatus: false,
    }
  },
  methods: {
    load() {
      API.getVideos().then((res) => {
        if (res.code === 0) {
          if (res.data == null) {
            this.$notify.info({
              title: '消息',
              message: '还没有视频被上传',
              showClose: false
            });
          }
          this.videos = res.data
        } else {
          this.$notify.error({
            title: "获取视频列表失败",
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
    search() {
      if (this.keyword === "") {
        if (!this.searchStatus) {
          this.$alert('欲搜索的关键字为空', '提示', {
            confirmButtonText: '确定',
          });
          this.$refs.input.blur()
        } else {
          this.load()
          this.preKeyword = ""
          this.searchStatus = false
        }
        return
      }

      if (this.keyword === this.preKeyword) {
        return
      }

      API.search({ "Keyword": this.keyword }).then((res) => {
        if (res.code === 0) {
          if (res.data == null) {
            this.$notify.info({
              title: '消息',
              message: '未搜索到相关视频',
              showClose: false
            });
          }
          this.videos = res.data
          this.preKeyword = this.keyword
          this.searchStatus = true
        } else {
          this.$notify.error({
            title: '搜索失败',
            message: res.msg,
            showClose: false
          });
        }
      }).catch((error) => {
        this.$notify.error({
          title: '搜索失败',
          message: error,
          showClose: false
        });
      });

      this.$refs.input.blur()
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
    },
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