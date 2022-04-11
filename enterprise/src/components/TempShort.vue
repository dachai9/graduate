<template>
	<div class="short-main">
		<a-card v-for="data in mainData" :key="data.tempId" hoverable :bodyStyle="shortBodyStyle" @click="openDetail(data)">
            <div class="content-main">
                <span class="short-type">{{typeToName[JSON.parse(data.temp).range]}}</span>
                <p>{{data.title}}</p>
                <a-popconfirm title="确定删掉该模板？" ok-text="是的" cancel-text="不了吧" v-if="path === '/draft'" @confirm="deleteReport(data)">
                    <!-- <a-button title="删除" class="delete-icon" v-if="path === '/draft?template'" icon="delete" type="danger" ghost size="small" @click="onDeleteClick"></a-button> -->
                    <a-button title="删除" class="delete-icon" icon="delete" type="danger" ghost size="small" @click="onDeleteClick"></a-button>
                </a-popconfirm>
                <span>{{data.saveTime}}</span>
                <span class="short-author">{{data.author}}</span>
            </div>
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
		mainData: Array,
	},
    data() {
        return {
            // isRead: JSON.parse(sessionStorage.getItem('isRead')),
            user: sessionStorage.getItem('user'),
            shortBodyStyle: {
                "padding": "0"
            },
            path: location.pathname,
            typeToName: {
                "weekly": "周报",
                "monthly": "月报",
                "seasonal": "季报",
                "yearly": "年报"
            },
            deleteId: ''
        }
    },
    methods: {
        openDetail(data) {
            console.log('获取到的tempdata', data);
            var temp = JSON.parse(data.temp)
            console.log('解析后的tempcontent', temp);
            this.$router.push(`/report?type=template&range=${temp.range}&temp=${data.tempId}#1`);
        },
        onDeleteClick(e) {
            // console.log(e);
            e.cancelBubble = true;
            // e.preventDefault();
        },
        deleteReport(data) {
            // console.log('删除的报告id', id);
            this.$axios.post('/deleteATemp', {id: data.tempId}).then((res) => {
                console.log('deleteATemp', res.data);
                // 重新请求数据，因为不是
                this.$emit('getAllTempData');
                this.$emit('toggleSpin', false);
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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
    .short-type {
        float: left;
        border: 1px solid #57a6ec;
        border-radius: 5px;
        margin-left: 0;
        margin-right: 15px;
    }
    .short-author {
        background-color: #57a6ec;
        color: #fff;
        border-radius: 15px;
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
</style>
