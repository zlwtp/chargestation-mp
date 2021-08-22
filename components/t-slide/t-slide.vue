<template>
	<view>
	 <view class="t-slide-box" v-for="(item,index) in items" :key="index" > 
	 	<view class="t-slide-area" :style="{height:height+'rpx'}">
	 	　<view class="t-slide-view" >
	 	　　<view class="t-touch-item" :class=" item.isTouchMove?'touch-move-active':''" @touchstart="touchstart" @touchmove="touchmove" :data-index="index">
	 		      <view class="t-slide-content" :style="{transform:item.isTouchMove?'translateX(0)':`translateX(${btnWidth*(btnArr.length)}rpx)`,
				                                marginLeft:`-${btnWidth*(btnArr.length)}rpx`}" @click="itemClick(item)">
				    <slot v-bind:item="item"> </slot>
	 		      </view>
				   <view  class="t-slide-btn" v-for="(btn,num) in btnArr" :key="num" @touchstart="btnClick(btn.events,item)" 
				    :style="{width:btnWidth+'rpx',transform:item.isTouchMove?'translateX(0)':`translateX(${btnWidth*(btnArr.length)}rpx)`,
					         background:btn.background,color:btn.color}">
					    {{btn.name}}
				  </view>
	 	    </view>
	 	　</view>
	 	</view> 
	 </view>
	</view>
</template>

<script>
	export default {
		props:{
			//单行高度
			height:{
				type : Number,
				default:120
			},
			//按钮宽度
			btnWidth: {
				type : Number,
				default:200
			},
			//按钮数组
			btnArr: {
				type : Array,
				default:[
					{
						name:'编辑',
						background:'#00aaff',
						color:'#fff',
						events:'edit'
					},
					{
						name:'删除',
						background:'#ff5500',
						color:'#fff',
						events:'del'
					}
				]
			},
		},
		data() {
			return {
				items:[],
				startX: 0, //开始坐标
				startY: 0  //开始Y坐标
			}
		},
		
		methods: {
			//点击单行
			itemClick(item){
				this.$emit('itemClick',item)
			},
			//点击按钮
			btnClick(name,item){
				this.$emit(name,item)
			},
			//赋值
			assignment(data){
				data.forEach(val=>{this.$set(val,'isTouchMove',false)})
				this.items=data
			},
			touchstart: function (e) {
			    //开始触摸时 重置所有删除
			    this.items.forEach(function (v, i) {
			      if (v.isTouchMove)//只操作为true的
			        v.isTouchMove = false;
			    })
				this.startX=e.changedTouches[0].clientX
				this.startY=e.changedTouches[0].clientY,
				this.items=this.items
			   
			  },
			  //滑动事件处理
			  touchmove: function (e) {
				  let that=this
			      let index = e.currentTarget.dataset.index //当前索引
			      let startX = this.startX //开始X坐标
			      let startY = this.startY //开始Y坐标
			      let touchMoveX = e.changedTouches[0].clientX//滑动变化坐标
			      let touchMoveY = e.changedTouches[0].clientY//滑动变化坐标
			        //获取滑动角度
			      let angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
			      this.items.forEach(function (v, i) {
			        v.isTouchMove = false
			        //滑动超过60度角 return
			        if (Math.abs(angle) > 60) return;
			        if (i == index) {
			          if (touchMoveX > startX) //右滑
						that.$set(that.items[i],'isTouchMove',false)
			          else //左滑
						that.$set(that.items[i],'isTouchMove',true)
			        }
			      })
			    },
				 angle: function (start, end) {
				    var X = end.X - start.X,
				        Y = end.Y - start.Y
				    //返回角度 /Math.atan()返回数字的反正切值
				    return 360 * Math.atan(Y / X) / (2 * Math.PI);
				 },
		}
	}
</script>

<style lang="scss">
.t-slide-box{
	border-bottom: 1upx solid #ececec;
	.t-slide-area{
	  width: 100%;
	  .t-slide-view{
	    width: 100%;
	    height: 100%;
		.t-touch-item {
		  font-size:24upx;
		  display: flex;
		  flex-direction:row;
		  justify-content: space-between;
		  width: 100%;
		  height: 100%;
		  overflow: hidden;
		  .t-slide-content {
		    width: 100%;
		    line-height:44upx;
		    -webkit-transition: all 0.4s;
		    transition: all 0.4s;
		  }
		  .t-slide-btn {
		    font-weight: bold;
		    display: flex;
			flex-direction:row;
		    align-items: center;
		    justify-content: center;
		    color: #fff;
		    -webkit-transition: all 0.4s;
		    transition: all 0.4s;
		  }
		}
	  }
	}
}

</style>
