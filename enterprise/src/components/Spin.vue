<template>
	<div class="spin-main">
        <a-spin :spinning="isShow" :delay="1000" tip="加载中..."></a-spin>
	</div>
</template>

<script>
export default {
	name: 'Spin',
	props: {
        isShow: Boolean
	},
	data() {
		return {
		}
	},
	methods: {
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.spin-main {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0);
    text-align: center;
    z-index: 90;
}
</style>
