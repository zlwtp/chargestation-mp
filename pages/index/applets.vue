<template>
    <view> </view>
</template>

<script>
export default {
    onLoad(option) {
        //公众号跳转使用applets 是stop 停止预约
        if (option.applets != null || option.applets != undefined) {
            uni.setStorage({
                key: 'applets',
                data: option.applets,
                success() {}
            })
        } else {
            uni.setStorage({
                key: 'applets',
                data: '',
                success() {}
            })
        }
        uni.switchTab({
            url: '/pages/index/index'
        })
    }
}
</script>
