<template>
    <view class="mine">
        <!-- 帐号界面 -->
        <view class="content">
            <view class="user-titletal">
                <view class="top-head-title">
                    <open-data
                        class="top-user-img"
                        type="userAvatarUrl"
                    ></open-data>
                    <open-data
                        class="top-user-title"
                        type="userNickName"
                    ></open-data>
                </view>
            </view>
            <view class="user-content">
                <!--充电桩-->
                <view class="userBtnView main-box-color">
                    <view style="padding: 0 26rpx; width: 100%">
                        <view class="top">
                            <span>充电桩</span>
                            <span></span>
                        </view>
                    </view>

                    <view class="content">
                        <view class="item">
                            <view class="items" @tap="goto(1)">
                                <img src="@/static/point.png" />
                                <span>添加充电桩</span>
                            </view>
                        </view>
                        <view class="item" v-if="hasPile">
                            <view class="items" @tap="goto(2)">
                                <img src="@/static/history.png" />
                                <span>充电记录</span>
                            </view>
                        </view>
                        <!-- <view class="item">
              <view class="items" @tap="goto(3)">
                <img src="@/static/bluetooth.png" />
                <span>蓝牙同步</span>
              </view>
            </view> -->
                        <view class="item" v-if="hasPile">
                            <view class="items" @tap="goto(4)">
                                <img src="@/static/faultInfo.png" />
                                <span>故障信息</span>
                            </view>
                        </view>
                        <view class="item" v-if="hasPile">
                            <view class="items" @tap="goto(5)">
                                <img src="@/static/member.png" />
                                <span>查看成员</span>
                            </view>
                        </view>
                        <view class="item" v-if="hasPile">
                            <view class="items" @tap="goto(6)">
                                <img src="@/static/install.png" />
                                <span>安装说明</span>
                            </view>
                        </view>
                        <view class="item" v-if="hasPile">
                            <view class="items" @tap="goto(7)">
                                <img src="@/static/operation.png" />
                                <span>使用说明</span>
                            </view>
                        </view>
                    </view>
                    <!-- <button class="change-btn userBtn" type="primary" @tap="goto(1)">
            我的充电桩
          </button>
          <button class="change-btn userBtn" type="primary" @tap="goto(2)">
            订单管理
          </button>
          <button class="change-btn userBtn" type="primary" @tap="goto(3)">
            意见反馈
          </button>
          <button class="change-btn userBtn" type="primary" @tap="goto(4)">
            常见问题
          </button> -->
                    <!-- <button class="userLogoutBtn userBtn" @tap="logout('myChargPoint')">
            登出
          </button> -->
                </view>
                <!--我的订单-->
                <!--服务-->
                <view class="userBtnView main-box-color">
                    <view style="padding: 0 26rpx; width: 100%">
                        <view class="top">
                            <span>服务</span>
                            <span></span>
                        </view>
                    </view>
                    <view class="content">
                        <view class="item">
                            <view class="items" @tap="goto(12)">
                                <img src="@/static/feedback.png" />
                                <span>意见反馈</span>
                            </view>
                        </view>
                        <view class="item">
                            <view class="items" @tap="goto(13)">
                                <img src="@/static/commonProblem.png" />
                                <span>常见问题</span>
                            </view>
                        </view>
                        <!-- <view class="item">
              <view class="items" @tap="goto(14)">
                <img src="@/static/address.png" />
                <span>地址管理</span>
              </view>
            </view> -->
                    </view>
                </view>
                <view style="height: 70rpx; background-color: unset"></view>
            </view>
        </view>
        <uni-popup ref="selectBook" type="bottom" @change="popupChange">
            <select-book
                v-if="selectBook"
                :chargType="chargType"
                @close="close"
                @confirm="confirm"
            ></select-book>
        </uni-popup>
    </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import selectBook from '@/components/mycomponents/chargPointSub/selectBook'

