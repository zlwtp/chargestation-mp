<template>
    <view class="appoint-add">
        <!-- <view class="charg-item" @touchmove.stop.prevent> -->
        <view class="charg-item">
            <t-slide
                ref="slide"
                @edit="edit"
                @del="del"
                :btnArr="btnArr"
                @itemClick="itemClick"
                key="slide"
                v-if="showSlide"
            >
                <template v-slot:default="{ item }">
                    <view class="appoint-card" @tap="itemClick(item)">
                        <view class="tip" v-if="false">
                            <span>常用设置</span></view
                        >
                        <view v-else style="height: 40rpx"> </view>
                        <view class="appoint-switch">
                            <view class="time">
                                <span v-if="item.endTime"
                                    >{{ item.beginTime }}——{{
                                        item.endTime
                                    }}</span
                                >
                                <span v-else
                                    >{{ item.beginTime }}——充满为止</span
                                >
                                <span class="full" v-if="item.endTime">{{
                                    item.differ
                                }}</span>
                            </view>
                            <view class="switch" @tap.stop.prevent>
                                <switch
                                    :checked="item.active"
                                    @change="switch1Change(item)"
                                    style="transform: scale(0.7)"
                                />
                            </view>
                        </view>
                        <view class="appoint-foot">
                            <span
                                >重复：{{
                                    item.activeDayShow || '仅此一次'
                                }}</span
                            >
                        </view>
                    </view>
                </template>
            </t-slide>
        </view>
        <view style="height: 142rpx; background-color: unset"></view>
        <view class="foot">
            <button class="change-btn" type="primary" @tap="add">新增</button>
        </view>
        <uni-popup ref="delPopup" type="center">
            <uni-popup-dialog @close="delClose" @confirm="delConfirm">
                <view class="del-popup">
                    <text class="title">请确定是否删除{{ title }}</text>
                </view>
            </uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue'
import tSlide from '@/components/t-slide/t-slide.vue'
import { NoToChinese, timeDifference } from '@/util'
export default {
    components: {
        MxDatePicker,
        tSlide
    },
    data() {
        return {
            openId: uni.getStorageSync('openID'),
            param: {
                code: '',
                endTime: '00:00',
                startTime: '00:00'
            },
            showPicker: false,
            time: '',
            id: '',
            title: '',
            type: 'time',
            value: '',
            chargList: [],
            btnArr: [
                {
                    name: '删除',
                    background: '#ff5500',
                    color: '#fff',
                    events: 'del'
                }
            ],
            dateList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            showSlide: true
        }
    },
    onLoad() {
        let vm = this
        uni.getStorage({
            key: 'openID',
            success(res) {
                vm.openId = vm.getAppointList()
            }
        })
    },
    onPullDownRefresh() {
        this.getAppointList()
        uni.showToast({
            title: '刷新',
            icon: 'none'
        })
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }, 1000)
    },
    methods: {
        add() {
            uni.navigateTo({
                url: '/pages/index/appoint'
            })
        },
        getDateType(num) {
            let a = parseInt(num, 2)
            a = parseInt(num, 10).toString(2)
            while (a.length < 7) {
                a = '0' + a
            }
            let _a = a.split('')
            let str = ''
            for (let index = 0; index < _a.length; index++) {
                if (_a[index] == '1') {
                    str += this.dateList[index] + '、'
                }
            }
            if (str == '') {
                return ''
            } else {
                return str.slice(0, str.length - 1)
            }
        },
        async getAppointList() {
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            try {
                const { result } = await this.$http({
                    url: this.$api.appointListByCode,
                    method: 'GET',
                    data: {
                        code: uni.getStorageSync('pileData').code
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
                this.chargList.forEach(item => {
                    if (item.activeDay == 0) {
                        item.activeDayShow = ''
                    } else {
                        item.activeDayShow = this.getDateType(item.activeDay)
                    }
                    if (item.endTime == '') {
                        item.differ = '充满为止'
                        return
                    }
                    let time = timeDifference(item.beginTime, item.endTime)
                    if (time[0] == 0) {
                        item.differ = NoToChinese(time[1]) + '分钟'
                    } else {
                        if (time[1] == 0) {
                            item.differ = NoToChinese(time[0]) + '小时'
                        } else {
                            item.differ =
                                NoToChinese(time[0]) +
                                '小时' +
                                NoToChinese(time[1]) +
                                '分钟'
                        }
                    }
                })
                this.$nextTick(() => {
                    this.$refs.slide.assignment(this.chargList)
                })
            } catch (error) {
                uni.hideLoading()
            }
        },
        //点击单行
        itemClick(data) {
            uni.navigateTo({
                url:
                    '/pages/index/appoint?datas=' +
                    encodeURIComponent(JSON.stringify(data))
            })
        },
        //删除
        del(data) {
            this.id = data.id
            this.title = data.name
            this.$refs.delPopup.open()
            // uni.showToast({
            //   title: "删除ID--" + data.id,
            //   icon: "none",
            // });open
        },
        delClose() {
            this.$refs.delPopup.close()
        },
        async delConfirm() {
            await this.$http({
                url: this.$api.appointDelete,
                method: 'POST',
                data: {
                    id: this.id
                }
            })
            uni.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
            })
            this.getAppointList()
            this.delClose()
        },
        //编辑
        edit(data) {},
        async switch1Change(item) {
            await this.$http({
                url: this.$api.appointUpdate,
                method: 'POST',
                data: {
                    active: !item.active,
                    activeDay: item.activeDay,
                    appointId: item.appointId,
                    beginTime: item.beginTime,
                    endTime: item.endTime,
                    id: item.id,
                    name: item.name,
                    oftenUsed: item.oftenUsed,
                    openId: item.openId,
                    // pileId: item.pileId,
                    pileId: item.active
                        ? item.pileId
                        : uni.getStorageSync('pileData').id
                }
            })
            uni.showToast({
                title: '操作成功',
                icon: 'none',
                duration: 2000
            })
            this.getAppointList()
        }
    },
    onShow() {
        this.getAppointList()
    },
    onUnload() {
        uni.switchTab({
            url: '/pages/index/index'
        })
    }
}
</script>

