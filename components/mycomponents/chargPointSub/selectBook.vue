<template>
  <view class="selectCharg" @touchmove.stop.prevent="moveHandle">
    <scroll-view class="card-content" :scroll-y="true">
	  <view class="charg-card" v-for="item in chargType" :key="item">
		<view @tap="confirm(item)">{{ item }}</view>
	  </view>
      <!-- <ul>
        <li v-for="item in chargType" :key="item">{{item}}</li>
      </ul> -->
    </scroll-view>
    <view class="foot">
      <view class="foot-top"></view>
      <view class="foot-btn" @tap="close"> 取消 </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    chargType: {
      type: Array,
      default: [],
    },
  },
  components: {},
  data() {
    return {
      openId: uni.getStorageSync("openID"),
      currentData: [],
    };
  },
  onLoad() {},
  mounted() {},
  methods: {
    confirm(item) {
      this.$emit("confirm", item);
    },
    close() {
      // this.$refs.charg.cleanSelect();
      this.$emit("close");
    },
    moveHandle() {
      return;
    },
  },
  onShow() {},
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
.selectCharg {
  width: 100wh;
  background-color: #fff;
  border-radius: 28rpx 28rpx 0 0;
  overflow: hidden;
  .card-content {
    margin-top: 20rpx;
    height: 580rpx;
  }
  .charg-card {
    height: 112rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(0, 0, 0, 1);
    font-size: 34rpx;
    // font-weight: bold;
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
    // @include fixed-bottom;
    // padding: 0 20rpx;
    // display: flex;
    // bottom: 20rpx;
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
</style>
