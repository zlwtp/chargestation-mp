<template>
    <view class="commonProblem">
        <view class="charg-card">
            <view
                class="charg-item"
                v-for="(item, index) in chargList"
                :key="index"
            >
                <view class="charg-content">
                    <view class="charg-title">{{ item.question }}</view>
                    <view class="charg-price">{{ item.answer }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            chargList: []
        }
    },
    onLoad() {
        this.getData()
    },
    onPullDownRefresh() {
        this.getData()
        uni.showToast({
            title: '刷新',
            icon: 'none',
            duration: 2000
        })
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }, 1000)
    },
    methods: {
        async getData() {
            const { result } = await this.$http({
                url: this.$api.faqList,
                method: 'GET',
                data: {}
            })
            if (result == null || result.length == 0) {
                this.chargList = []
                return wx.showToast({
                    title: '暂无数据', // 标题
                    icon: 'none', // 图标类型，默认success
                    duration: 2000 // 提示窗停留时间，默认1500ms
                })
            }
            this.chargList = result
        }
    }
}
</script>

<style lang="scss" scoped>
.commonProblem {
    width: 100wh;
    background-color: transparent;
    padding: 0 28rpx;
    overflow: auto;
    .charg-card {
        background-color: #f7f7f7;
        .charg-item {
            margin-bottom: 50rpx !important;
            border-radius: 5rpx !important;
            background-color: #fff;
            .charg-content {
                // display: flex;
                width: 100%;
                height: 100%;
                padding: 28rpx 24rpx;
                // margin: 20rpx 0;
                // position: relative;
                // border-radius: 5rpx;
                // border: 2rpx solid #ccc;
                // min-height: 170rpx;
                flex-direction: column;
                .charg-title {
                    font-size: 30rpx;
                    font-weight: bold;
                    margin-bottom: 12rpx;
                    color: #333333;
                }
                .charg-price {
                    font-size: 24rpx;
                    color: #777777;
                    line-height: 48rpx;
                }
            }
        }
    }
    .content {
        height: 125rpx;
        margin: 60rpx auto;
        font-size: 4rpx;
    }
}
</style>