<style lang="scss" scoped>
@import '@/asset/scss/common.scss';
.appoint-add {
    height: 100vh;
    background-color: rgba(248, 248, 248, 1);
    padding: 0 28rpx;
    overflow: auto;
    .appoint-card {
        // margin-top: 20rpx;
        background-color: #fff;
        padding: 10rpx 30rpx;
        border-radius: 15rpx;
        // pointer-events: auto;
        .tip {
            position: relative;
            top: -10rpx;
            left: -30rpx;
            background: #45d244;
            width: 117rpx;
            height: 40rpx;
            border-radius: 12rpx 0 12rpx 0;
            text-align: center;
            line-height: 40rpx;
            span {
                font-size: 24rpx;
                color: #ffffff;
            }
        }
        .appoint-item {
            margin-bottom: 50rpx !important;
            border-radius: 5rpx !important;
        }

        .appoint-switch {
            height: 70rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-size: 40rpx;
                color: #333333;
                font-weight: bold;
            }
            .time {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .full {
                padding: 5rpx 16rpx;
                // width: 164rpx;
                height: 33rpx;
                background: #557dfb;
                border-radius: 6rpx;
                line-height: 33rpx;
                color: #fff;
                font-size: 24rpx;
                margin-left: 10rpx;
            }
            .switch {
                // pointer-events: none;
            }
        }
        .appoint-foot {
            height: 94rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: rgba(119, 119, 119, 1);

            span {
                font-size: 24rpx;
                color: rgba(119, 119, 119, 1);
                font-weight: bold;
            }
        }
        .down {
            height: 60rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 32rpx;
                height: 42rpx;
            }
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
    .foot {
        @include fixed-bottom;
        button {
            height: 112rpx !important;
            line-height: 112rpx !important;
        }

        .primary {
            color: rgba(62, 105, 244, 1);
        }
    }
    /deep/.t-slide-box {
        border: 0rpx solid #ccc;
        margin-top: 30rpx;
        background-color: #ffffff;
        border-radius: 10rpx;
        view {
            background-color: unset;
        }
    }
    .del-popup {
        view {
            background-color: #ffffff !important;
        }
        margin: 80rpx 0;
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
    .test {
        text-align: center;
        padding: 10px 0;
    }
}
</style>

<style lang="scss">
.appoint-add {
    /deep/view {
        background-color: unset;
    }
    .t-slide-area {
        height: 230rpx !important;
    }
}
</style>
