<template>
  <view class="charg">
    <view class="bg"> </view>
    <view class="selectCharg">
      <scroll-view class="card-content" :scroll-y="true">
        <view
          class="charg-card"
          v-for="(item, index) in chargList"
          :key="index"
          @tap="selectCharg(item)"
        >
          <view class="charg-content">
            <view class="charg-icon">
              <img src="@/static/point-ico.png" />
            </view>
            <view class="charg-desc">
              <view class="top">
                <text>{{ item.name }}</text>
                <span>{{ item.type }}</span>
              </view>
              <view class="foot">
                <text> sn:{{ item.sn }}</text>
                <view v-if="item.expirationDate != null">
                  <i>到期时间：</i><span>{{ item.expirationDate }}</span>
                </view>
              </view>
            </view>
          </view>
          <view class="tip" style="background: #d1d1d1" v-if="item.status == 0">
            <span>未连接</span></view
          >
          <view class="tip" style="background: #2ec279" v-if="item.status == 1">
            <span>正在充电</span></view
          >
          <view class="tip" style="background: #fec200" v-if="item.status == 2">
            <span>待机</span></view
          >
          <view class="tip" style="background: #00ffd1" v-if="item.status == 3">
            <span>插枪</span></view
          >
          <view class="tip" style="background: #4f79ff" v-if="item.status == 4">
            <span>充电完成</span></view
          >
          <view class="tip" style="background: #415f9f" v-if="item.status == 5">
            <span>充电暂停</span></view
          >
          <view class="tip" style="background: #dc5351" v-if="item.status == 6">
            <span>无法获取充电状态</span></view
          >
          <view class="tip" style="background: #dc5351" v-if="item.status == 7">
            <span>充电故障</span></view
          >
          <view>
            <view class="switch" @tap.stop.prevent>
              <switch
                :checked="item.mainPile == 1"
                @change="switch1Change(item)"
                style="transform: scale(0.7)"
                :disabled="item.mainPile == 1"
              />
              <text>设置主桩</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      openId: uni.getStorageSync("openID"),
      chargList: [],
      currentData: [],
    };
  },
  onLoad() {},
  mounted() {},
  methods: {
    getData() {
      let vm = this;
      if (!uni.getStorageSync("openID")) {
        return;
      }
      this.$http({
        url: vm.$api.bindingList + "?openId=" + uni.getStorageSync("openID"),
        method: "GET",
        data: {},
      }).then((res) => {
        let type = [];
        if (res.data.result == null || res.data.result.length == 0) {
          uni.removeStorage({
            key: "pileData",
            success: function () {},
          });
          uni.setStorage({
            key: "chargNum",
            data: 0,
            success() {},
          });
          uni.setStorage({
            key: "chargType",
            data: [],
            success() {},
          });
          vm.chargList = [];
          return wx.showToast({
            title: "暂无数据", // 标题
            icon: "none", // 图标类型，默认success
            duration: 2000, // 提示窗停留时间，默认1500ms
          });
        }
        let data = res.data.result;
        data.forEach((item) => {
          type.push(item.type);
          if (item.code == uni.getStorageSync("pileData").code) {
            uni.setStorage({
              key: "pileData",
              data: item,
              success() {},
              fail() {},
            });
          }
        });
        uni.setStorage({
          key: "chargNum",
          data: res.data.result.length,
          success() {},
        });
        uni.setStorage({
          key: "chargType",
          data: vm.dedupe(type),
          success() {},
        });
        vm.chargList = res.data.result;
      });
    },
    selectCharg(item) {
      uni.setStorage({
        key: "pileData",
        data: item,
        success() {},
        fail() {},
      });
      uni.navigateBack({
        delta: 1,
      });
    },
    dedupe(array) {
      return Array.from(new Set(array));
    },
    close() {
      this.$emit("close");
    },
    currentInfo(data) {
      this.currentData = data;
    },
    moveHandle() {
      return;
    },
    switch1Change: function (item) {
      let vm = this;
      let param = {
        openId: uni.getStorageSync("openID"),
        code: item.code,
      };
      this.$http({
        url: this.$api.mainPile,
        method: "POST",
        data: param,
      }).then((res) => {
        if (res.data.code == 200) {
          uni.showToast({
            title: "更换成功",
            icon: "none",
            duration: 2000,
          });
          uni.setStorage({
            key: "pileData",
            data: item,
            success() {},
            fail() {},
          });
        }
        vm.getData();
      });
    },
  },
  onShow() {
    this.getData();
  },
  onPullDownRefresh() {
    this.getData();
    uni.showToast({
      title: "刷新",
      icon: "none",
      duration: 2000,
    });
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
@import "@/asset/scss/common.scss";
.charg {
  position: relative;
  .bg {
    height: 300rpx;
    width: 100%;
    position: fixed;
    top: 0;
    background: url("@/static/s-bg.png") no-repeat;
    background-size: 100% 100%;
  }
  .selectCharg {
    width: 100wh;
    background-color: #f7f7f7;
    border-radius: 24rpx 24rpx 0 0;
    padding: 0 24rpx;
    margin-top: 20rpx;
    .charg-card {
      height: 222rpx;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 34rpx;
      margin-bottom: 20rpx;
      position: relative;
      border-radius: 12rpx;
      .charg-item {
        margin-bottom: 50rpx !important;
        border-radius: 5rpx !important;
      }
      .charg-content {
        display: flex;
        width: 100%;
        border-radius: 12rpx;
        overflow: hidden;

        .charg-icon {
          width: 224rpx;
          height: 222rpx;
          padding: 24rpx;
        }
        .charg-desc {
          // flex: 1;
          padding: 20rpx 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .top {
            text {
              font-size: 32rpx;
              color: #333333;
              display: block;
              font-weight: bold;
            }
            // position: relative;
            span {
              display: inline-block;
              background: #4f79ff;
              border-radius: 2rpx;
              color: #ffffff;
              font-size: 20rpx;
              padding: 4rpx 8rpx;
              text-align: center;
            }
          }
          .foot {
            // display: flex;
            // flex-direction: column;
            text {
              font-size: 20rpx;
              color: #999999;
            }
            i {
              display: inline-block;
              font-size: 20rpx;
              color: #777777;
            }
            span {
              display: inline-block;
              font-size: 24rpx;
              color: #333333;
            }
          }
        }
      }
      .tip {
        position: absolute;
        top: 0rpx;
        right: 0rpx;
        background: #45d244;
        width: 126rpx;
        height: 44rpx;
        background: #2ec279;
        border-radius: 0 12rpx 0 12rpx;
        text-align: center;
        line-height: 40rpx;
        span {
          font-size: 24rpx;
          color: #ffffff;
        }
      }
      .switch {
        display: flex;
        justify-content: center;
        flex-direction: column;
        position: absolute;
        right: 22rpx;
        bottom: 24rpx;
        text {
          text-align: center;
          color: #333333;
          font-size: 20rpx;
        }
        // pointer-events: none;
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

    .foot {
      .foot-top {
        width: 100%;
        height: 16rpx;
        background: #f2f2f2;
      }
      .foot-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 112rpx;
        background: #ffffff;
      }
    }
  }
}
</style>
