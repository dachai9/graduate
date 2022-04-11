<template>
	<div class="home">
		<Headers></Headers>
		<div class="home-content">
			<aside class="home-aside">
				<a-card hoverable :bordered="false" style="width: 170px; border-radius: 10px" :bodyStyle="newStyle" @click="newReport">
					<p>新建</p>
				</a-card>
				<a-card v-if="isBoss" hoverable :bordered="false" style="width: 170px; border-radius: 10px" :bodyStyle="newStyle" @click="checkTemplate()">
					<p>查看模板</p>
				</a-card>
				<a-card hoverable :bordered="false" style="width: 170px; border-radius: 10px" :bodyStyle="newStyle" @click="openDrafts">
					<p>草稿箱</p>
				</a-card>
			</aside>
			<main>
				<div class="home-search">
					<div class="report-time">
						<a-range-picker v-model="dateValue" @change="onPickerChange" :locale="locale"/>
					</div>
					<div class="staff-search" v-if="isBoss">
						<StaffSearch :screenName="screenName" :ishomeStaff="false" width="300px" @searchName="getSearchName"></StaffSearch>
					</div>
					<div class="report-search">
						<a-button type="primary" @click="onhomeSearch">搜索</a-button>
						<a-button @click="onhomeReset">重置</a-button>
						<a-popconfirm title="是否选择导出全部？" ok-text="确认导出全部" cancel-text="只导出当页" @confirm="exportExcel(true)" @cancel="exportExcel(false)" >
							<a-button icon="export" title="导出"></a-button>
						</a-popconfirm>
					</div>
					<div class="report-div">
						<a-button v-if="range.weekly" ref="weekly" :type="isScreened.weekly ? 'primary' : 'default'" @click="screenReport('weekly')">周报</a-button>
						<a-button v-if="range.monthly" ref="monthly" :type="isScreened.monthly ? 'primary' : 'default'" @click="screenReport('monthly')">月报</a-button>
						<a-button v-if="range.seasonal" ref="seasonal" :type="isScreened.seasonal ? 'primary' : 'default'" @click="screenReport('seasonal')">季报</a-button>
						<a-button v-if="range.yearly" ref="yearly" :type="isScreened.yearly ? 'primary' : 'default'" @click="screenReport('yearly')">年报</a-button>
					</div>
				</div>
				<div v-if="isBoss" class="all-read" @click="setAllRead">全部标记为已读</div>
				<a-spin :spinning="isSearchSpinShow">
					<FormatShort :mainData="mainData" :isRead="isRead" @readReport="readReport"></FormatShort>
					<!-- 点击加载更多 -->
				<div class="home-pagination"><a-pagination :current="curPage" :total="totalNum" size="small" @change="onPageChange" /></div>
				</a-spin>
			</main>
			<a-modal v-model="isShowNewModel" dialogClass="choose-report-model" :getContainer="reportModelContainer" :footer="null" :bodyStyle="reportModelBodyStyle">
				<div class="model-cards-box">
					<a-card hoverable @click="toShowCreateReport('reports')">报告</a-card>
					<a-card hoverable @click="toShowCreateTemp('templates')">模板</a-card>
				</div>
			</a-modal>
			<a-modal v-model="isShowReportModel" dialogClass="choose-report-model" :getContainer="reportModelContainer" :footer="null" :bodyStyle="reportModelBodyStyle">
				<div class="model-cards-box">
					<a-card v-if="(isShowNewModel && toPageType === 'template') || range.weekly" hoverable ref="weekly" @click="toCreatReport('weekly')">周报</a-card>
					<a-card v-if="(isShowNewModel && toPageType === 'template') || range.monthly" hoverable ref="monthly" @click="toCreatReport('monthly')">月报</a-card>
					<a-card v-if="(isShowNewModel && toPageType === 'template') || range.seasonal" hoverable ref="seasonal" @click="toCreatReport('seasonal')">季报</a-card>
					<a-card v-if="(isShowNewModel && toPageType === 'template') || range.yearly" hoverable ref="yearly" @click="toCreatReport('yearly')">年报</a-card>
				</div>
			</a-modal>
			<a-modal v-model="isShowTemplateModel" dialogClass="choose-report-model" :getContainer="reportModelContainer" :footer="null" :bodyStyle="reportModelBodyStyle">
				<div class="model-cards-box">
					<a-card hoverable @click="toEditTemp('reports')">报告</a-card>
					<a-card hoverable @click="toEditTemp('templates')">模板</a-card>
				</div>
			</a-modal>
		</div>
	</div>
</template>

