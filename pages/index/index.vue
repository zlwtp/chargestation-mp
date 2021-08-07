<template>
    <view class="home flex-col">
        <view class="box1 flex-col" v-if="!noPile">
            <view class="bd14 flex-row">
                <view class="layer11 flex-col" @tap="startStop('start')">
                    <span class="layer111">启动</span>
                </view>
                <view class="layer12 flex-col" @tap="openAppoint">
                    <span class="layer122 flex-col">预约</span>
                </view>
                <view class="layer13 flex-col" @tap="startStop('stop')">
                    <span class="layer133 flex-col">停止</span>
                </view>
            </view>
            <img
                class="bd-bj"
                v-if="status == 1"
                src="@/static/point-bg1.gif"
            />
            <img
                class="bd-bj"
                v-if="status == 4"
                src="@/static/point-bg2.png"
            />
            <img
                class="bd-bj"
                v-if="status == 6"
                src="@/static/point-bg3.png"
            />
            <img
                class="bd-bj"
                v-if="status == 0 || status == 2 || status == 3 || status == 5"
                src="@/static/point-bg5.png"
            />
            <img class="bd-bj2" src="@/static/point-bg.png" />
            <span class="word1" v-if="status == 1">充电中</span>
            <span class="word1" v-if="status == 2">待机</span>
            <span class="word1" v-if="status == 3">插枪</span>
            <span class="word1" v-if="status == 4">充电完成</span>
            <span class="word1" v-if="status == 5">充电暂停</span>
            <span
                class="word1"
                v-if="status == 6"
                style="color: rgba(220, 83, 81, 1)"
                >充电故障</span
            >
            <span
                class="word1"
                v-if="status == 0"
                style="color: rgba(194, 194, 194, 1)"
                >未连接</span
            >
            <span class="word2" v-if="powerShow">{{ chargePower }}</span>
            <span class="word3" v-if="powerShow">{{
                (chargeTime / 60).toFixed(2)
            }}</span>
            <span class="word4">状态</span>
            <span class="word5" v-if="powerShow">已充电量（KW/h）</span>
            <span class="txt1" v-if="powerShow">已充时间（H)</span>
            <span class="word6">充电电量仅供参考</span>
        </view>
        <view @tap="openSelect" v-if="!noPile">
            <view class="word7">
                <text>{{ name }}</text>
                <span class="arrow-bottom"></span>
            </view>
        </view>
        <view class="no-pile" v-if="noPile">
            <view>
                <img class="bd-bj2" src="@/static/point-bg.png" />
                <img class="bd-no" src="@/static/no.png" />
                <span class="bd-no-span">未绑定充电桩</span>
            </view>
        </view>
        <view class="foot" v-if="noPile">
            <button class="change-btn" type="primary" @tap="gotoAdd">
                去绑定
            </button>
        </view>
        <uni-popup ref="loginOpt" background-color="#fff" type="bottom">
            <login-opt @close="loginClose" @confirm="loginConfirm"></login-opt>
        </uni-popup>
    </view>
</template>

