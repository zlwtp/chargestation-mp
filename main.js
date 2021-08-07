import Vue from 'vue'
import App from './App'
import store from './store'
import request from './axios/request.js'
import api from './api/api.js';
import '@/asset/scss/global.scss';
import '@/asset/scss/common.scss';

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$http = request.request;
Vue.prototype.$api = api;

App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
