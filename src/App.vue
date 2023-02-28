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
    <div class="footer">
      Copyright © 2023 lygod.top
      <br>
      Powered by <a href="http://blog.lygod.top" target="__blank">Bonnenult</a>
      <br>
      此网站仅供学习使用，侵权请联系：ljd9031#163.com(#换@)
    </div>
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

<style>
.footer {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #86909c;
}

.footer a {
  text-decoration: none;
  color: #1d2129;
}
</style>