<script>
import loginOpt from './opt/login'
import { mapState, mapMutations } from 'vuex'
export default {
    components: { loginOpt },
    data() {
        return {
            name: '',
            electricity: 10,
            isStart: true,
            openId: uni.getStorageSync('openID'),
            code: '',
            command: '',
            sn: '',
            time: '',
            upData: null, //定时刷新任务
            status: '',
            chargeTime: '0',
            chargePower: '0',
            noPile: true,
            powerShow: true, // 是否显示电量 时间
            applets: ''
        }
    },
    computed: {
        ...mapState(['userInfo', 'phoneNumber', 'iv', 'encryptedData', 'appId'])
    },
    onLoad() {
        this.applets = uni.getStorageSync('applets') || ''
        if (this.openId) {
            this.login()
        } else {
            this.openLogin()
        }
    },
    onShow() {
        clearTimeout(this.upData)
        this.upData = null
        if (this.openId) {
            this.getData()
            if (uni.getStorageSync('chargNum') > 0) {
                this.getUpData()
            } else {
                if (this.upData) {
                    clearTimeout(this.upData)
                    this.upData = null
                }
            }
        }
    },
    onHide() {
        if (this.upData) {
            clearTimeout(this.upData)
            this.upData = null
        }
    },
    onPullDownRefresh() {
        this.getData()
        uni.showToast({
            title: '刷新',
            icon: 'none'
        })
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }, 1000)
    },
    methods: {
        ...mapMutations(['setState']),
        login() {
            let vm = this
            uni.login({
                provider: 'weixin',
                scopes: 'auth_base',
                success(data) {
                    let param = {
                        code: data.code,
                        encryptedData: vm.encryptedData,
                        iv: vm.iv,
                        appId: vm.appId
                    }
                    vm.isAuth(param)
                }
            })
        },
        async isAuth(param) {
            const res = await this.$http({
                url: this.$api.isAuthNew,
                method: 'POST',
                data: param
            })
            if (res.code == 200) {
                console.log('isAuth', res.message)
                if (res.result.openId == null) {
                    this.openLogin()
                } else {
                    //保存OpenId
                    uni.setStorage({
                        key: 'openID',
                        data: res.result.openId
                    })
                    this.openId = res.result.openId
                    this.getAppoint()
                }
            } else {
                this.openLogin()
            }
        },
        //登录
        openLogin() {
            // 没有登录时先清除跳转参数
            uni.setStorage({
                key: 'applets',
                data: ''
            })
            this.applets = ''
            uni.hideTabBar()
            this.$refs.loginOpt.open()
        },
        // 获取绑定桩
        async getAppoint() {
            const { result, code } = await this.$http({
                url: this.$api.getMainPile,
                method: 'GET',
                data: {
                    openId: this.openId
                }
            })
            if (code == 200) {
                if (result == null || result.length == 0) {
                    this.noData()
                    return
                }
                this.noPile = false
                this.name = result.name
                this.code = result.code
                // 是否显示充电时间
                if (
                    this.code.indexOf('09') == 0 ||
                    this.code.indexOf('03') == 0
                ) {
                    this.powerShow = false
                } else {
                    this.powerShow = true
                }
                this.sn = result.sn
                this.status = result.status
                this.chargeLatest()
                // 设置当前绑定的充电桩
                uni.setStorage({
                    key: 'pileData',
                    data: result
                })
                uni.setStorage({
                    key: 'chargType',
                    data: [result.type]
                })
                this.getData()
            } else {
                this.noPile = true
                // 没有充电桩时先清除跳转参数
                uni.setStorage({
                    key: 'applets',
                    data: ''
                })
                this.applets = ''
            }
        },
        // 最后一次充电时间
        async chargeLatest() {
            const { result, code } = await this.$http({
                url: this.$api.chargeLatest,
                method: 'GET',
                data: {
                    code: this.code
                }
            })
            if (code == 200) {
                this.chargeTime = result.chargeTime
                this.chargePower = result.chargePower.toFixed(2)
            } else {
                // this.getAppointList()
                // this.delClose()
            }
        },
        // 无充电桩
        noData() {
            uni.removeStorage({
                key: 'pileData',
                success: function () {}
            })
            uni.setStorage({
                key: 'chargNum',
                data: 0,
                success() {}
            })
            uni.setStorage({
                key: 'chargType',
                data: [],
                success() {}
            })
            // 没有充电桩先清除跳转参数
            uni.setStorage({
                key: 'applets',
                data: ''
            })
            this.applets = ''
            this.noPile = true
            return wx.showToast({
                title: '暂无数据', // 标题
                icon: 'none', // 图标类型，默认success
                duration: 2000 // 提示窗停留时间，默认1500ms
            })
        },
        //定时获取充电桩数据 刷新
        async getData() {
            const { result, code } = await this.$http({
                url: `${this.$api.bindingList}?openId=${this.openId}`,
                method: 'GET'
            })
            if (result == null || result.length == 0) {
                this.noData()
                return
            }
            let type = []
            const pileData = uni.getStorageSync('pileData')
            if (pileData) {
                result.forEach(item => {
                    type.push(item.type)
                    if (item.code == pileData.code) {
                        this.noPile = false
                        this.name = item.name
                        this.code = item.code
                        this.sn = item.sn
                        this.status = item.status
                        this.chargeLatest()
                        uni.setStorage({
                            key: 'pileData',
                            data: item
                        })
                    }
                })
                if (
                    this.code.indexOf('09') == 0 ||
                    this.code.indexOf('03') == 0
                ) {
                    this.powerShow = false
                } else {
                    this.powerShow = true
                }
                uni.setStorage({
                    key: 'chargType',
                    data: this.dedupe(type),
                    success() {}
                })
            } else {
                this.getAppoint()
            }

            uni.setStorage({
                key: 'chargNum',
                data: result.length,
                success() {}
            })
            this.jumpPage()
        },
        jumpPage() {
            //微信公众号跳转过来要做什么操作
            let applets = this.applets
            if (!applets) return
            uni.setStorage({
                key: 'applets',
                data: ''
            })
            this.applets = ''

            if (!this.noPile) {
                uni.showToast({
                    title: '请先绑定桩后进行操作',
                    icon: 'none'
                })
                return
            }
            uni.setStorage({
                key: 'applets',
                data: ''
            })
            this.applets = ''
            if (applets == 'start') {
                this.startStop('start')
            }
            if (applets == 'stop') {
                this.startStop('stop')
            }
            if (applets == 'appoint') {
                this.openAppoint()
            }
        },

        dedupe(array) {
            return Array.from(new Set(array))
        },
        async startStop(command) {
            let param = {
                openId: this.openId,
                code: this.code,
                command: command,
                sn: this.sn
            }
            const { code, result } = await this.$http({
                url: this.$api.control,
                method: 'POST',
                data: param
            })
            if (code == 200) {
                wx.showToast({
                    title:
                        command == 'start'
                            ? '开始指令发送成功'
                            : '停止指令发送成功', // 标题
                    icon: 'none' // 图标类型，默认success
                })
                this.status = result.status
            }
        },
        //预约
        openAppoint() {
            uni.navigateTo({
                url: '/pages/index/appointList'
            })
        },
        //更换
        openSelect() {
            uni.navigateTo({
                url: '/pages/myChargPoint/selectCharg'
            })
        },

        loginConfirm() {
            this.openId = uni.getStorageSync('openID')
            this.loginClose()
            this.getAppoint()
        },
        loginClose() {
            uni.showTabBar()
            this.$refs.loginOpt.close()
        },
        getUpData() {
            this.upData = setInterval(() => {
                this.getData()
            }, 1000 * 15)
        },
        gotoAdd() {
            uni.navigateTo({
                url: '/pages/myChargPoint/addChargPoint'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
.home2 {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    // background-color: #fff;
    // height: 100%;
    .text {
        color: #000;
    }
    .top {
        width: 750rpx;
        height: 325rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .top-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 40rpx;
            font-size: 38rpx;
            font-weight: bold;
        }
    }
    .content {
        height: 125rpx;
        margin: 60rpx auto;
        text {
            display: block;
        }
    }
    .content-btn {
        display: flex;
        margin-bottom: 200rpx;
        .circular-btn {
            width: 144rpx;
            height: 144rpx;
            color: #ffffff;
            border-radius: 144rpx;
            margin-right: 40rpx;
            justify-content: center;
            align-items: center;
            display: flex;
        }
    }
}
</style>
