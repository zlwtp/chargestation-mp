<template>
    <view class="appoint-add">
        <view class="appoint-card">
            <view class="appoint-content">
                <span>选择开始时间</span>
                <view
                    class="time-btn"
                    @click="onShowDatePicker('time', 'beginTime')"
                >
                    {{ params.beginTime }}
                    <span style="margin-left: 10rpx"> ></span>
                </view>
            </view>
            <view class="appoint-content">
                <span>选择结束时间</span>
                <view
                    class="time-btn"
                    @click="onShowDatePicker('time', 'endTime')"
                >
                    {{ params.endTime }}
                    <span style="margin-left: 10rpx"> ></span>
                </view>
            </view>
        </view>
        <view class="appoint-card">
            <view class="top">重复</view>
            <view class="date-content">
                <view
                    :class="item.select ? 'item select' : 'item'"
                    v-for="(item, index) in menuList"
                    :key="index"
                    @click="changeMenu(index)"
                    >{{ item.name }}</view
                >
            </view>
        </view>
        <view class="appoint-card">
            <view class="top">波谷电价时段</view>
            <view class="price-content">
                <view
                    :class="index == priceCurrent ? 'item select' : 'item'"
                    v-for="(item, index) in priceList"
                    :key="index"
                    @click="changePrice(index)"
                    :style="index > 2 && !showMore ? 'display: none;' : ''"
                >
                    <span>{{ item.timename }}</span>
                    <span>{{ item.priceNum }}元</span></view
                >
            </view>
            <view class="down" v-if="priceList.length > 3">
                <img src="@/static/down.png" @tap="show()" />
            </view>
        </view>
        <view class="tip">
            <span>*</span><span>请确保已向当地供电局申请了波谷电价计费</span>
        </view>
        <view class="foot">
            <span class="add-btn" @tap="add">保存</span>
        </view>
        <view style="height: 70rpx; background-color: unset"></view>
        <uni-popup ref="showPicker" type="bottom">
            <timeSub
                :show="showPicker"
                :showFull="showFull"
                :type="type"
                :value="value"
                :show-tips="true"
                :show-seconds="false"
                @confirm="onSelected"
                @cancel="onSelected"
                @full="full"
            ></timeSub>
        </uni-popup>
    </view>
</template>

<script>
import timeSub from '@/components/mycomponents/chargPointSub/timeSub.vue'

