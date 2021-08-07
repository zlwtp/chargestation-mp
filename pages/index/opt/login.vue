<template>
    <view class="login">
        <view class="card-content">
            <view class="header">
                <image
                    :src="
                        userInfo.avatarUrl
                            ? userInfo.avatarUrl
                            : '../../../static/wx_login.jpg'
                    "
                ></image>
            </view>
            <view class="content">
                <view
                    >该小程序服务对象为使用智汇充电桩产品的客户，使用时请先进行授权</view
                >
                <view>若未授权仅能体验部分功能</view>
                <view>如需体验完整功能请先授权</view>
                <view>申请获取以下权限</view>
                <text>获得你的公开信息(昵称，头像、地区等)</text>
                <text>获得你微信绑定的手机号</text>
                <view class="userinfo"> </view>
            </view>
            <view v-if="!hasUserInfo">
                <button class="bottom" type="primary" @tap="getUserProfile">
                    获取头像昵称
                </button>
            </view>
            <button
                class="bottom"
                type="primary"
                open-type="getPhoneNumber"
                @getphonenumber="getPhoneNumber"
                withCredentials="true"
                lang="zh_CN"
                v-if="!phoneStatus"
            >
                手机号授权
            </button>
            <view class="phone" v-else>
                {{ phoneNumber }}
            </view>
            <button class="bottom" type="primary" @click="cancel">
                取消授权
            </button>
        </view>
    </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {
            code: '',
            type: 0,
            phone: '',
            phoneParams: {
                sessionkey: '',
                ivdata: '',
                encrypdata: ''
            },
            loginStatus: false,
            phoneStatus: false,
            hasUserInfo: false
        }
    },
    computed: {
        ...mapState(['userInfo', 'phoneNumber', 'encryptedData', 'iv', 'appId'])
    },
    mounted() {
        const vm = this
        uni.login({
            provider: 'weixin',
            success: data => {
                vm.code = data.code
            }
        })
    },
    methods: {
        ...mapMutations(['setState']),
        login() {
            let vm = this
            uni.login({
                provider: 'weixin',
                success(data) {
                    vm.code = data.code
                    let param = {
                        code: vm.code,
                        encryptedData: vm.encryptedData,
                        iv: vm.iv,
                        appId: vm.appId
                    }
                    vm.getOpenId(param)
                }
            })
        },
        getUserProfile(e) {
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
            // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            let vm = this
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: res => {
                    console.log('用于完善会员资料', res) //code
                    const { userInfo, encryptedData, iv } = res
                    uni.setStorage({
                        key: 'userInfo',
                        data: userInfo
                    })
                    vm.setState({
                        userInfo,
                        encryptedData,
                        iv,
                        loginStatus: true
                    })
                    vm.hasUserInfo = true
                    vm.loginStatus = true
                    let param = {
                        code: vm.code,
                        encryptedData: vm.encryptedData,
                        iv: vm.iv,
                        appId: vm.appId
                    }
                    vm.getOpenId(param)
                },
                fail: res => {
                    //用户按了拒绝按钮
                    vm.loginStatus = false
                    uni.showToast({
                        title: '为了方便您的使用，请先允许授权',
                        icon: 'none'
                    })
                    console.log('用户按了拒绝按钮') //code
                }
            })
        },
        async getOpenId(param) {
            try {
                let res = await this.$http({
                    url: this.$api.login,
                    method: 'POST',
                    data: param
                })
                if (res.code != 200) {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                    this.loginStatus = false
                } else {
                    //保存OpenId
                    const { openId } = res.result
                    uni.setStorage({
                        key: 'openID',
                        data: openId,
                        success() {
                            console.log('openID缓存成功')
                        },
                        fail() {
                            console.log('openID缓存失败')
                        }
                    })

                    if (openId == null) {
                        this.hasUserInfo = false
                    }
                    this.loginStatus = true
                    this.reLaunch()
                }
            } catch (error) {
                uni.removeStorage({
                    key: 'pileData',
                    success: function () {
                        console.log('pileData删除成功')
                    }
                })
                uni.removeStorage({
                    key: 'openID',
                    success: function () {
                        console.log('openID删除成功')
                    }
                })
                this.hasUserInfo = false
                this.loginStatus = false
            }
        },
        getPhoneNumber(e) {
            if (e.detail.errMsg == 'getPhoneNumber:ok') {
                this.getUserPhoneInfo(e.detail.encryptedData, e.detail.iv)
            } else {
                uni.showToast({
                    title: '授权失败，请稍后再试。。。',
                    icon: 'none'
                })
            }
        },
        getUserPhoneInfo(encryptedData, iv) {
            let vm = this
            uni.login({
                provider: ' weixin',
                success: async loginRes => {
                    const res = await vm.$http({
                        url: vm.$api.login,
                        method: 'POST',
                        data: {
                            code: loginRes.code,
                            encryptedData: encryptedData,
                            iv: iv,
                            appId: vm.appId
                        }
                    })
                    if (res.code == 200) {
                        const { phoneNumber, openId } = res.result
                        uni.showToast({
                            title: '获取到手机：' + phoneNumber,
                            icon: 'none'
                        })
                        uni.setStorage({
                            key: 'openID',
                            data: openId,
                            success() {
                                console.log('openID缓存成功')
                            },
                            fail() {
                                console.log('openID缓存失败')
                            }
                        })
                        vm.setState({
                            phoneNumber
                        })
                        vm.phoneStatus = true
                        vm.reLaunch()
                    } else {
                        vm.phoneStatus = false
                        uni.showToast({
                            title: '授权失败，请稍后再试。。。',
                            icon: 'none'
                        })
                    }
                }
            })
        },
        reLaunch() {
            if (this.loginStatus && this.phoneStatus) {
                uni.removeStorage({
                    key: 'pileData',
                    success: function () {
                        console.log('pileData删除成功')
                    }
                })
                this.$emit('confirm')
            }
        },
        cancel() {
            uni.removeStorage({
                key: 'pileData',
                success: function () {
                    console.log('pileData删除成功')
                }
            })
            uni.removeStorage({
                key: 'openID',
                success: function () {
                    console.log('openID删除成功')
                }
            })
            this.$emit('confirm')
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    width: 100wh;
    padding: 0 20rpx;
    .card-content {
        margin-top: 20rpx;
        height: calc(100vh - 90rpx);
    }
}

.header {
    margin: 90rpx 0 50rpx 50rpx;
    border-bottom: 1px solid #ccc;
    text-align: center;
    width: 650rpx;
    height: 300rpx;
    line-height: 450rpx;
}

.header image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 200rpx;
}

.phone {
    height: 40rpx;
    margin-left: 50rpx;
    margin-bottom: 50rpx;
}

.content text,
.phone {
    display: block;
    color: #9d9d9d;
    margin-top: 40rpx;
    text-align: center;
}

.bottom {
    height: 73rpx;
    line-height: 73rpx;
    border-radius: 80rpx;
    margin: 35rpx 50rpx;
    font-size: 35rpx;
}

.bottom:first-child {
    margin-top: 50rpx;
}

.view_input {
    margin: 0 50rpx;
    background-color: white;
    padding: 10px;
    height: 1rem;
    line-height: 1rem;
}
</style>
