<template>
  <view class="myChargPoint">
    <view class="charg-card">
      <charg-card
        ref="charg"
        class="charg-item"
        :isShow="true"
        :chargList="chargList"
        @upData="upData"
      ></charg-card>
    </view>
    <view style="height: 70rpx"></view>
    <view class="foot">
      <button class="change-btn" type="primary" @tap="add">添加充电桩</button>
    </view>
  </view>
</template>

<script>
import chargCard from "@/components/mycomponents/chargPointSub/chargCard.vue";

export default {
  name: "myChargPoint",
  components: { chargCard },
  data() {
    return {
      openId: uni.getStorageSync("openID"),
      chargList: [
        {
          id: 1,
          isPrimary: true,
          name: "充电桩1",
          sn: 1515615,
          scn: 66666,
          bluetoothName: "bluetooth",
          bluetoothPwd: "*******",
          type: "CDZ-2020",
          time: "5天 12:20:20",
        },
        {
          id: 2,
          isPrimary: false,
          name: "充电桩2",
          sn: 1515615,
          scn: 66666,
          bluetoothName: "bluetooth",
          bluetoothPwd: "*******",
          type: "CDZ-2020",
          time: "5天 12:20:20",
        },
      ],
    };
  },
  onLoad() {
    // this.getData();
  },
  mounted() {},
  methods: {
    add() {
      uni.navigateTo({
        url: "/pages/myChargPoint/addChargPoint",
      });
    },
    getData() {
      let vm = this;
      this.$http({
        url: vm.$api.bindingList + "?openId=" + uni.getStorageSync("openID"),
        method: "GET",
        data: {},
      }).then((res) => {
        if (res.data.result == null || res.data.result.length == 0) {
          uni.removeStorage({
            key: "pileData",
            success: function () {
              // console.log("pileData删除成功");
            },
          });
          uni.setStorage({
            key: "chargNum",
            data: 0,
            success() {
              // console.log("chargNum缓存成功");
            },
          });
          return wx.showToast({
            title: "暂无数据", // 标题
            icon: "none", // 图标类型，默认success
            duration: 2000, // 提示窗停留时间，默认1500ms
          });
        }
      });
    },
    upData() {
      this.getData();
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
.myChargPoint {
  width: 100wh;
  .charg-card {
    background-color: #f7f7f7;
    .charg-item {
      margin-bottom: 50rpx !important;
      border-radius: 5rpx !important;
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
    @include fixed-bottom;
    padding: 0 20rpx;
  }
}
</style>
