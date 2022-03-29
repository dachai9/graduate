<template>
	<div class="manage">
		<!-- <Headers></Headers>
		<div class="manage-content">
			<aside class="manage-aside">
				<a-card hoverable :bordered="false" style="width: 170px; border-radius: 10px" :bodyStyle="newStyle" @click="newReport">
					<p>新增报告</p>
				</a-card>
				<a-card hoverable :bordered="false" style="width: 170px; border-radius: 10px" :bodyStyle="newStyle" @click="newTemplate">
					<p>新增模板</p>
				</a-card>
				<a-card hoverable :bordered="false" style="width: 170px; border-radius: 10px" :bodyStyle="newStyle" @click="openDrafts">
					<p>草稿箱</p>
				</a-card>
			</aside>
			<main>
				<div class="manage-search">
					<div class="report-time">
						<a-range-picker :placeholder="['开始时间', '结束时间']" @change="onPickerChange" />
					</div>
					<div class="staff-search">
						<StaffSearch :isManageStaff="false" width="358px"></StaffSearch>
					</div>
					<div class="report-search">
						<a-button type="primary" @click="onmanageSearch">搜索</a-button>
						<a-button @click="onmanageReset">重置</a-button>
					</div>
					<div class="report-div">
						<a-button ref="week">周报</a-button>
					</div>
				</div>
				<FormatShort :mainData="mainData"></FormatShort>
				
			</main>
		</div> -->
	</div>
</template>

<script>
// import Headers from '../components/Header'
// import mainData from '../assets/data.json'
// import FormatShort from '../components/FormatShort.vue'
// import StaffSearch from '../components/StaffSearch'
// export default {
// 	name: 'manage',
// 	components: {
// 		Headers,
// 		FormatShort,
// 		StaffSearch
// 	},
// 	data() {
// 		return {
// 			newStyle: {
// 				"padding": "40px",
// 				"text-align": "center",
// 				"font-size": "20px",
// 				"font-weight": "800",
// 				"color": "#57a6ec",
// 				"border": "1px solid #57a6ec",
// 				"border-radius": "10px"
// 			},
// 			mainData: mainData
// 		}
// 	},
// 	methods: {
// 		onPickerChange(date, dateString) {
// 			console.log('date, dateString', date, dateString);
// 			// 传进数据库搜索
// 		},
// 		onmanageSearch() {
// 			console.log('点击搜索');
// 		},
// 		onmanageReset() {
// 			console.log('点击重置');
// 		},
// 		newReport() {
// 			this.$router.push('/report?new');
// 		},
// 		newTemplate() {
// 			this.$router.push('/report?template');
// 		},
// 		openDrafts() {
// 			this.$router.push('/draft');
// 		},
// 	}
// }
</script>
<style lang="less">
// .manage {
// 	height: 100%;
// 	.manage-content {
// 		height: 90%;
// 		padding: 30px 30px;
// 		.manage-aside {
// 			float: left;
// 			width: 14%;
// 		}
// 		p {
// 			margin: 0;
// 		}
// 		.ant-card {
// 			margin-bottom: 20px;
// 		}
// 		main {
// 			width: 85%;
// 			height: 100%;
// 			padding: 20px 30px;
// 			border: 1px solid #57a6ec;
// 			border-radius: 10px;
// 			overflow-y: auto;
// 			.manage-search {
// 				margin-bottom: 10px;
// 				button {
// 					margin-left: 10px;
// 				}
// 			}
// 			.report-time {
// 				display: inline-block;
// 				margin-right: 10px;
// 			}
// 			.staff-search {
// 				display: inline-block;
// 			}
// 			.report-div {
// 				float: right;
// 			}
// 			.report-search {
// 				float: right;
// 				margin-left: 10px;
// 			}
// 		}
// 		::-webkit-scrollbar {
// 			display: none;
// 		}
// 	}
// }
// .clearfix::after {
// 	content: '';
// 	height: 0;
// 	width: 0;
// 	display: inline-block;
// 	clear: both;
// }
</style>
