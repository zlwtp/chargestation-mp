<template>
  <view class="faultInfo">
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
        :isfaultInfo="true"
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
import chargInfo from "@/components/mycomponents/chargPointSub/chargInfo.vue";

export default {
  name: "faultInfo",
  components: { chargInfo },
  data() {
    return {
      isStart: true,
      name: "",
      code: "",
      chargList: [],
      showFlag: true,
    };
  },
  mounted() {},
  onLoad(option) {},
  methods: {
    getData() {
      let vm = this;
      if (vm.code == "") {
        vm.chargList = [];
        return wx.showToast({
          title: "当前没有选中桩", // 标题
          icon: "none", // 图标类型，默认success
          duration: 2000, // 提示窗停留时间，默认1500ms
        });
      }
      uni.showLoading({
        title: "加载中",
        mask: true,
      });
      try {
        this.$http({
          url: vm.$api.malfunctions,
          method: "GET",
          data: {
            code: vm.code,
          },
        }).then((res) => {
          uni.hideLoading();
          if (res.data.result == null || res.data.result.length == 0) {
            vm.chargList = [];
            return wx.showToast({
              title: "暂无数据", // 标题
              icon: "none", // 图标类型，默认success
              duration: 2000, // 提示窗停留时间，默认1500ms
            });
          }
          vm.chargList = res.data.result;
        });
      } catch (error) {
        uni.hideLoading();
      }
    },
    openSelect() {
      uni.navigateTo({
        url: "/pages/myChargPoint/selectCharg",
      });
    },
    confirm(data) {
      this.code = data.code;
      this.name = data.name;
      this.getData();
    },
  },
  onShow() {
    if (uni.getStorageSync("pileData")) {
      this.confirm(uni.getStorageSync("pileData"));
    } else {
      uni.showToast({
        title: "请先添加充电桩",
        icon: "none",
        duration: 2000,
      });
    }
  },
  onPullDownRefresh() {
    console.log("refresh");
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
@import "@/asset/scss/common.scss";
.faultInfo {
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