export default {
    components: { selectBook },
    data() {
        return {
            userImge:
                'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/6acec660-4f31-11eb-a16f-5b3e54966275.jpg', //头像
            title: '标题',
            nickName: '微信昵称',
            code: '',
            openId: uni.getStorageSync('openID'),
            pileData: {},
            hasPile: false,
            selectBook: false, //选择充电桩的型号
            chargType: [],
            isInstall: true
        }
    },
    // computed: {
    //     ...mapState(['userInfo', 'phoneNumber', 'encryptedData', 'iv', 'appId'])
    // },
    //页面初始加载
    onLoad() {
        const userInfo = uni.getStorageSync('userInfo')
        const pileData = uni.getStorageSync('pileData')
        const chargType = uni.getStorageSync('chargType')
        if (userInfo) {
            this.nickName = userInfo.nickName
            this.userImge = userInfo.avatarUrl
        }
        if (pileData) {
            this.hasPile = true
            this.pileData = pileData
        } else {
            this.hasPile = false
        }
        if (chargType) {
            this.chargType = chargType || ''
        }
    },
    onShow() {
        const pileData = uni.getStorageSync('pileData')
        if (pileData) {
            this.hasPile = true
            this.pileData = pileData
        } else {
            this.hasPile = false
            uni.removeStorage({
                key: 'pileData',
                success: function (res) {}
            })
        }
        const chargType = uni.getStorageSync('chargType')
        if (chargType) {
            this.chargType = chargType
        }
    },
    onPullDownRefresh() {
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }, 1000)
    },
    methods: {
        popupChange(params) {
            if (params.show) {
                uni.hideTabBar()
            } else {
                uni.showTabBar()
            }
        },
        goto(type) {
            switch (type) {
                case 1: //添加充电桩
                    uni.navigateTo({
                        url: '/pages/myChargPoint/addChargPoint',
                        fail: res => {
                            console.log(res) //打印错误信息
                        }
                    })
                    break
                case 2: //充电记录
                    if (!this.hasPile) {
                        uni.showToast({
                            title: '请添加充电桩',
                            icon: 'none',
                            duration: 2000
                        })
                        break
                    }
                    uni.navigateTo({
                        url:
                            '/pages/myChargPoint/chargHistory?datas=' +
                            encodeURIComponent(JSON.stringify(this.pileData))
                    })
                    break
                case 3: //蓝牙同步
                    uni.navigateTo({
                        url: '/pages/myChargPoint/bluetooth'
                    })
                    break
                case 4: //故障信息
                    if (!this.hasPile) {
                        uni.showToast({
                            title: '请添加充电桩',
                            icon: 'none',
                            duration: 2000
                        })
                        break
                    }
                    uni.navigateTo({
                        url: `/pages/myChargPoint/faultInfo?code=${this.pileData.code}&name=${this.pileData.name}`
                    })

                    break
                case 5: //查看成员
                    if (!this.hasPile) {
                        uni.showToast({
                            title: '请添加充电桩',
                            icon: 'none',
                            duration: 2000
                        })
                        break
                    }
                    uni.navigateTo({
                        url: `/pages/myChargPoint/chargPointMember?code=${this.pileData.code}&name=${this.pileData.name}`,
                        fail: res => {
                            console.log(res) //打印错误信息
                        }
                    })
                    break
                case 6: //安装说明
                    this.getInstructions(true)
                    break
                case 7: //使用说明
                    this.getInstructions(false)
                    break

                case 11: //充值记录
                    if (!this.hasPile) {
                        uni.showToast({
                            title: '请添加充电桩',
                            icon: 'none',
                            duration: 2000
                        })
                        break
                    }
                    uni.navigateTo({
                        url:
                            '/pages/recharge/rechargeHistory?datas=' +
                            encodeURIComponent(JSON.stringify(this.pileData))
                    })
                    break
                case 12: //意见反馈
                    uni.navigateTo({
                        url: '/pages/feedback/feedback'
                    })
                    break
                case 13: //常见问题
                    uni.navigateTo({
                        url: '/pages/feedback/commonProblem'
                    })
                    break
                case 14: //地址管理
                    uni.navigateTo({
                        url: '/pages/feedback/commonProblem'
                    })
                    break
                case 15: //全部订单
                    break
                default:
                    console.log('无' + type)
                    break
            }
        },
        logout() {
            uni.showLoading({
                title: '退出中。。。'
            })
            // uni.removeStorage({
            //   key: "token",
            // });
            uni.switchTab({
                url: '/pages/feedback/feedback'
            })
            uni.hideLoading()
        },
        async confirm(type) {
            await getInstructionsGet(type)
            this.close()
        },
        close() {
            this.selectBook = false
            this.$refs.selectBook.close()
        },
        async getInstructionsGet(model) {
            let baseUrl =
                'https://www.chargestation.online/pile/instructions/static/'
            const { result } = await this.$http({
                url: this.$api.instructionsGet,
                method: 'GET',
                data: {
                    model: model
                }
            })
            if (!result) {
                return uni.showToast({
                    title: '暂无文档',
                    icon: 'none',
                    duration: 2000
                })
            }
            if (vm.isInstall) {
                vm.openReport(baseUrl + result.installInstructionUrl)
            } else {
                vm.openReport(baseUrl + result.operationInstructionUrl)
            }
        },
        async getInstructions(type) {
            let vm = this
            vm.isInstall = type
            if (this.chargType.length > 1) {
                this.selectBook = true
                this.$refs.selectBook.open()
            } else {
                await getInstructionsGet(this.chargType[0])
            }
        },
        //这里的 url 就是pdf文件的路径，直接调用此方法就可以打开pdf文件
        openReport(url) {
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            try {
                wx.downloadFile({
                    url: url,
                    success: function (res) {
                        uni.hideLoading()
                        var filePath = res.tempFilePath
                        uni.showLoading({
                            title: '正在打开',
                            mask: true
                        })
                        wx.openDocument({
                            filePath: filePath,
                            fileType: 'pdf',
                            success: function (res) {
                                uni.hideLoading()
                            },
                            fail: function (err) {
                                uni.hideLoading()
                                console.log('fail:' + JSON.stringify(err))
                            }
                        })
                    },
                    fail: function (err) {
                        uni.hideLoading()
                        console.log('fail:' + JSON.stringify(err))
                    }
                })
            } catch (error) {
                uni.hideLoading()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.mine {
    height: 100 vh;
    .content {
        text-align: center;
        // height: 400upx;

        .text {
            border: 1, solid, black;
        }

        .user-titletal {
            width: 750rpx;
            height: 340rpx;
            display: flex;
            padding: 0 60rpx;
            background: url('@/static/bg.png') no-repeat;
            background-size: 100% 100%;
            .top-head-title {
                display: flex;
                justify-content: center;
                align-items: center; //y轴排列
                background: transparent;
                .top-user-img {
                    height: 110rpx;
                    width: 110rpx;
                    border-radius: 110rpx;
                    overflow: hidden;
                }

                .top-user-title {
                    height: 94rpx;
                    line-height: 94rpx;
                    font-size: 36rpx;
                    color: rgba(255, 255, 255, 1);
                    margin-left: 40rpx;
                }
            }
        }

        //帐号页面
        .user-content {
            padding: 42rpx 20rpx;
            background-color: #f8f8f8;
            /*按钮*/
            .userBtnView {
                width: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                // padding: 0 26rpx;
                border-radius: 10rpx;
                margin-bottom: 20rpx;
                .top {
                    width: 100%;
                    height: 96rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1rpx solid #f3f3f3;
                    span {
                        color: rgba(51, 51, 51, 1);
                        font-size: 32rpx;
                        font-weight: bold;
                        &:last-child {
                            font-size: 26rpx;
                            font-weight: normal;
                            color: #777777;
                        }
                    }
                }
                .content {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    margin: 20rpx 0;
                    .item {
                        width: 25%;
                        height: 120rpx;
                        padding: 0 20rpx;
                    }
                    .items {
                        height: 120rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        img {
                            width: 64rpx;
                            height: 64rpx;
                        }
                        span {
                            color: #333333;
                            font-size: 20rpx;
                        }
                    }
                }
                .userBtn {
                    width: 570rpx;
                    margin-bottom: 40rpx;
                }
                .userLogoutBtn {
                    width: 570rpx;
                    background-color: #007aff;
                    color: #ffffff;
                    border-radius: 20px;
                    font-size: 34rpx;
                }
            }
        }
    }
}
</style>
