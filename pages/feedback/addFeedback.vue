<template>
    <view class="addFeedback">
        <view class="top" @tap="openSelect">
            <text>{{ name }}</text>
            <span class="arrow-bottom"></span>
        </view>
        <view class="foot-top"></view>
        <view class="charg-card">
            <view class="charg-title">
                <input
                    type="text"
                    placeholder="问题标题"
                    class="uni-input perInput"
                    v-model="params.title"
                />
            </view>
            <view class="foot-top"></view>
            <view class="charg-opinion">
                <textarea
                    type="text"
                    :maxlength="maxlength"
                    placeholder="请反馈你遇到的问题"
                    class="textarea opinionText"
                    v-model="params.content"
                />
            </view>
        </view>
        <view class="foot">
            <span class="add-btn" @tap="add">提交</span>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            params: {
                openId: uni.getStorageSync('openID'),
                title: '',
                content: '',
                pileId: ''
            },
            name: ''
        }
    },
    onLoad() {
        const pileData = uni.getStorageSync('pileData')
        if (pileData) {
            this.name = pileData.name
            this.params.pileId = pileData.id
            this.currentCharg = pileData
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
        async add() {
            if (this.params.pileId == '') {
                uni.showToast({
                    title: '充电桩不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            if (this.params.title == '') {
                uni.showToast({
                    title: '标题不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            if (this.params.content == '') {
                uni.showToast({
                    title: '意见不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            const { result } = await this.$http({
                url: this.$api.feedbackAdd,
                method: 'POST',
                data: this.params
            })
            uni.showToast({
                title: result,
                icon: 'none',
                duration: 2000
            })
            uni.navigateTo({
                url: '/pages/feedback/feedback'
            })
        },
        openSelect() {
            uni.navigateTo({
                url: '/pages/myChargPoint/selectCharg'
            })
        },
        confirm(data) {
            this.params.code = data.code
            this.name = data.name
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/asset/scss/common.scss';

.addFeedback {
    width: 100wh;
    background-color: transparent;
    padding: 20rpx;
    .top {
        display: flex;
        align-items: center;
        padding: 20rpx;
        height: 84rpx;
        justify-content: space-between;
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
            transform: rotate(-45deg);
            margin-top: -5rpx;
        }
    }
    .foot-top {
        width: 100%;
        height: 20rpx;
        background: transparent;
    }
    .charg-card {
        // background-color: #f7f7f7;
        // padding-top: 20rpx;
        // margin: 0 40rpx;
        display: flex;
        flex-direction: column;
        .foot-top {
            width: 100%;
            height: 20rpx;
            background: #f7f7f7;
        }
        .charg-title {
            background-color: #fff;
            // margin-bottom: 40rpx;
            .textName {
                line-height: 80rpx;
                height: 80rpx;
                float: left;
                width: 150rpx;
            }
            .perInput {
                float: left;
                width: 100%;
                height: 80rpx;
                box-sizing: border-box;
                padding: 20rpx;
                background-color: #fff;
            }
        }

        .charg-opinion {
            .textName {
                line-height: 80rpx;
                height: 80rpx;
                float: left;
                width: 150rpx;
            }
            .perInput {
                float: left;
                height: 80rpx;
            }
            .opinionText {
                // margin: 0 20rpx;
                // border-bottom: 2rpx #dedede solid;
                // border-top: 2rpx #dedede solid;
                box-sizing: border-box;
                padding: 20rpx;
                height: 360rpx;
                width: 100%;
                background-color: #fff;
            }
        }
    }
    .foot {
        margin-top: 70rpx;
        text-align: center;
        background-color: transparent;
        .add-btn {
            padding: 24rpx 150rpx;
            width: 445rpx;
            height: 135rpx;
            line-height: 116rpx;
            font-size: 44rpx;
        }
    }
}
</style>
