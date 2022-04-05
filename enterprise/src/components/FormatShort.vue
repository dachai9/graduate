<template>
	<div class="short-main">
		<!-- <a-card v-for="data in mainData" :key="data.reportId" hoverable :title="data.title" :bodyStyle="shortBodyStyle" @click="openDetail(data)"> -->
		<a-card v-for="data in mainData" :key="data.reportId" hoverable :bodyStyle="shortBodyStyle" @click="openDetail(data)">
            <!-- <a-card-meta title="Europe Street beat"> -->
            <!-- <a-card-meta> -->
                <!-- <template slot="title"> -->
            <div class="content-main">
                <!-- <p>{{getContent(data)}}</p> -->
                <span class="short-type">{{typeToName[data.rangeType]}}</span>
                <p>{{data.title}}</p>
                <!-- <p :title="data.shortCut">{{data.shortCut}}</p> -->
                <a-popconfirm title="确定删掉该报告？" ok-text="是的" cancel-text="不了吧" v-if="path === '/draft'" @confirm="deleteReport(data.reportId)">
                    <a-button title="删除" class="delete-icon" v-if="path === '/draft'" icon="delete" type="danger" ghost size="small" @click="onDeleteClick"></a-button>
                </a-popconfirm>
                <span v-if="path === '/home'">{{data.submitTime}}</span>
                <span v-if="path === '/draft'">{{data.saveTime}}</span>
                <span class="short-author">{{data.author}}</span>
            </div>
                <!-- </template>
            </a-card-meta> -->
			<!-- <div class="content-footer">
                <a-popconfirm title="确定删掉该报告？" ok-text="是的" cancel-text="不了吧" @confirm="deleteReport(data.reportId)">
                    <a-button title="删除" class="delete-icon" v-if="path === '/draft'" icon="delete" type="danger" ghost size="small" @click="onDeleteClick"></a-button>
                </a-popconfirm>
                <span class="short-type">{{typeToName[data.rangeType]}}</span>
                <span v-if="path === '/home'">{{data.submitTime}}</span>
                <span v-if="path === '/draft'">{{data.saveTime}}</span>
                <span class="short-author">{{data.author}}</span>
            </div> -->
		</a-card>
        <div class="no-data" v-if="!mainData.length">
            <a-card>暂无数据</a-card>
        </div>
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
            path: location.pathname,
        }
    },
    methods: {
        // getContent(data) {
            
        //     return JSON.stringify(JSON.parse(data.content).d);
        // },
        openDetail(data) {
            console.log('点击进入详情', data);
            this.$router.push(`/report?type=${this.path === '/draft' ? 'draft' : 'detail'}&range=${data.rangeType}&id=${data.reportId}&temp=${data.tempId}`);
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
                this.$emit('getSumDraftData');
                this.$emit('toggleSpin', false);
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.short-main {
    overflow-y: auto;
}
.content-main {
    padding: 18px 18px 15px;
    overflow: hidden;
    p {
        // display: inline-block;
        float: left;
        height: 21px;
        white-space: pre;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: 800;
        font-size: 16px;
    }
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
        margin-right: 15px;
    }
    .delete-icon {
        float: right;
        margin-left: 10px;
        border: none;
        box-shadow: none;
        margin-top: -3px;;
    }
}
.no-data {
    text-align: center;
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
