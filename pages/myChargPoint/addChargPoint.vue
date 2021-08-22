<template>
    <view class="addChargPoint">
        <view class="charg-card">
            <view class="charg-title">
                <span class="textName">桩名称：</span>
                <input
                    type="text"
                    value=""
                    placeholder="请输入桩名称"
                    class="perInput"
                    v-model="params.name"
                    :disabled="addressFlag && !editFlag"
                />
            </view>
            <view class="charg-title">
                <span class="textName">sn码：</span>
                <input
                    type="text"
                    value=""
                    placeholder="请输入sn码"
                    class="perInput"
                    v-model.trim="params.sn"
                    :disabled="editFlag"
                />
                <view class="saoma" v-if="!editFlag">
                    <img
                        class="s-icon"
                        src="@/static/saomiao.png"
                        @tap="scanCodeSN()"
                    />
                </view>
            </view>
            <view class="charg-title">
                <span class="textName">注册码：</span>
                <input
                    type="text"
                    value=""
                    placeholder="请输入注册码"
                    class="perInput"
                    v-model.trim="params.code"
                    @blur="codeValidate()"
                    :disabled="editFlag"
                />
                <view class="saoma" v-if="!editFlag">
                    <img
                        class="s-icon"
                        src="@/static/saomiao.png"
                        @tap="scanCode()"
                    />
                </view>
            </view>
            <view class="content">
                <view class="item" v-if="addressFlag || editFlag"
                    >区域：<span
                        >{{ params.provinceName }}{{ params.cityName
                        }}{{ params.areaName }}</span
                    ></view
                >
                <view class="item" @tap="regionVisible = true" v-else
                    >区域：<span>{{ result.result }} </span
                    ><span
                        class="arrow-bottom"
                        v-if="result.result == '请选择区域'"
                    ></span
                ></view>
            </view>
            <view class="charg-opinion">
                <span class="textName">详细地址：</span>
                <textarea
                    type="text"
                    value=""
                    :maxlength="maxlength"
                    placeholder="请输入您的详细地址"
                    class="opinionText"
                    v-model="params.address"
                    :disabled="addressFlag || editFlag"
                />
            </view>
        </view>
        <view class="foot">
            <span class="add-btn" @tap="edit" v-if="editFlag">提交修改</span>
            <span class="add-btn" @tap="add" v-else>添加充电桩</span>
        </view>
        <w-picker
            :visible.sync="regionVisible"
            mode="region"
            :value="defaultRegion"
            default-type="value"
            :hide-area="false"
            @confirm="onConfirm($event, 'region')"
            @cancel="onCancel"
            ref="region"
        ></w-picker>
    </view>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker.vue'

