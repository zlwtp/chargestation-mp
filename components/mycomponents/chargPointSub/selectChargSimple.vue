<template>
  <view class="charg" @touchmove.stop.prevent="moveHandle">
    <view class="selectCharg main-box-color">
	  <view class="charge-head">
	    <text>选择充电桩</text>
	  </view>
	  <scroll-view class="card-content" :scroll-y="true">
		<view
		  class="charg-card"
		  :class="{'charg-card-active' : item.isActive}"
		  v-for="(item, index) in chargList"
		  :key="index"
		  @tap="tapPoint(item)"
		>{{ item.name }}
		</view>
		<view class="charg-title" v-if="ifWrited">
		  <span class="textName">注册码：</span>
		  <input
		    type="text"
		    value=""
		    placeholder="请输入注册码"
		    class="perInput"
		    v-model.trim="writedCode"
		    :disabled="!(selectedCharg.id === '')"
		  />
		  <view class="saoma" v-if="selectedCharg.id === ''">
		    <img class="s-icon" src="@/static/saomiao.png" @tap="scanCode()" />
		  </view>
		</view>
	  </scroll-view>
	  <view class="foot">
		<view class="foot-btn" @tap="confirm()"> 确认 </view>
	  </view>
    </view>
  </view>
</template>

<script>
import chargCard from "@/components/mycomponents/chargPointSub/chargCard.vue";

export default {
  components: { chargCard },
  props:{
	  ifWrited: {//是否展示其他选项，支持手动输入
		  type: Boolean,
		  default: false
	  },
	  chargePoint: {
		  type: Object,
		  default: ()=>({})
	  }
  },
  data() {
    return {
      openId: uni.getStorageSync("openID"),
      chargList: [],
	  selectedCharg: {},//选择的桩
	  writedCode: '',//手动写入的注册码code
      currentData: [],
    };
  },
  mounted() {
	  this.getData();
  },
  methods: {
	  scanCode() {
		// 允许从相机和相册扫码
		let vm = this;
		uni.scanCode({
		  onlyFromCamera: true,
		  success: function (res) {
			console.log("条码类型：" + res.scanType);
			console.log("条码内容：" + res.result);
			vm.selectedCharg.code = res.result;
			// vm.getAddress(res.result);
		  },
		  fail: (res) => {
			uni.showToast({
			  title: "获取条码失败",
			  icon: "none",
			  duration: 2000,
			});
			console.log("失败", res); //code
		  },
		});
	  },
	  getAddress(code) {
	    // return
	    let vm = this;
	    this.$http({
	      url: this.$api.isExistAddress,
	      method: "GET",
	      data: {
	        code: code,
	      },
	    }).then((res) => {
	      if (res.data.code == 200) {
	        let point = res.data.result;
	        if (point) {
	          vm.addressFlag = true;
	          vm.result = res;
	          vm.params.provinceId = point.provinceId;
	          vm.params.cityId = point.cityId;
	          vm.params.areaId = point.areaId;
	          vm.params.provinceName = point.provinceName;
	          vm.params.cityName = point.cityName;
	          vm.params.areaName = point.areaName;
	          vm.params.address = point.address;
	          vm.params.name = point.name;
	        } else {
	          vm.addressFlag = false;
	          vm.params.provinceId = "";
	          vm.params.cityId = "";
	          vm.params.areaId = "";
	          vm.params.provinceName = "";
	          vm.params.cityName = "";
	          vm.params.areaName = "";
	          vm.params.address = "";
	          vm.result.result = " 请选择区域";
	        }
	      }
	    });
	  },
    getData() {
      let vm = this;
      if (!uni.getStorageSync("openID")) {
        console.log("没有openid");
        return;
      }
      this.$http({
        url: vm.$api.bindingList + "?openId=" + uni.getStorageSync("openID"),
        method: "GET",
        data: {},
      }).then((res) => {
        if (res.data.result.length == 0) {
          vm.chargList = [];
          return wx.showToast({
            title: "暂无数据", // 标题
            icon: "none", // 图标类型，默认success
            duration: 2000, // 提示窗停留时间，默认1500ms
          });
        }
        vm.chargList = res.data.result;
		if(this.ifWrited){
			vm.chargList.push({
				id: "",
				code: "",
				name: "其他",
				isActive: false
			})
		}
        console.log(vm.chargList);
      });
    },
    add() {
      if (this.currentData.length < 1) {
        console.log("选择的充电桩", this.currentData);
        return wx.showToast({
          title: "请选择充电桩", // 标题
          icon: "none", // 图标类型，默认success
          duration: 2000, // 提示窗停留时间，默认1500ms
        });
      }
      // this.$refs.charg.cleanSelect();
      console.log("选中的充电桩0", this.currentData);
      this.$emit("confirm", this.currentData);
    },
	tapPoint(item){
		this.chargList.forEach((val,index)=>{
			this.$set(this.chargList[index], 'isActive', item.id === val.id);
		})
		this.selectedCharg = Object.assign({},item);
	},
    confirm() {
	  if(this.selectedCharg.id == ""){//选择"其他"时，组装手写code
		if(this.writedCode == ""){
			return uni.showToast({
			  title: "请输入注册码",
			  icon: "none",
			  duration: 2000,
			});
		}
		if (this.writedCode.length !== 38) {
		  return uni.showToast({
			title: "注册码位数应为38位",
			icon: "none",
			duration: 2000,
		  });
		} 
		this.selectedCharg.code = this.writedCode;
	  }
      this.$emit("confirm", this.selectedCharg);
    },
    currentInfo(data) {
      console.log("选中的充电桩0", data);
      this.currentData = data;
    },
    moveHandle() {
      return;
    },
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
.charg {
  position: relative;
  .selectCharg {
    width: 100wh;
    border-radius: 28rpx 28rpx 0 0;
	padding-top: 44rpx;
    margin-top: 20rpx;
	
    // background: url("@/static/s-bg.png") no-repeat;
    // background-size: 100% 100%;
	.charge-head{
		padding: 0 30rpx;
	}
    .card-content {
      margin-top: 44rpx;
      max-height: 880rpx;
	  min-height: 280upx;
    }
    .charg-card {
		width: 636rpx;
		height: 94rpx;
		line-height: 94rpx;
		text-align: center;
		border-radius: 8rpx;
		border: 2px solid #CBCBCB;
		margin: 0 auto 48rpx auto;
		color: #777777;
		&-active{
			color: #3E69F4;
			border: 2px solid #3E69F4;
		}
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
	.charg-title {
	  display: flex;
	  align-items: center;
	  width: 636rpx;
	  line-height: 98rpx;
	  height: 98rpx;
	  border-bottom: 1rpx solid #e6e6e6;
	  margin: 0rpx auto 80rpx auto;
	  .textName {
	    line-height: 98rpx;
	    height: 98rpx;
	    float: left;
	    width: 150rpx;
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
		background: #3E69F4;
		color: #F8F8F8;
      }
    }
  }
}
</style>
