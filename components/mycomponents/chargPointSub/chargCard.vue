<template>
  <view class="charg-sub">
    <view
      class="charg-card"
      :class="isActive == index ? 'card-active' : ''"
      v-for="(item, index) in chargList"
      :key="index"
      @click="currentInfo(item, index)"
    >
      <view class="charg-content">
        <view class="charg-price"
          >名称：<span>{{ item.name }}</span></view
        >
        <view class="charg-price"
          >编号：<span>{{ item.sn }}</span></view
        >
        <view class="charg-price"
          >蓝牙名称：<span>{{ item.bluetoothName }}</span></view
        >
        <view class="charg-price"
          >蓝牙密码：<span>{{ item.bluetoothPwd }}</span></view
        >
        <view class="charg-price"
          >型号：<span>{{ item.type }}</span></view
        >
        <view class="charg-price"
          >剩余时间：<span>{{ item.workingHours }}</span></view
        >
      </view>
      <view class="charg-right" v-if="isShow">
        <view class="charg-btn">
          <button
            class="change-btn"
            type="primary"
            v-if="item.mainPile == 0"
            @tap.stop="setPrimary(item)"
          >
            设置主桩
          </button>
          <button class="change-btn" type="primary" @tap.stop="goto(1, item)">
            查看成员
          </button>
          <button class="change-btn" type="primary" @tap.stop="goto(2, item)">
            充电记录
          </button>
          <button class="change-btn" type="primary" @tap.stop="goto(3, item)">
            故障信息
          </button>
          <button class="change-btn" type="primary" @tap.stop="goto(4, item)">
            使用说明书
          </button>
          <button class="change-btn" type="primary" @tap.stop="goto(5, item)">
            安装说明书
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    chargList: {
      type: Array,
      default: [],
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openId: uni.getStorageSync("openID"),
      isActive: 9999, // 用来判断active样式类是否显示
      num: 0,
    };
  },
  mounted() {},

  methods: {
    goto(type, item) {
      switch (type) {
        case 1:
          uni.navigateTo({
            url: `/pages/myChargPoint/chargPointMember?code=${item.code}&name=${item.name}`,
            fail: (res) => {
            },
          });
          break;
        case 2:
          uni.navigateTo({
            url:
              "/pages/myChargPoint/chargHistory?datas=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case 3:
          uni.navigateTo({
            url: `/pages/myChargPoint/faultInfo?code=${item.code}&name=${item.name}`,
          });
          break;
        case 4:
          this.getInstructions(item.type, "operation");
          break;
        case 5:
          this.getInstructions(item.type, "install");
          break;
        default:
          break;
      }
    },
    setPrimary(item) {
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
          this.$emit("upData");
        }
        // this.close();
      });
    },
    currentInfo(item, index) {
      //将点击的元素的索引赋值给变量
      this.isActive = index;
      if (this.isShow) {
        uni.navigateTo({
          url: `/pages/myChargPoint/addChargPoint?code=${item.code}&sn=${item.sn}`,
        });
      } else {
        //返回当前选中数据
        this.$emit("currentInfo", item);
      }
    },
    cleanSelect() {
      this.isActive = 9999;
    },
    getInstructions(model, type) {
      let vm = this;
      // let baseUrl = "http://8.136.8.191:8866/pile/";
      let baseUrl = "https://124.71.199.7/pile/";
      this.$http({
        url: this.$api.instructionsGet,
        method: "GET",
        data: {
          model: "GT520",
        },
      }).then((res) => {
        if (res.data.code == 200) {
          if (type == "install") {
            vm.openReport(baseUrl + res.data.result.installInstructionUrl);
          } else {
            vm.openReport(baseUrl + res.data.result.operationInstructionUrl);
          }
        }
      });
    },
    openReport(url) {
      uni.showLoading({
        title: "加载中",
        mask: true,
      });
      wx.downloadFile({
        url: url,
        success: function (res) {
          console.log(res);
          uni.hideLoading();
          var filePath = res.tempFilePath;
          uni.showLoading({
            title: "正在打开",
            mask: true,
          });
          wx.openDocument({
            filePath: filePath,
            fileType: "pdf",
            success: function (res) {
              console.log(res);
              uni.hideLoading();
              console.log("打开文档成功");
            },
            fail: function (err) {
              uni.hideLoading();
              console.log("fail:" + JSON.stringify(err));
            },
          });
        },
        fail: function (err) {
          uni.hideLoading();
          console.log("fail:" + JSON.stringify(err));
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.charg-sub {
  margin-bottom: 50rpx !important;
  border-radius: 5rpx !important;
  .charg-card {
    display: flex;
    width: 100%;
    padding: 25rpx 40rpx;
    margin: 20rpx 0;
    position: relative;
    border-radius: 5rpx;
    // border: 2rpx solid #ccc;
    .charg-left {
      width: 180rpx;
      height: 180rpx;
      margin-right: 30rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .charg-content {
      flex: 1;
    }
    .charg-right {
      width: 230rpx;
    }
    .charg-name {
      font-size: 46rpx;
    }
    .charg-price {
      font-size: 30rpx;
      color: #777777;
      height: 40rpx;
      span {
        text-align: right;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .card-active {
    border: 2rpx solid #007aff;
  }
}
</style>
