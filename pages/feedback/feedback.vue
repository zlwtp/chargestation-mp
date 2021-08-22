<template>
    <view class="feedback">
        <view class="charg-card">
            <view class="charg-item">
                <t-slide
                    ref="slides"
                    @edit="edit"
                    @del="del"
                    :btnArr="btnArr"
                    @itemClick="itemClick"
                    key="slides"
                    v-if="showSlide"
                >
                    <template v-slot:default="{ item }">
                        <view class="charg-content" @tap="goto(item)">
                            <view class="tip"> <span>问</span></view>

                            <view class="charg-price">{{ item.title }}</view>
                            <view class="charg-time"
                                >发布时间：{{ item.createTime }}</view
                            >
                            <view class="tip-icon"></view>
                        </view>
                    </template>
                </t-slide>
            </view>
        </view>
        <view style="height: 70rpx; background-color: transparent"></view>
        <view class="foot">
            <button class="change-btn big-bottom-btn" type="primary" @tap="add">
                新增
            </button>
        </view>
        <uni-popup ref="delPopup" type="bottom">
            <view class="del-popup">
                <text class="title">请确定是否删除{{ title }}</text>
                <text class="title"></text>
                <view class="foot">
                    <button
                        class="change-btn foot-btn"
                        type="primary"
                        @tap="delConfirm"
                    >
                        确定
                    </button>
                    <button
                        class="change-btn foot-btn"
                        type="primary"
                        @tap="delClose"
                    >
                        取消
                    </button>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
/* 引用 */
import tSlide from '@/components/t-slide/t-slide.vue'
export default {
    components: { tSlide },
    data() {
        return {
            openId: uni.getStorageSync('openID'),
            id: '',
            title: '',
            chargList: [],
            btnArr: [
                {
                    name: '删除',
                    background: '#ff5500',
                    color: '#fff',
                    events: 'del'
                }
            ],
            showSlide: true
        }
    },
    onLoad() {
        this.getFeedbackList()
    },
    onPullDownRefresh() {
        this.getFeedbackList()
        uni.showToast({
            title: '刷新',
            icon: 'none'
        })
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }, 1000)
    },
    methods: {
        goto(item) {
            uni.navigateTo({
                url: `/pages/feedback/feedbackInfo?id=${item.id}&status=${item.status}`
            })
        },
        add() {
            uni.navigateTo({
                url: '/pages/feedback/addFeedback'
            })
        },
        async getFeedbackList() {
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            try {
                const { result } = await this.$http({
                    url: this.$api.feedbackList,
                    method: 'GET',
                    data: {
                        openId: this.openId
                    }
                })
                uni.hideLoading()
                if (result == null || result.length == 0) {
                    this.chargList = []
                    this.showSlide = false
                    return wx.showToast({
                        title: '暂无数据', // 标题
                        icon: 'none', // 图标类型，默认success
                        duration: 2000 // 提示窗停留时间，默认1500ms
                    })
                }
                this.showSlide = true
                this.chargList = result
                this.$nextTick(() => {
                    this.$refs.slides.assignment(this.chargList)
                })
            } catch (error) {
                uni.hideLoading()
            }
        },
        //点击单行
        itemClick(data) {},
        //删除
        del(data) {
            this.id = data.id
            this.title = data.title
            this.$refs.delPopup.open()
        },
        delClose() {
            this.$refs.delPopup.close()
        },
        async delConfirm() {
            await this.$http({
                url: this.$api.feedbackGet + '/' + this.id,
                method: 'DELETE',
                data: {}
            })
            uni.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
            })
            this.getFeedbackList()
            this.delClose()
        },
        //编辑
        edit(data) {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/asset/scss/common.scss';

.feedback {
    width: 100wh;
    background-color: transparent;
    padding: 0 28rpx;
    overflow: auto;
    .charg-card {
        background-color: transparent;
        .charg-item {
            margin-bottom: 50rpx !important;
            border-radius: 5rpx !important;
            background-color: transparent;

            .charg-content {
                // display: flex;
                width: 100%;
                height: 100%;
                // align-items: center;
                // justify-content: center;
                flex-direction: column;
                .tip {
                    position: relative;
                    top: 0rpx;
                    left: 0rpx;
                    background: rgba(80, 120, 250, 1);
                    width: 60rpx;
                    height: 40rpx;
                    border-radius: 2rpx 0 2rpx 0;
                    text-align: center;
                    line-height: 40rpx;
                    span {
                        font-size: 24rpx;
                        color: #ffffff;
                    }
                }
                .tip-icon {
                    position: absolute;
                    top: 50%;
                    right: 20rpx;
                    transform: translateY(-50%);
                    background: rgba(255, 30, 30, 1);
                    width: 14rpx;
                    height: 14rpx;
                    border-radius: 14rpx;
                }
                .charg-title {
                    font-size: 46rpx;
                    font-weight: bold;
                }
                .charg-price {
                    color: #333333;
                    font-size: 30rpx;
                    margin-left: 20rpx;
                    margin-bottom: 15rpx;
                    font-weight: bold;
                }
                .charg-time {
                    font-size: 24rpx;
                    margin-left: 20rpx;
                    color: #777777;
                }
            }
        }
    }
    .foot {
        @include fixed-bottom;
        padding: 0 20rpx;
    }
    /deep/.t-slide-box {
        border: 0rpx solid #ccc;
        margin-top: 30rpx;
        background-color: #ffffff;
        view {
            background-color: unset;
        }
    }
    .del-popup {
        margin: 80rpx 0;
        view {
            background-color: #ffffff !important;
        }
        .title {
            height: 80rpx;
            text-align: center;
            display: block;
            line-height: 80rpx;
            background-color: #ffffff !important;
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
.big-bottom-btn {
    height: 73rpx;
    line-height: 73rpx;
    margin: 20rpx 0 0 0;
}
</style>
<style lang="scss">
.feedback {
    /deep/view {
        background-color: unset;
    }
    .t-slide-area {
        height: 180rpx !important;
    }
}
</style>