<script>
import Headers from '../components/Header'
// import mainData from '../assets/data.json'
import FormatShort from '../components/FormatShort.vue'
import StaffSearch from '../components/StaffSearch'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

export default {
	name: 'home',
	components: {
		Headers,
		FormatShort,
		StaffSearch,
		// Spin
	},
	data() {
		return {
			locale,
			isRead: JSON.parse(sessionStorage.getItem('isRead')),
			department: sessionStorage.getItem('department'),
			newStyle: {
				"padding": "40px",
				"text-align": "center",
				"font-size": "20px",
				"font-weight": "800",
				"color": "#57a6ec",
				"border": "1px solid #57a6ec",
				"border-radius": "10px"
			},
			reportModelBodyStyle: {
				"padding" : "60px 24px"
			},
			mainData: [],
			isBoss: sessionStorage.getItem('isBoss') == '1' ? true : false,
			user: sessionStorage.getItem('user'),
			isShowNewModel: false,
			isShowReportModel: false,
			isShowTemplateModel: false,
			toPageType: 'new',
			// 从这里开始是条件筛选
			screenName: '',
			dateValue: [],
			isScreened: {
				weekly: true,
				monthly: true,
				seasonal: true,
				yearly: true
			},
			isScreenedArr: [],
			// 到这里结束
			// 开始 sessionStorage 的模板同步
			range: {},
			// 到这里结束
			isSearchSpinShow: false,
			curPage: 1,
			totalNum: 50
		}
	},
	mounted() {
		this.getSessionStorage();
		this.loadReportData({page: this.curPage});
	},
	methods: {
		getSessionStorage() {
			if(sessionStorage.getItem('weekly')) {
				// console.log('wekly');
				this.range.weekly = sessionStorage.getItem('weekly');
			}
			if(sessionStorage.getItem('monthly')) {
				this.range.monthly = sessionStorage.getItem('monthly');
			}
			if(sessionStorage.getItem('seasonal')) {
				this.range.seasonal = sessionStorage.getItem('seasonal');
			}
			if(sessionStorage.getItem('yearly')) {
				this.range.yearly = sessionStorage.getItem('yearly');
			}
		},
		// 首页加载数据
		loadReportData(searchObj) {
			this.isSearchSpinShow = true;
			this.isBoss ? "" : searchObj.user = this.user;

			// 先获取报告总数
			// this.$axios.post('/getReportSum', searchObj).then((res) => {
			// 	console.log('获取到的报告总数', res.data);
			// 	this.totalNum = res.data[0].total;
			// })
			// 获取具体数据
			this.$axios.post('/getSomeReportData', searchObj).then((res) => {
				console.log('res', res.data);
				this.mainData = res.data.data;
				this.totalNum = res.data.total;
				this.isSearchSpinShow = false;
			})
		},
		reportModelContainer() {
			return document.getElementsByClassName('home-content')[0];
		},
		// 日期选择
		onPickerChange(date, dateString) {
			// console.log('date, dateString', date, dateString, this.dateValue);
			this.dateString = dateString;
			// 传进数据库搜索
		},
		// 搜索员工的名字
		getSearchName(name) {
			this.screenName = name;
		},
		// 是否选择周报什么的
		screenReport(range) {
			// console.log('range', this.isScreened);
			this.isScreened[range] = !this.isScreened[range];
		},
		// 搜索
		onhomeSearch() {
			this.isScreenedArr = [];
			for(const [key, value] of Object.entries(this.isScreened)) {
				if(value) {
					this.isScreenedArr.push(key);
				}
			}
			this.loadReportData({dateString: this.dateString, screenName: this.screenName, isScreenedArr: this.isScreenedArr, page: this.curPage});
			// console.log('点击搜索', this.dateString, this.screenName, this.isScreenedArr);
		},
		onhomeReset() {
			// console.log('点击重置', this.screenName);
			this.dateValue = [];
			this.dateString = ['',''];
			this.screenName = '';
			this.isScreened = JSON.parse(JSON.stringify({
				weekly: true,
				monthly: true,
				seasonal: true,
				yearly: true
			}));
			this.onhomeSearch();
		},
		newReport() {
			if(this.department !== 'null') {
				// this.toPageType = 'new';
				// this.isShowReportModel = true;
				if(this.isBoss) {
					this.isShowNewModel = true;
				} else {
					// this.isShowReportModel = true;
					if(Object.entries(this.range).length > 0) {
						this.isShowReportModel = true;
					} else {
						this.$message.info('等待管理员添加报告模板');
					}
				}
			} else {
				this.$message.info('请先加入部门');
			}
		},
		toShowCreateReport() {
			if(Object.entries(this.range).length > 0) {
				this.isShowReportModel = true;
			} else {
				if(this.isBoss) {
					this.$message.info('请先添加模板');
				} else {
					this.$message.info('等待管理员添加报告模板');
				}
			}
			this.toPageType = 'new';
		},
		toShowCreateTemp() {
			this.isShowReportModel = true;
			this.toPageType = 'template';
		},
		toCreatReport(range) {
			this.$router.push(`/report?type=${this.toPageType}&range=${range}${!this.isShowNewModel || this.toPageType === 'new' ? "&temp=" + sessionStorage.getItem(range) + "" : "#1"}`);
		},
		checkTemplate() {
			console.log('Object.entries(this.range).length', Object.entries(this.range).length);
			if(Object.entries(this.range).length > 0) {
				this.toPageType = 'template';
				this.isShowReportModel = true;
			} else {
				if(this.isBoss) {
					this.$message.info('请先添加模板');
				} else {
					this.$message.info('等待管理员添加报告模板');
				}
			}
		},
		openDrafts() {
			// this.$router.push('/draft');
			this.toPageType = 'draft';
			if(this.isBoss) {
				this.isShowTemplateModel = true;
			} else {
				this.toEditTemp('reports');
			}
		},
		// 进入草稿箱
		toEditTemp(type) {
			this.$router.push(`/draft?type=${type}`);
		},
		onPageChange(page) {
			// console.log('改变页码', page, pageSize);
			this.curPage = page;
			this.onhomeSearch(page);
		},
		// 全部设为已读
		setAllRead() {
			this.isSearchSpinShow = true;
			this.$axios.post('/setAllRead', {user: this.user}).then(res => {
				console.log('res', res.data);
				// 更新缓存
                sessionStorage.removeItem('isRead');
                sessionStorage.setItem('isRead', JSON.stringify(res.data));
				// 更新组件值
				this.isRead = res.data;
				this.isSearchSpinShow = false;
				this.$message.success('成功标记全部为已读');
			})
		},
		// 点击报告，更新已读列表
		readReport(reportId) {
            this.isRead.push(reportId);
            sessionStorage.removeItem('isRead');
            sessionStorage.setItem('isRead', JSON.stringify(this.isRead));

            // 更新数据库
            this.$axios.post('/updateIsRead', {user: this.user, isRead: JSON.stringify(this.isRead)}).then((res) => {
                console.log('res', res);
            })
		},
		// 导出全部
		exportExcel(isAll) {
			this.isSearchSpinShow = true;
			var exportObj = {
				isAll: isAll,
				isBoss: this.isBoss,
				user: this.user,
			}
			if(!isAll) {
				exportObj.data = this.mainData
			}
			this.$axios.post('/exportExcel', exportObj).then((res) => {
				// console.log('导出'+isAll+'数据返回', res.data);
				this.isSearchSpinShow = false;
				res.data === 'success' ? this.$message.success('导出成功~') : this.$message.error('导出失败');
			})
			// console.log('导出全部');
		},
	}
}
</script>
<style lang="less">
.home {
	height: 100%;
	.home-content {
		height: 93%;
		padding: 25px 30px;
		.home-aside {
			float: left;
			width: 14%;
		}
		p {
			margin: 0;
		}
		.ant-card {
			margin-bottom: 20px;
		}
		main {
			position: relative;
			width: 85%;
			height: 100%;
			padding: 20px 30px;
			border: 1px solid #57a6ec;
			border-radius: 10px;
			overflow-y: auto;
			.home-search {
				margin-bottom: 10px;
				button {
					margin-left: 10px;
				}
			}
			.report-time {
				display: inline-block;
				margin-right: 10px;
				width: 300px;
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
			// .ant-spin-nested-loading {
			// 	// height: 85%;
			// 	overflow-y: auto;
			// }
			.home-pagination {
				text-align: center;
			}
		}
		.model-cards-box {
			width: 100%;
			display: flex;
			justify-content: space-evenly;
			div {
				margin: 0;
			}
		}
		// .choose-report-model {
			// width: 80%!important;
		// }
		::-webkit-scrollbar {
			display: none;
		}
	}
	.all-read {
		color: #57a6ec;
		font-size: 12px;
		cursor: pointer;
		margin: -8px 0 5px 0;
		&:hover {
			color: #87c3f7;
		}
	}
}
.clearfix::after {
	content: '';
	height: 0;
	width: 0;
	display: inline-block;
	clear: both;
}
</style>
