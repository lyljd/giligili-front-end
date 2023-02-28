import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/HomePage.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: HomePage,
        meta: {
            title: '首页',
        }
    },
    {
        path: '/rank/daily',
        name: 'dailyrank',
        component: () =>
            import ('../views/DailyRank.vue'),
        meta: {
            title: '每日排行',
        }
    },
    {
        path: '/postvideo',
        name: 'postvideo',
        component: () =>
            import ('../views/PostVideo.vue'),
        meta: {
            title: '投稿视频',
        }
    },
    {
        path: '/video/:videoID',
        name: 'showvideo',
        component: () =>
            import ('../views/ShowVideo.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () =>
            import ('../views/UserRegister.vue'),
        meta: {
            title: '注册',
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/UserLogin.vue'),
        meta: {
            title: '登陆',
        }
    },
    {
        path: '/me',
        name: 'me',
        component: () =>
            import ('../views/UserMe.vue'),
        meta: {
            title: '我',
        }
    },
    {
        path: '/user/:userID',
        name: 'showuser',
        component: () =>
            import ('../views/ShowUser.vue'),
    },
    {
        path: '/updatevideo',
        name: 'updatevideo',
        component: () =>
            import ('../views/UpdateVideo.vue'),
        meta: {
            title: '修改视频',
        }
    },
]

const router = new VueRouter({
    /*mode: hash or history.
    history下url不会出现#，但nginx需要设置/下转到index.html，否则某些情况会404*/
    mode: 'history',
    routes
})

export default router