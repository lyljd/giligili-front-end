import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import * as Common from '@/common';

Vue.config.productionTip = false

// 请求拦截
axios.interceptors.request.use(
    req => {
        req.headers["Token"] = localStorage.getItem("token");
        return req;
    },
    error => Promise.reject(error)
);

// 响应拦截
axios.interceptors.response.use(
    res => {
        return res
    },
    function(error) {
        let ret
        if (error.response.status === 401) {
            if (Common.checkRefreshToken()) {
                let res = error

                //发送refresh_token以获取新的token
                const oReq = new XMLHttpRequest();
                oReq.open("POST", "/api/v1/refresh-token", false); //必须使用同步请求
                oReq.onreadystatechange = function() {
                    if (oReq.readyState === 4) {
                        if (oReq.status === 200) {
                            let rres = JSON.parse(oReq.responseText)
                            if (rres.code === 0) {
                                localStorage.setItem("token", rres.data.token);

                                //刷新完token后开始进行最初请求重发
                                const roReq = new XMLHttpRequest();
                                roReq.open(res.config.method, res.config.url, false); //必须使用同步请求
                                roReq.onreadystatechange = function() {
                                    if (roReq.readyState === 4) {
                                        if (roReq.status === 200) {
                                            res.response.data = JSON.parse(roReq.responseText)
                                            res.response.status = 200
                                            res.response.statusText = "OK"
                                            ret = res.response
                                        } else {
                                            Common.clearAllTokenAndToLoginPage()
                                            return Promise.reject("请登录")
                                        }
                                    }
                                }
                                if (res.config.headers['Content-Type'] !== false) {
                                    roReq.setRequestHeader("Content-Type", "application/json")
                                }
                                roReq.setRequestHeader("Token", rres.data.token)
                                if (res.config.data === undefined) {
                                    roReq.send()
                                } else {
                                    roReq.send(res.config.data)
                                }
                            } else {
                                Common.clearAllTokenAndToLoginPage()
                                return Promise.reject("请登录")
                            }
                        } else {
                            Common.clearAllTokenAndToLoginPage()
                            return Promise.reject("请登录")
                        }
                    }
                }
                oReq.setRequestHeader("Content-Type", "application/json;charset=utf-8")
                oReq.send(JSON.stringify({ "token": localStorage.getItem("refresh_token") }))
            } else {
                Common.clearAllTokenAndToLoginPage()
                return Promise.reject("请登录")
            }
            return ret
        } else {
            return Promise.reject(error)
        }
    }
);

var ars = new Set(["/postvideo", "/me", "/updatevideo"]) // authRouterSet

router.beforeEach((to, from, next) => {
    if (ars.has(to.path.toLowerCase()) && !Common.checkToken()) {
        next("/login")
        Vue.prototype.$notify.error({
            title: "拒绝访问",
            message: "请登录",
            showClose: false
        });
        return
    }
    if (to.meta.title) {
        document.title = to.meta.title + " - giligili"
    }
    next()
})

// newVue的代码必须放在beforeEach下面，不然刷新后页面title会无法设置
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')