export default {
    name: 'appoint-add',
    components: { timeSub },
    data() {
        return {
            isStart: true,
            name: '',
            code: '',
            priceCurrent: 999,
            timePop: false,
            isEdit: false,
            params: {
                openId: uni.getStorageSync('openID'),
                active: false, //是否激活
                id: '',
                activeDay: '',
                endTime: '00:00',
                beginTime: '00:00',
                name: '', //预约计划的自定义名称
                pileId: '', //	充电桩ID
                appointId: '', //云平台充电计划ID
                oftenUsed: false //是否常用的设置
            },
            menuList: [
                {
                    name: '周一',
                    select: false
                },
                {
                    name: '周二',
                    select: false
                },
                {
                    name: '周三',
                    select: false
                },
                {
                    name: '周四',
                    select: false
                },
                {
                    name: '周五',
                    select: false
                },
                {
                    name: '周六',
                    select: false
                },
                {
                    name: '周日',
                    select: false
                }
            ],
            priceList: [],
            priceParam: {},
            showMore: false,
            showFull: false,
            showPicker: false,
            type: 'time',
            value: ''
        }
    },
    onLoad(option) {
        const pileData = uni.getStorageSync('pileData')
        if (pileData) {
            this.params.pileId = pileData.id
            this.code = pileData.code
            this.name = pileData.name
        } else {
            uni.showToast({
                title: '请先添加充电桩',
                icon: 'none',
                duration: 2000
            })
        }
        if (option.datas) {
            this.isEdit = true
            let data = JSON.parse(decodeURIComponent(option.datas))
            this.name = data.name
            this.code = data.code
            for (const key in this.params) {
                if (key !== 'apenId') {
                    this.params[key] = data[key]
                    if (key === 'endTime' && data[key] == '') {
                        this.params[key] = '充满为止'
                    }
                }
            }

            //时间回显
            let a = parseInt(this.params.activeDay, 2)
            a = parseInt(this.params.activeDay, 10).toString(2)
            while (a.length < 7) {
                a = '0' + a
            }
            let _a = a.split('')
            for (let index = 0; index < _a.length; index++) {
                if (_a[index] == '1') {
                    this.menuList[index].select = true
                }
            }
            //时间回显
        }

        this.getPrice()
    },
    onPullDownRefresh() {
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }, 1000)
    },
    methods: {
        // 获取电价
        async getPrice() {
            const { result } = await this.$http({
                url: this.$api.isExistAddress,
                method: 'GET',
                data: {
                    code: uni.getStorageSync('pileData').code
                }
            })
            let point = result
            let params = {
                provinceId: '',
                cityId: '',
                provinceName: '',
                cityName: ''
            }
            if (point) {
                for (const key in params) {
                    params[key] = point[key]
                }
            }

            const { result: list } = awaitthis.$http({
                url: this.$api.electricityPrice,
                method: 'GET',
                data: params
            })
            this.priceList = []
            if (list.length >= 3) {
                for (let i = 0; i < list.length; i++) {
                    let t = ''
                    let price = ''
                    if (list[i].property == 1) {
                        if (i == 0) {
                            t = t + list[list.length - 1].periodTime + ':00-'
                            t = t + list[i].periodTime + ':00'
                            price = list[i].price
                        } else {
                            t = t + list[i - 1].periodTime + ':00-'
                            t = t + list[i].periodTime + ':00'
                            price = list[i].price
                        }
                        this.priceList.push({
                            timename: t,
                            priceNum: price
                        })
                    } else if (list[i].property == 11) {
                        if (i == 0) {
                            t = t + list[list.length - 1].periodTime + ':00-'
                            t = t + list[i].periodTime + ':00'
                            price = list[i].price
                        } else {
                            t = t + list[i - 1].periodTime + ':00-'
                            t = t + list[i].periodTime + ':00'
                            price = list[i].price
                        }
                        this.priceList.push({
                            timename: t,
                            priceNum: price
                        })
                    } else if (list[i].property == 21) {
                        if (i == 0) {
                            t = t + list[list.length - 1].periodTime + ':00-'
                            t = t + list[i].periodTime + ':00'
                            price = list[i].price
                        } else {
                            t = t + list[i - 1].periodTime + ':00-'
                            t = t + list[i].periodTime + ':00'
                            price = list[i].price
                        }
                        // bogus.push(a);
                        this.priceList.push({
                            timename: t,
                            priceNum: price
                        })
                    }
                }
            }
        },
        switch1Change: function (e) {
            this.params.oftenUsed = e.target.value
            this.params.active = e.target.value
        },
        changeMenu(index) {
            this.menuList[index].select = !this.menuList[index].select
        },
        changePrice(index) {
            this.priceCurrent = index
            let time = this.priceList[index].timename.split('-')
            this.params.endTime = time[1]
            this.params.beginTime = time[0]
        },
        show() {
            this.showMore = !this.showMore
        },
        openTimePop() {
            this.timePop = true
            this.$refs.timePop.open()
        },
        onShowDatePicker(type, time) {
            //显示
            if (time == 'beginTime') {
                this.showFull = false
            } else {
                this.showFull = true
            }
            this.time = time
            this.$refs.showPicker.open()
            this.showPicker = true
            this.value = this.params[time]
        },
        full() {
            this.params.endTime = '充满为止'
            this.showPicker = false
            this.$refs.showPicker.close()
        },
        onSelected(e) {
            //选择
            this.showPicker = false
            if (e) {
                this.params[this.time] = e.value
            }
            this.showPicker = false
            this.$refs.showPicker.close()
        },
        async add() {
            if (this.params.endTime == this.params.beginTime) {
                return wx.showToast({
                    title: '开始时间和结束时间不能一致', // 标题
                    icon: 'none', // 图标类型，默认success
                    duration: 2000 // 提示窗停留时间，默认1500ms
                })
            }
            let activeList = []
            this.menuList.forEach((item, index) => {
                if (item.select) {
                    activeList[index] = 1
                } else {
                    activeList[index] = 0
                }
            })
            let temp = activeList.join('')
            this.params.activeDay = parseInt(temp, 2).toString()
            let _params = this.params
            if (_params.endTime == '充满为止') {
                _params.endTime = ''
            }
            if (this.isEdit) {
                await this.$http({
                    url: this.$api.appointUpdate,
                    method: 'POST',
                    data: _params
                })
                uni.showToast({
                    title: '预约成功',
                    icon: 'none',
                    duration: 2000
                })
                setTimeout(function () {
                    uni.navigateTo({
                        url: '/pages/index/appointList'
                    })
                }, 1000)
            } else {
                await this.$http({
                    url: this.$api.appointAdd,
                    method: 'POST',
                    data: this.params
                })
                uni.showToast({
                    title: '预约成功',
                    icon: 'none',
                    duration: 2000
                })
                setTimeout(function () {
                    uni.navigateTo({
                        url: '/pages/index/appointList'
                    })
                }, 1000)
            }
        },
        paramValidate() {
            if (this.params.name == '') {
                uni.showToast({
                    title: '桩名称不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            if (this.params.code == '') {
                uni.showToast({
                    title: '桩编号不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            if (this.params.code.length != 38) {
                uni.showToast({
                    title: '桩编号应为38位',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            if (this.params.sn == '') {
                uni.showToast({
                    title: 'sn码不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            if (this.params.sn.length != 11) {
                uni.showToast({
                    title: 'sn码应为11位',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            if (
                this.params.provinceId == '' ||
                this.params.cityId == '' ||
                this.params.areaId == ''
            ) {
                uni.showToast({
                    title: '地区不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            return true
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/asset/scss/common.scss';
.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.appoint-add {
    height: 100vh;
    background-color: rgba(248, 248, 248, 1);
    padding: 0 28rpx;
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
    .appoint-card {
        margin-top: 20rpx;
        background-color: #fff;
        padding: 0 20rpx;
        border-radius: 15rpx;
        .appoint-item {
            margin-bottom: 50rpx !important;
            border-radius: 5rpx !important;
        }
        .appoint-content {
            height: 100rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &:first-child {
                border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
            }
            span {
                font-size: 28rpx;
                color: #333333;
            }
        }

        .appoint-switch {
            height: 94rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-size: 30rpx;
                color: #333333;
                font-weight: bold;
            }
        }
        .top {
            height: 100rpx;
            font-size: 36rpx;
            display: flex;
            align-items: center;
            color: rgba(51, 51, 51, 1);
            font-weight: bold;
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
        .date-content {
            display: flex;
            // justify-content: center;
            // align-items: center;
            flex-wrap: wrap;
            .item {
                width: 16%;
                height: 62rpx;
                border-radius: 8rpx;
                border: 2rpx solid rgba(224, 224, 224, 1);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 30rpx;
                color: rgba(119, 119, 119, 1);
                margin-right: 20rpx;
                margin-bottom: 24rpx;
            }
            .select {
                border-color: #3e69f4;
                color: #4b73f1;
            }
        }
        .price-content {
            display: flex;
            // justify-content: center;
            // align-items: center;
            flex-wrap: wrap;
            .item {
                width: 100%;
                height: 62rpx;
                padding: 0 22rpx;
                border-radius: 8rpx;
                border: 2rpx solid rgba(224, 224, 224, 1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 30rpx;
                color: rgba(119, 119, 119, 1);
                margin-right: 20rpx;
                margin-bottom: 24rpx;
                span {
                    color: rgba(119, 119, 119, 1);
                    font-size: 30rpx;
                    font-weight: normal;

                    &:last-child {
                        color: rgba(243, 49, 49, 1);
                        font-size: 28rpx;
                        font-weight: bold;
                    }
                }
            }
            .select {
                border-color: #3e69f4;
                font-weight: bold;

                span {
                    color: #4b73f1;
                    &:last-child {
                        color: rgba(243, 49, 49, 1);
                    }
                }
            }
        }
    }
    .tip {
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
        background-color: transparent;
        margin-top: 44rpx;
        text-align: center;
        .add-btn {
            padding: 24rpx 150rpx;
            width: 445rpx;
            height: 135rpx;
            line-height: 116rpx;
        }
    }
}
</style>
