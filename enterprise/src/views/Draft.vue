<template>
	<div class="draft-main">
		<Header></Header>
		<div class="draft-content">
			<main>
				<div class="draft-search">
					<div class="report-time">
						<a-range-picker :placeholder="['开始时间', '结束时间']" @change="onPickerChange" />
					</div>
					<div class="staff-search" v-if="isBoss">
						<StaffSearch :ishomeStaff="false" width="358px"></StaffSearch>
					</div>
					<div class="report-search">
						<a-button type="primary" @click="onhomeSearch">搜索</a-button>
						<a-button @click="onhomeReset">重置</a-button>
					</div>
					<div class="report-div">
						<a-button ref="week">周报</a-button>
					</div>
				</div>
				<FormatShort :mainData="mainData"></FormatShort>
				<!-- 点击加载更多 -->
			</main>
		</div>
	</div>
</template>

<script>
import Header from '../components/Header.vue'
import mainData from '../assets/data.json'
import FormatShort from '../components/FormatShort.vue'
import StaffSearch from '../components/StaffSearch'
export default {
	name: 'Draft',
	components: {
        Header,
		FormatShort,
		StaffSearch
	},
	data() {
		return {
			mainData: mainData,
			isBoss: sessionStorage.getItem('isBoss') == '1' ? true : false
		}
	},
	methods: {
		onPickerChange(date, dateString) {
			console.log('date, dateString', date, dateString);
			// 传进数据库搜索
		},
		onhomeSearch() {
			console.log('点击搜索');
		},
		onhomeReset() {
			console.log('点击重置');
		},
	}
}
</script>
<style lang="less">
.draft-main {
	height: 100%;
	.draft-content {
		width: 85%;
		height: 90%;
		margin: 0 auto;
		padding: 30px 30px;
		p {
			margin: 0;
		}
		.ant-card {
			margin-bottom: 20px;
		}
		main {
			width: 100%;
			height: 100%;
			padding: 20px 30px;
			border: 1px solid #57a6ec;
			border-radius: 10px;
			overflow-y: auto;
			.draft-search {
				margin-bottom: 10px;
				button {
					margin-left: 10px;
				}
			}
			.report-time {
				display: inline-block;
				margin-right: 10px;
			}
			.staff-search {
				display: inline-block;
			}
			.report-div {
				float: right;
			}
			.report-search {
				float: right;
				margin-left: 10px;
			}
		}
		::-webkit-scrollbar {
			display: none;
		}
	}
}
</style>
 