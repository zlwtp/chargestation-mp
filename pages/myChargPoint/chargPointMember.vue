<template>
  <view class="chargPointMember">
    <view class="top" v-if="showFlag">
      <view class="top-content" @tap="openSelect">
        <text>{{ name }}</text>
        <span class="arrow-bottom"></span>
      </view>
    </view>
    <view class="charg-card">
      <view class="charg-sub" v-for="(item, index) in chargList" :key="index">
        <view class="charg-content">
          <image class="top-user-img" :src="item.avatar"></image>
          <text
            class="top-user-title"
            :style="item.masterMember == 1 ? 'color:#f74444;' : ''"
            >{{ item.name }}</text
          >
        </view>
        <view class="charg-right">
          <view class="charg-btn" v-if="item.delFlag || allDell">
            <button class="change-btn" type="error" @tap="openDel(item)">
              删除
            </button>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="delPopup" type="bottom">
      <view class="del-popup">
        <text class="title">请确定是否删除{{ userName }}</text>
        <view class="foot">
          <button class="change-btn foot-btn" type="primary" @tap="delConfirm">
            确定
          </button>
          <button class="change-btn foot-btn" type="primary" @tap="delClose">
            取消
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import chargInfo from "@/components/mycomponents/chargPointSub/chargInfo.vue";

export default {
  name: "chargPointMember",
  components: { chargInfo },
  data() {
    return {
      isStart: true,
      id: "",
      name: "",
      userName: "",
      code: "",
      openIDPile: "",
      openId: uni.getStorageSync("openID"),
      allDell: false,
      chargList: [],
      showFlag: true,
    };
  },
  mounted() {},
  onLoad() {},
  methods: {
    getData() {
      let vm = this;
      vm.allDell = false;
      if (vm.code == "") {
        vm.chargList = [];
        return wx.showToast({
          title: "当前没有选中桩", // 标题
          icon: "none", // 图标类型，默认success
          duration: 2000, // 提示窗停留时间，默认1500ms
        });
      }
      this.$http({
        url: vm.$api.memberList,
        method: "GET",
        data: {
          code: vm.code,
        },
      }).then((res) => {
        if (res.data.result == null || res.data.result.length == 0) {
          vm.chargList = [];
          return wx.showToast({
            title: "暂无数据", // 标题
            icon: "none", // 图标类型，默认success
            duration: 2000, // 提示窗停留时间，默认1500ms
          });
        }
        vm.chargList = res.data.result;
        vm.chargList.forEach((item) => {
          if (item.openId == uni.getStorageSync("openID")) {
            if (item.masterMember == 1) {
              item.delFlag = true;
              vm.allDell = true;
            } else {
              item.delFlag = true;
            }
          } else {
            item.delFlag = false;
          }
        });
      });
    },
    getCharg(flag) {
      let vm = this;
      if (!uni.getStorageSync("openID")) {
        return;
      }
      this.$http({
        url: vm.$api.bindingList + "?openId=" + uni.getStorageSync("openID"),
        method: "GET",
        data: {},
      }).then((res) => {
        if (res.data.result == null || res.data.result.length == 0) {
          vm.code = "";
          vm.name = "";
          uni.removeStorage({
            key: "pileData",
            success: function () {},
          });
          uni.setStorage({
            key: "chargNum",
            data: 0,
            success() {},
          });
          return wx.showToast({
            title: "暂无数据", // 标题
            icon: "none", // 图标类型，默认success
            duration: 2000, // 提示窗停留时间，默认1500ms
          });
        }
        let data = res.data.result;
        data.forEach((item) => {
          if (item.code == uni.getStorageSync("pileData").code) {
            //如果是删除其他成员 桩还在
            vm.code = item.code;
            vm.name = item.name;
            vm.getData();
          } else {
            vm.code = "";
            vm.name = "";
            vm.getAppoint();
          }
        });
      });
    },
    //获取绑定桩
    getAppoint() {
      let vm = this;
      this.$http({
        url: vm.$api.getMainPile,
        method: "GET",
        data: {
          openId: uni.getStorageSync("openID"),
        },
      }).then((res) => {
        if (res.data.code == 200) {
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
            uni.switchTab({
              url: "/pages/index/index",
            });
            return;
          }
          vm.name = res.data.result.name;
          vm.code = res.data.result.code;
          uni.setStorage({
            key: "pileData",
            data: res.data.result,
            success() {},
            fail() {},
          });
          vm.confirm({ code: vm.code, name: vm.name });
        } else {
          uni.switchTab({
            url: "/pages/index/index",
          });
          return;
        }
      });
    },
    openDel(data) {
      this.id = data.id;
      this.openIDPile = data.openId;
      this.userName = data.name;
      this.$refs.delPopup.open();
    },

    delConfirm() {
      let vm = this;
      this.$http({
        url:
          vm.$api.member + "/" + this.id + "/" + uni.getStorageSync("openID"),
        method: "DELETE",
        data: {},
      }).then((res) => {
        uni.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000,
        });
        vm.chargList = [];
        if (vm.openIDPile == vm.openId) {
          vm.code = "";
          vm.name = "";
          vm.getAppoint();
        } else {
          // vm.getCharg(false);
          vm.getData();
        }
        vm.delClose();
        // 删除后获取列表
      });
    },
    delClose() {
      this.$refs.delPopup.close();
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
.uni-popup-dialog {
  border: 4rpx solid #ccc;
}
.chargPointMember {
  height: 100vh;
  background-color: #fff;
  padding: 0 20rpx;
  .top {
    display: flex;
    align-items: center;
    padding-left: 34rpx;
    height: 84rpx;
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
    background-color: #fff;
    h .charg-item {
      margin-bottom: 50rpx !important;
      border-radius: 5rpx !important;
    }
    .charg-sub {
      display: flex;
      width: 100%;
      padding: 25rpx 40rpx;
      // margin: 20rpx 0;
      position: relative;
      border-radius: 5rpx;
      border-bottom: 2rpx solid #ccc;
      .charg-left {
        width: 120rpx;
        height: 120rpx;
        margin-right: 30rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .charg-content {
        flex: 1;
        display: flex;
        // justify-content: center;
        align-items: center; //y轴排列
        .top-user-img {
          height: 100rpx;
          width: 100rpx;
          border-radius: 200rpx;
          overflow: hidden;
        }

        .top-user-title {
          height: 94rpx;
          line-height: 94rpx;
          font-size: 36rpx;
          color: #000;
          margin-left: 40rpx;
          font-weight: bold;
          max-width: 300rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .charg-right {
        // width: 180rpx;
      }
      .charg-name {
        font-size: 46rpx;
      }
      .charg-price {
        font-size: 30rpx;
      }
    }
    .card-active {
      border: 2rpx solid #007aff;
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
  .del-popup {
    // height: ;
    margin: 20rpx 0;
    .title {
      height: 80rpx;
      text-align: center;
      display: block;
      line-height: 80rpx;
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
</style>
<style lang="scss">
.chargPointMember {
  .charg-right {
    display: flex;
    justify-content: center;
    align-items: center;
    .charg-btn {
      button {
        height: 60rpx;
        line-height: 60rpx;
        font-size: 24rpx;
        background-color: rgba(247, 68, 68, 1);
      }
    }
  }
}
</style>