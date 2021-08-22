<template>
    <view class="chargHistory">
        <view class="top" v-if="showFlag">
            <view class="top-content" @tap="openSelect">
                <text>{{ name }}</text>
                <span class="arrow-bottom"></span>
            </view>
        </view>
        <view class="charg-card">
            <charg-info
                class="charg-item"
                :chargInfo="item"
                :isfaultInfo="false"
                :powerShow="powerShow"
                v-for="(item, index) in chargList"
                :key="index"
            ></charg-info>
        </view>
        <view class="tips">
            <span>*</span><span>只展示三个月内最近10条记录</span>
        </view>
        <view style="height: 70rpx; background-color: transparent"></view>
    </view>
</template>

<script>
import chargInfo from '@/components/mycomponents/chargPointSub/chargInfo.vue'
export default {
    name: 'chargHistory',
    components: { chargInfo },
    data() {
        return {
            name: '',
            code: '',
            chargList: [],
            showFlag: true,
            showList: false,
            powerShow: false
        }
    },
    onShow() {
        //选择桩后刷新数据
        this.showList = false
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
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }, 1000)
    },
    methods: {
        async getData() {
            if (this.code == '') {
                this.chargList = []
                return wx.showToast({
                    title: '当前没有选中桩', // 标题
                    icon: 'none', // 图标类型，默认success
                    duration: 2000 // 提示窗停留时间，默认1500ms
                })
            }
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            if (this.code.indexOf('09') == 0 || this.code.indexOf('03') == 0) {
                this.powerShow = false
            } else {
                this.powerShow = true
            }
            try {
                const { result } = await this.$http({
                    url: this.$api.chargeRecords,
                    method: 'GET',
                    data: {
                        code: this.code
                    }
                })
                uni.hideLoading()
                this.showList = true
                if (result == null || result.length == 0) {
                    this.chargList = []
                    return wx.showToast({
                        title: '暂无数据', // 标题
                        icon: 'none', // 图标类型，默认success
                        duration: 2000 // 提示窗停留时间，默认1500ms
                    })
                }
                this.chargList = result
            } catch (error) {
                uni.hideLoading()
            }
        },
        openSelect() {
            uni.navigateTo({
                url: '/pages/myChargPoint/selectCharg'
            })
        },
        confirm(data) {
            this.code = data.code
            this.name = data.name
            if (this.code.indexOf('09') == 0 || this.code.indexOf('03') == 0) {
                this.powerShow = false
            } else {
                this.powerShow = true
            }
            this.getData()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/asset/scss/common.scss';
.chargHistory {
    height: 100vh;
    background-color: rgba(248, 248, 248, 1);
    .top {
        display: flex;
        align-items: center;
        padding-left: 34rpx;
        height: 84rpx;
        background-color: #fff;
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
        margin-top: 20rpx;
        background-color: #f7f7f7;
        padding: 0 20rpx;
        .charg-item {
            margin-bottom: 50rpx !important;
            border-radius: 5rpx !important;
        }
    }
    .tips {
        background-color: transparent;
        text-align: center;
        margin-top: 42rpx;
        span {
            color: rgba(51, 51, 51, 1);
            font-size: 24rpx;
            &:first-child {
                color: rgba(243, 49, 49, 1);
            }
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
}
</style>
