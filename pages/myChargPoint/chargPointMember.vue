<template>
    <view class="chargPointMember">
        <view class="top" v-if="showFlag">
            <view class="top-content" @tap="openSelect">
                <text>{{ name }}</text>
                <span class="arrow-bottom"></span>
            </view>
        </view>
        <view class="charg-card">
            <view
                class="charg-sub"
                v-for="(item, index) in chargList"
                :key="index"
            >
                <view class="charg-content">
                    <image class="top-user-img" :src="item.avatar"></image>
                    <text
                        class="top-user-title"
                        :style="item.masterMember == 1 ? 'color:#f74444;' : ''"
                        >{{ item.name }}</text
                    >
                </view>
                <view class="charg-right">
                    <view class="charg-btn" v-if="item.delFlag || allDell">
                        <button
                            class="change-btn"
                            type="error"
                            @tap="openDel(item)"
                        >
                            删除
                        </button>
                    </view>
                </view>
            </view>
        </view>
        <uni-popup ref="delPopup" type="center">
            <uni-popup-dialog @close="delClose" @confirm="delConfirm">
                <view class="del-popup">
                    <text class="title">请确定是否删除{{ userName }}</text>
                </view>
            </uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
export default {
    name: 'chargPointMember',
    data() {
        return {
            isStart: true,
            id: '',
            name: '',
            userName: '',
            code: '',
            openIDPile: '',
            openId: uni.getStorageSync('openID'),
            allDell: false,
            chargList: [],
            showFlag: true
        }
    },
    onShow() {
        if (uni.getStorageSync('pileData')) {
            this.confirm(uni.getStorageSync('pileData'))
        } else {
            uni.showToast({
                title: '请先添加充电桩',
                icon: 'none'
            })
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
        async getData() {
            let vm = this
            this.allDell = false
            if (this.code == '') {
                this.chargList = []
                return wx.showToast({
                    title: '当前没有选中桩', // 标题
                    icon: 'none' // 图标类型，默认success
                })
            }
            const { result } = await this.$http({
                url: this.$api.memberList,
                method: 'GET',
                data: {
                    code: this.code
                }
            })
            if (result == null || result.length == 0) {
                this.chargList = []
                return wx.showToast({
                    title: '暂无数据', // 标题
                    icon: 'none', // 图标类型，默认success
                    duration: 2000 // 提示窗停留时间，默认1500ms
                })
            }
            result.forEach(item => {
                if (item.openId == this.openId) {
                    if (item.masterMember == 1) {
                        item.delFlag = true
                        this.allDell = true
                    } else {
                        item.delFlag = true
                    }
                } else {
                    item.delFlag = false
                }
            })
            this.chargList = result
        },
        async getCharg(flag) {
            if (!this.openId) {
                return
            }
            const { result } = await this.$http({
                url: this.$api.bindingList + '?openId=' + this.openId,
                method: 'GET',
                data: {}
            })
            if (result == null || result.length == 0) {
                this.code = ''
                this.name = ''
                uni.removeStorage({
                    key: 'pileData',
                    success: function () {}
                })
                uni.setStorage({
                    key: 'chargNum',
                    data: 0,
                    success() {}
                })
                return wx.showToast({
                    title: '暂无数据', // 标题
                    icon: 'none', // 图标类型，默认success
                    duration: 2000 // 提示窗停留时间，默认1500ms
                })
            }
            let data = result
            data.forEach(item => {
                if (item.code == uni.getStorageSync('pileData').code) {
                    //如果是删除其他成员 桩还在
                    this.code = item.code
                    this.name = item.name
                    this.getData()
                } else {
                    this.code = ''
                    this.name = ''
                    this.getAppoint()
                }
            })
        },
        //获取绑定桩
        async getAppoint() {
            const { result } = await this.$http({
                url: this.$api.getMainPile,
                method: 'GET',
                data: {
                    openId: this.openId
                }
            })
            try {
                if (result == null || result.length == 0) {
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
                    uni.switchTab({
                        url: '/pages/index/index'
                    })
                    return
                }
                this.name = result.name
                this.code = result.code
                uni.setStorage({
                    key: 'pileData',
                    data: result
                })
                this.confirm({ code: this.code, name: this.name })
            } catch (error) {
                uni.switchTab({
                    url: '/pages/index/index'
                })
            }
        },
        openDel(data) {
            this.id = data.id
            this.openIDPile = data.openId
            this.userName = data.name
            this.$refs.delPopup.open()
        },

        async delConfirm() {
            await this.$http({
                url: this.$api.member + '/' + this.id + '/' + this.openId,
                method: 'DELETE',
                data: {}
            })
            uni.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
            })
            this.chargList = []
            if (this.openIDPile == this.openId) {
                this.code = ''
                this.name = ''
                this.getAppoint()
            } else {
                this.getData()
            }
            this.delClose()
        },
        delClose() {
            this.$refs.delPopup.close()
        },
        openSelect() {
            uni.navigateTo({
                url: '/pages/myChargPoint/selectCharg'
            })
        },
        confirm(data) {
            this.code = data.code
            this.name = data.name
            this.getData()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/asset/scss/common.scss';
.uni-popup-dialog {
    border: 4rpx solid #ccc;
}
.chargPointMember {
    height: 100vh;
    background-color: #fff;
    padding: 0 20rpx;
    .top {
        display: flex;
        align-items: center;
        padding-left: 34rpx;
        height: 84rpx;
        .top-content {
            display: flex;
            align-items: center;
            height: 84rpx;
            text {
                margin-right: 20rpx;
            }
            .arrow {
                width: 20rpx;
                height: 20rpx;
            }
            .arrow-bottom {
                display: inline-block;
                width: 8px;
                height: 8px;
                // margin-top: 41rpx;
                // margin-right: -20rpx;
                border-right: 1px solid rgba(51, 51, 51, 1);
                border-bottom: 1px solid rgba(51, 51, 51, 1);
                transform: rotate(45deg);
                margin-top: -5rpx;
            }
        }
    }
    .charg-card {
        background-color: #fff;
        h .charg-item {
            margin-bottom: 50rpx !important;
            border-radius: 5rpx !important;
        }
        .charg-sub {
            display: flex;
            width: 100%;
            padding: 25rpx 40rpx;
            // margin: 20rpx 0;
            position: relative;
            border-radius: 5rpx;
            border-bottom: 2rpx solid #ccc;
            .charg-left {
                width: 120rpx;
                height: 120rpx;
                margin-right: 30rpx;
                image {
                    width: 100%;
                    height: 100%;
                }
            }
            .charg-content {
                flex: 1;
                display: flex;
                // justify-content: center;
                align-items: center; //y轴排列
                .top-user-img {
                    height: 100rpx;
                    width: 100rpx;
                    border-radius: 200rpx;
                    overflow: hidden;
                }

                .top-user-title {
                    height: 94rpx;
                    line-height: 94rpx;
                    font-size: 36rpx;
                    color: #000;
                    margin-left: 40rpx;
                    font-weight: bold;
                    max-width: 300rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .charg-right {
                // width: 180rpx;
            }
            .charg-name {
                font-size: 46rpx;
            }
            .charg-price {
                font-size: 30rpx;
            }
        }
        .card-active {
            border: 2rpx solid #007aff;
        }
    }
    .content {
        height: 125rpx;
        margin: 60rpx auto;
        font-size: 4rpx;
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
    .del-popup {
        // height: ;
        background-color: #fff;
        margin: 20rpx 0;
        .title {
            height: 80rpx;
            text-align: center;
            display: block;
            line-height: 80rpx;
        }
        .foot {
            padding: 0 20rpx;
            display: flex;
            // bottom: 20rpx;
            justify-content: space-around;
            .foot-btn {
                width: 40%;
            }
        }
    }
}
</style>
<style lang="scss">
.chargPointMember {
    .charg-right {
        display: flex;
        justify-content: center;
        align-items: center;
        .charg-btn {
            button {
                height: 60rpx;
                line-height: 60rpx;
                font-size: 24rpx;
                background-color: rgba(247, 68, 68, 1);
            }
        }
    }
}
</style>
