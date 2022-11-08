<template>
  <div id="app">
    <el-menu :default-active=this.$route.path mode="horizontal" router>
      <el-menu-item index="/me" v-show="checkLogin()">我</el-menu-item>
      <el-menu-item index="/login" v-show="!checkLogin()">登陆</el-menu-item>
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/rank/daily">每日排行</el-menu-item>
      <el-menu-item index="/postvideo" v-show="checkLogin()">投稿视频</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import * as Common from '@/common';

export default {
  name: 'app',
  methods: {
    checkLogin() {
      return Common.checkToken()
    }
  },
}
</script>
