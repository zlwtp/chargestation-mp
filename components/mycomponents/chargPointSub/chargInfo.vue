<template>
  <view class="charg-card">
    <view class="charg-content" v-if="isfaultInfo">
      <view class="top">{{ modelName }}</view>
      <view class="charg-price"
        >报警时间：<span>{{ formatDate(chargInfo.alarmTime) }}</span></view
      >
      <view class="charg-price"
        >报警类型：<span>{{ chargInfo.alarmTypeDesc }}</span></view
      >
      <view class="charg-price"
        >处理方式：<span>{{ chargInfo.alarmHandle }}</span></view
      >
    </view>
    <view class="charg-content" v-if="!isfaultInfo">
      <view class="top">{{ modelName }}</view>
      <view class="charg-price"
        >开始充电：<span>{{ chargInfo.beginTime }}</span></view
      >
      <view class="charg-price"
        >结束充电：<span>{{ chargInfo.endTime }}</span></view
      >
      <view class="charg-price" v-if="powerShow"
        >充电时长：<span>{{ formTime(chargInfo.duringHours) }}</span></view
      >
      <view class="charg-price" v-if="powerShow"
        >电量：<span
          ><i>{{ chargInfo.chargePower }}</i
          >KWh</span
        ></view
      >
      <view class="charg-price"
        >金额：<span>{{ chargInfo.price }}元</span></view
      >
    </view>
  </view>
</template>

<script>
export default {
  props: {
    chargInfo: {
      type: Object,
    },
    isfaultInfo: {
      type: Boolean,
      default: false,
    },
    powerShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      num: 0,
      modelName: uni.getStorageSync("pileData").modelName,
    };
  },
  methods: {
    goto(type) {
      switch (type) {
        case 1:
          uni.navigateTo({
            url: "/pages/myChargPoint/chargPointMember",
            fail: (res) => {},
          });
          break;
        case 2:
          uni.navigateTo({
            url: "/pages/myChargPoint/chargHistory",
          });
          break;
        case 3:
          uni.navigateTo({
            url: "/pages/myChargPoint/faultInfo",
          });
          break;
        case 4:
          break;
        case 5:
          break;
        default:
          console.log("无" + type);
          break;
      }
    },
    formTime(time) {
      let b = time.split(".");
      let x = b[0];

      let y = b[1];
      if (y.length == 1) {
        y = Math.ceil(y * 6);
      }
      if (y.length == 2) {
        y = Math.ceil(y * 0.6);
      }
      if (y.length == 3) {
        y = Math.ceil(y * 0.06);
      }
      return x + "小时" + y + "分钟";
    },
    setPrimary(id) {
      console.log(id);
    },
    formatDate(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
  },
};
</script>

<style lang="scss" scoped>
.charg-card {
  display: flex;
  width: 100%;
  padding: 25rpx 30rpx;
  margin: 20rpx 0;
  position: relative;
  border-radius: 15rpx;
  background-color: #fff;
  // border: 2rpx solid #ccc;
  // padding-top: 0;
  .charg-content {
    flex: 1;
    .top {
      height: 75rpx;
      color: rgba(51, 51, 51, 1);
      border-bottom: 1rpx solid rgba(237, 237, 237, 1);
      margin-bottom: 20rpx;
      font-size: 32rpx;
      font-weight: bold;
      &::before {
        content: "";
        width: 9rpx;
        height: 28rpx;
        // background: #4872f8;
        border-left: 9rpx solid #4872f8;
        left: -30rpx;
        position: relative;
      }
    }
  }
  .charg-right {
    width: 180rpx;
  }
  .charg-price {
    font-size: 30rpx;
    display: flex;
    justify-content: space-between;
    color: #777777;
    // height: 40rpx;
    margin-bottom: 20rpx;
    span {
      color: rgba(51, 51, 51, 1);
    }
    i {
      display: inline-block;
      // color: rgba(247, 68, 68, 1);
    }
  }
}
</style>
