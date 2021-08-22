<template>
    <view class="feedbackInfo">
        <view class="charg-card">
            <view
                class="charg-item"
                v-for="(item, index) in chargList"
                :key="index"
            >
                <view class="charg-content" v-if="item.type == 0">
                    <view class="tip">
                        <span>问</span>
                    </view>
                    <view class="charg-price">{{ item.content }}</view>
                    <view class="charg-time"
                        >发布时间：{{ item.createTime }}</view
                    >
                </view>
                <view
                    class="charg-content"
                    v-else
                    style="background: rgba(231, 237, 255, 1)"
                >
                    <view class="tip" style="background: rgba(255, 163, 75, 1)">
                        <span>答</span>
                    </view>
                    <view
                        class="charg-prices"
                        style="background: rgba(231, 237, 255, 1)"
                        >{{ item.content }}</view
                    >
                </view>
            </view>
        </view>
        <view
            class="opinion"
            v-if="status == 1 && chargList[chargList.length - 1].type == 1"
        >
            <view>
                <textarea
                    type="text"
                    value=""
                    :maxlength="maxlength"
                    placeholder="请输入您的要回复的内容"
                    class="opinionText"
                    v-model="content"
                />
            </view>
            <view class="foot">
                <button
                    class="change-btn foot-btn big-bottom-btn"
                    type="primary"
                    @tap="reply"
                >
                    回复
                </button>
                <button
                    class="change-btn foot-btn big-bottom-btn"
                    type="primary"
                    @tap="finish"
                >
                    完成
                </button>
            </view>
        </view>
        <view class="" v-else>
            <view class="foot">
                <button
                    class="change-btn foot-btn big-btn big-bottom-btn"
                    type="primary"
                    @tap="finish"
                >
                    完成
                </button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            content: '',
            status: 1,
            chargList: [
                // {
                //   id: 1,
                //   type: 0,
                //   content: "检查充电桩接口",
                // },
                // {
                //   id: 1,
                //   type: 1,
                //   content: "充电桩怎么绑定",
                // },
                // {
                //   id: 1,
                //   type: 0,
                //   content: "检查充电桩接口",
                // },
                // {
                //   id: 1,
                //   type: 1,
                //   content: "检查充电桩接口",
                // },
                // {
                //   id: 1,
                //   type: 0,
                //   content: "检查充电桩接口",
                // },
            ]
        }
    },
    onLoad(option) {
        //option会序列化上个页面传递的参数
        this.id = option.id
        this.status = option.status
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
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            try {
                const { result } = await this.$http({
                    url: this.$api.feedbackGet + '/' + this.id + '/get',
                    method: 'GET',
                    data: {}
                })
                uni.hideLoading()
                if (result == null || result.length == 0) {
                    this.chargList = []
                    return wx.showToast({
                        title: '暂无数据', // 标题
                        icon: 'none' // 图标类型，默认success
                    })
                }
                this.chargList = result
            } catch (error) {
                uni.hideLoading()
            }
        },
        async reply() {
            if (this.content == '') {
                uni.showToast({
                    title: '请输入您的要回复的内容',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            await this.$http({
                url: this.$api.feedbackReply,
                method: 'POST',
                data: {
                    id: this.id,
                    content: this.content
                }
            })
            this.content = ''
            this.getData()
        },
        async finish() {
            await this.$http({
                url: this.$api.feedbackGet + '/' + this.id + '/complete',
                method: 'POST'
            })
            uni.showToast({
                title: "操作成功",
                icon: 'none',
                duration: 2000
            })
            setTimeout(function () {
                uni.navigateTo({
                    url: '/pages/feedback/feedback'
                })
            }, 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/asset/scss/common.scss';

.feedbackInfo {
    width: 100wh;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    height: 100vh;

    .charg-card {
        // height: 70vh;
        background-color: #f7f7f7;
        overflow: auto;
        padding: 0 20rpx;
        flex: 1;
        .charg-item {
            margin-bottom: 30rpx !important;
            border-radius: 5rpx !important;
            position: relative;
            background-color: #fff;
            .charg-content {
                display: flex;
                width: 100%;
                margin-top: 20rpx;
                padding-top: 30rpx;
                justify-content: center;
                border-radius: 5rpx;
                min-height: 140rpx;
                flex-direction: column;
                .tip {
                    position: absolute;
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
                .charg-title {
                    // font-size: 46rpx;
                    // font-weight: bold;
                }
                .charg-price {
                    // text-indent: 2em;
                    color: #333333;
                    font-size: 30rpx;
                    margin-left: 20rpx;
                    margin-bottom: 15rpx;
                    font-weight: bold;
                }
                .charg-prices {
                    // text-indent: 2em;
                    color: rgba(51, 51, 51, 1);
                    font-size: 30rpx;
                    margin-left: 20rpx;
                    margin-bottom: 15rpx;
                }
                .charg-time {
                    font-size: 24rpx;
                    margin-left: 20rpx;
                    color: #777777;
                }
            }
        }
    }
    .opinion {
        height: 30vh;
        border-top: 10rpx #f0f0f0 solid;
        background-color: #ffffff;
        .opinionText {
            margin: 0 20rpx;
            border-bottom: 2rpx #dedede solid;
            // border-top: 2rpx #dedede solid;
            padding: 20rpx 0;
            height: 260rpx;
            width: 710rpx;
        }
        .foot {
            @include fixed-bottom;
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
    margin: 20rpx 20rpx 0 20rpx;
}
</style>
