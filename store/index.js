import Vue from 'vue'
import Vuex from 'vuex'
import shop from './shop.js'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        appId: 'wx5ef2d2d07f800bba',
        appName: '智汇充电',
        userInfo: {}, //微信用户信息
        iv: '',
        loginStatus: true,
        encryptedData: '',
        phoneNumber: '',
        websiteUrl: 'https://8.142.75.174/upload' //图片地址—测试
        //websiteUrl: 'https://www.chargestation.online/upload'//图片地址—生产
    },
    mutations: {
        setState(state, config) {
            for (const key in config) {
                state[key] = config[key]
            }
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            console.log('wx', state.userInfo)
        }
    },
    modules: {
        shop
    }
})

export default store
