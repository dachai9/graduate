<template>
	<div class="short-main">
		<a-card v-for="data in mainData" :key="data.reportId" hoverable :title="data.title" :bodyStyle="shortBodyStyle" @click="openDetail(data)">
            <div class="content-main">
                <p>{{data.content}}</p>
            </div>
			<div class="content-footer">
                <a-popconfirm title="确定删掉该报告？" ok-text="是的" cancel-text="不了吧" @confirm="deleteReport(data.reportId)">
                    <a-button title="删除" class="delete-icon" v-if="path === '/draft'" icon="delete" type="danger" ghost size="small" @click="onDeleteClick"></a-button>
                </a-popconfirm>
                <span class="short-type">{{typeToName[data.rangeType]}}</span>
                <span v-if="path === '/home'">{{data.submitTime}}</span>
                <span v-if="path === '/draft'">{{data.saveTime}}</span>
                <span class="short-author">{{data.author}}</span>
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
            },
            path: location.pathname
        }
    },
    methods: {
        openDetail(data) {
            console.log('点击进入详情', data);
            this.$router.push(`/report?type=${this.path === '/draft' ? 'draft' : 'detail'}&range=${data.rangeType}&id=${data.reportId}`);
        },
        onDeleteClick(e) {
            // console.log(e);
            e.cancelBubble = true;
            // e.preventDefault();
        },
        deleteReport(id) {
            // console.log('删除的报告id', id);
            this.$emit('toggleSpin', true);
            this.$axios.post('http://127.0.0.1:88/deleteAReport', {id: id}).then(() => {
                // console.log('res', res.data);
                // 重新请求数据，因为不是
                this.$emit('getDraftData');
                this.$emit('toggleSpin', false);
            })
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
        margin-left: 8px;
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
    .delete-icon {
        float: right;
        margin-left: 10px;
        border: none;
        box-shadow: none;
        margin-top: -3px;;
    }
}
</style>
