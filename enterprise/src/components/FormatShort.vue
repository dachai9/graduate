<template>
	<div class="short-main">
		<a-card v-for="data in mainData" :key="data.id" hoverable :title="data.title" :bodyStyle="shortBodyStyle" @click="openDetail(data)">
            <div class="content-main">
                <p>{{data.content}}</p>
            </div>
			<div class="content-footer">
                <span class="short-type">{{typeToName[data.rangeType]}}</span>
                <span>{{data.submitTime}}</span>
                <span class="short-author">{{data.author}}</span>
                <!-- <a-button icon="delete" type="danger" shape="circle" ghost></a-button> -->
            </div>
		</a-card>
	</div>
</template>

<script>
export default {
	name: 'short',
	props: {
		mainData: Array
	},
    data() {
        return {
            shortBodyStyle: {
                "padding": "0"
            },
            typeToName: {
                "weekly": "周报",
                "monthly": "月报",
                "seasonal": "季报",
                "yearly": "年报"
            }
        }
    },
    methods: {
        openDetail(data) {
            // console.log('点击进入详情', data);
            this.$router.push(`/report?type=detail&range=${data.rangeType}&id=${data.reportId}`);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.content-main {
    padding: 24px;
}
.content-footer {
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 24px;
    overflow: hidden;
    span {
        margin-left: 12px;
        float: right;
        padding: 2px 5px;
        font-size: 12px;
    }
    span::after {
        content: '';
        display: inline-block;
        height: 0;
        width: 0;
        clear: both;
    }
    .short-author {
        background-color: #57a6ec;
        color: #fff;
        border-radius: 15px;
    }
    .short-type {
        float: left;
        border: 1px solid #57a6ec;
        border-radius: 5px;
        margin-left: 0;
    }
}
</style>