const defaultparams = {
    openId: uni.getStorageSync('openID'),
    address: '',
    areaId: '',
    areaName: '',
    cityId: '',
    cityName: '',
    code: '',
    name: '',
    provinceId: '',
    provinceName: '',
    sn: ''
}
export default {
    name: 'addChargPoint',
    components: {
        wPicker
    },
    data() {
        return {
            params: { ...defaultparams },
            regionVisible: false,
            result: {
                result: '请选择区域'
            },
            defaultRegion: ['150000', '150100', '150103'],
            addressFlag: false,
            editFlag: false
        }
    },
    onLoad(option) {
        //option会序列化上个页面传递的参数
        if (option.code) {
            this.editFlag = true
            this.getAddress(option.code)
            this.params.sn = option.sn
            this.params.code = option.code
        } else {
            this.editFlag = false
        }
    },
    methods: {
        onConfirm(res) {
            this.result = res
            this.params.provinceId = this.result.obj.province.value
            this.params.cityId = this.result.obj.city.value
            this.params.areaId = this.result.obj.area.value
            this.params.provinceName = this.result.obj.province.label
            this.params.cityName = this.result.obj.city.label
            this.params.areaName = this.result.obj.area.label
        },
        onCancel() {},
        scanCode() {
            // 允许从相机和相册扫码
            let vm = this
            uni.scanCode({
                onlyFromCamera: true,
                success: function (res) {
                    vm.params.code = res.result
                    vm.getAddress(res.result)
                },
                fail: res => {
                    uni.showToast({
                        title: '获取条码失败',
                        icon: 'none'
                    })
                    console.log('失败', res) //code
                }
            })
        },
        scanCodeSN() {
            // 允许从相机和相册扫码
            let vm = this
            uni.scanCode({
                onlyFromCamera: true,
                success: function (res) {
                    vm.params.sn = res.result.replace('SN', '')
                },
                fail: res => {
                    uni.showToast({
                        title: '获取条码失败',
                        icon: 'none'
                    })
                    console.log('失败', res) //code
                }
            })
        },
        codeValidate() {
            if (this.params.code.length == 38) {
                this.getAddress(this.params.code)
            } else {
                uni.showToast({
                    title: '注册码位数应为38位',
                    icon: 'none'
                })
            }
        },
        async getAddress(code) {
            const { result: point } = await this.$http({
                url: this.$api.isExistAddress,
                method: 'GET',
                data: {
                    code: code
                }
            })
            if (point) {
                this.addressFlag = true
                this.result = point
                this.params = { ...this.params, ...point }
            } else {
                this.params = { ...defaultparams }
                this.addressFlag = false
                this.result.result = ' 请选择区域'
            }
        },
        async add() {
            if (!this.paramValidate()) {
                return
            }
            await this.$http({
                url: this.$api.binding,
                method: 'POST',
                data: this.params
            })
            uni.showToast({
                title: '绑定成功',
                icon: 'none'
            })
            setTimeout(function () {
                uni.switchTab({
                    url: '/pages/index/index'
                })
            }, 1000)
        },
        async edit() {
            if (this.params.name == '') {
                uni.showToast({
                    title: '桩名称不能为空',
                    icon: 'none'
                })
                return false
            }
            await this.$http({
                url: this.$api.update,
                method: 'POST',
                data: {
                    name: this.params.name,
                    code: this.params.code,
                    sn: this.params.sn
                }
            })
            uni.showToast({
                title: '修改成功',
                icon: 'none'
            })
            setTimeout(function () {
                uni.switchTab({
                    url: '/pages/index/index'
                })
            }, 1000)
        },
        paramValidate() {
            if (this.params.name == '') {
                uni.showToast({
                    title: '桩名称不能为空',
                    icon: 'none'
                })
                return false
            }
            if (this.params.code == '') {
                uni.showToast({
                    title: '注册码不能为空',
                    icon: 'none'
                })
                return false
            }
            if (this.params.code.length != 38) {
                uni.showToast({
                    title: '注册码应为38位',
                    icon: 'none'
                })
                return false
            }
            if (!this.params.sn) {
                uni.showToast({
                    title: 'sn码不能为空',
                    icon: 'none'
                })
                return false
            }
            if (this.params.sn.length != 11) {
                uni.showToast({
                    title: 'sn码应为11位',
                    icon: 'none'
                })
                return false
            }
            if (
                !this.params.provinceId ||
                !this.params.cityId ||
                !this.params.areaId
            ) {
                uni.showToast({
                    title: '区域不能为空',
                    icon: 'none'
                })
                return false
            }
            if (!this.params.openId) {
                uni.showToast({
                    title: '请重新打开该小程序，允许授权登录后体验完整功能',
                    icon: 'none'
                })
                return false
            }
            return true
        }
    },
    onPullDownRefresh() {
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }, 1000)
    }
}
</script>

<style lang="scss" scoped>
@import '@/asset/scss/common.scss';

.addChargPoint {
    height: 100vh;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    background-color: #fff !important;

    .charg-card {
        // background-color: #f7f7f7;
        padding-top: 20rpx;
        margin: 0 40rpx;
        display: flex;
        flex-direction: column;

        .charg-title {
            // margin-bottom: 40rpx;
            display: flex;
            align-items: center;
            line-height: 98rpx;
            height: 98rpx;
            border-bottom: 1rpx solid #e6e6e6;

            .textName {
                line-height: 98rpx;
                height: 98rpx;
                float: left;
                width: 170rpx;
                font-weight: bold;
            }

            .perInput {
                float: left;
                // width: 100%;
                height: 96rpx;
                background-color: #fff;
                // &::placeholder{
                //   color: red;
                // }
            }

            .saoma {
                height: 96rpx;
                width: 44rpx;

                .s-icon {
                    // margin: 300rpx;
                    width: 44rpx;
                    height: 44rpx;
                    position: relative;
                    margin-left: 80rpx;
                    margin-top: 26rpx;
                }
            }

            .select {
                padding: 20rpx;
                border: 1px solid #c8c7cc;
                margin-right: 20rpx;
            }

            .top {
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid #ccc;
                display: inline-flex;
                margin-left: 20rpx;
            }
        }

        .content {
            display: flex;
            align-items: center;
            line-height: 98rpx;
            height: 98rpx;
            border-bottom: 1rpx solid #e6e6e6;

            .item {
                height: 96rpx;
                font-weight: bold;

                span {
                    font-weight: normal;
                    right: 110rpx;
                    position: absolute;
                    color: rgba(119, 119, 119, 1);
                }

                .arrow-bottom {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    margin-top: 41rpx;
                    margin-right: -20rpx;
                    border-right: 1px solid rgba(119, 119, 119, 1);
                    border-bottom: 1px solid rgba(119, 119, 119, 1);
                    transform: rotate(-45deg);
                }
            }
        }

        .charg-opinion {
            .textName {
                line-height: 98rpx;
                height: 98rpx;
                float: left;
                width: 165rpx;
                font-weight: bold;
            }

            .perInput {
                float: left;
                height: 80rpx;
            }

            .opinionText {
                border-bottom: 2rpx #dedede solid;
                height: 100rpx;
                width: 100%;
                background-color: #fff;
            }
        }
    }

    .foot {
        margin-top: 170rpx;
        text-align: center;

        .add-btn {
            padding: 24rpx 116rpx;
            width: 445rpx;
            height: 135rpx;
            line-height: 116rpx;
        }
    }
}
</style>
