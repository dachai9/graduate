<template>
	<div class="home">
		<Headers></Headers>
		<div class="home-content">
			<aside class="home-aside">
				<a-card hoverable :bordered="false" style="width: 170px; border-radius: 10px" :bodyStyle="newStyle" @click="newReport">
					<p>新增报告</p>
				</a-card>
				<a-card v-if="isBoss" hoverable :bordered="false" style="width: 170px; border-radius: 10px" :bodyStyle="newStyle" @click="checkTemplate()">
					<p>查看模板</p>
				</a-card>
				<a-card hoverable :bordered="false" style="width: 170px; border-radius: 10px" :bodyStyle="newStyle" @click="openDrafts">
					<p>草稿箱</p>
				</a-card>
			</aside>
			<main>
				<a-spin :spinning="isSearchSpinShow">
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
						</div>
						<div class="report-div">
							<a-button v-if="range.weekly" ref="weekly" :type="isScreened.weekly ? 'primary' : 'default'" @click="screenReport('weekly')">周报</a-button>
							<a-button v-if="range.monthly" ref="monthly" :type="isScreened.monthly ? 'primary' : 'default'" @click="screenReport('monthly')">月报</a-button>
							<a-button v-if="range.seasonal" ref="seasonal" :type="isScreened.seasonal ? 'primary' : 'default'" @click="screenReport('seasonal')">季报</a-button>
							<a-button v-if="range.yearly" ref="yearly" :type="isScreened.yearly ? 'primary' : 'default'" @click="screenReport('yearly')">年报</a-button>
						</div>
					</div>
					<FormatShort :mainData="mainData"></FormatShort>
					<!-- 点击加载更多 -->
				</a-spin>
			</main>
			<a-modal v-model="isShowReportModel" dialogClass="choose-report-model" :getContainer="reportModelContainer" :footer="null" :bodyStyle="reportModelBodyStyle">
				<div class="model-cards-box">
					<a-card v-if="toPageType=='template'||range.weekly" hoverable ref="weekly" @click="toCreatReport('weekly')">周报</a-card>
					<a-card v-if="toPageType=='template'||range.monthly" hoverable ref="monthly" @click="toCreatReport('monthly')">月报</a-card>
					<a-card v-if="toPageType=='template'||range.seasonal" hoverable ref="seasonal" @click="toCreatReport('seasonal')">季报</a-card>
					<a-card v-if="toPageType=='template'||range.yearly" hoverable ref="yearly" @click="toCreatReport('yearly')">年报</a-card>
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
// import Spin from '../components/Spin.vue'
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
			isShowReportModel: false,
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
			isSearchSpinShow: false
		}
	},
	mounted() {
		if(sessionStorage.getItem('weekly')) {
			console.log('wekly');
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
		this.loadReportData({});
	},
	methods: {
		// 首页加载数据
		loadReportData(searchObj) {
			if(this.isBoss) {
				this.isSearchSpinShow = true;
				this.$axios.post('http://127.0.0.1:88/getSomeReportData', searchObj).then((res) => {
					console.log('res', res.data);
					this.mainData = res.data;
					this.isSearchSpinShow = false;
				})
			} else {
				this.isSearchSpinShow = true;
				searchObj.user = sessionStorage.getItem('user');
				this.$axios.post('http://127.0.0.1:88/getMyReportData', searchObj).then((res) => {
					console.log('res', res.data);
					this.mainData = res.data;
					this.isSearchSpinShow = false;
				})
			}
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
			this.loadReportData({dateString: this.dateString, screenName: this.screenName, isScreenedArr: this.isScreenedArr});
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
				this.toPageType = 'new';
				this.isShowReportModel = true;
			} else {
				this.$message.info('请先加入部门');
			}
		},
		toCreatReport(range) {
			this.$router.push(`/report?type=${this.toPageType}&range=${range}`);
		},
		checkTemplate() {
			this.toPageType = 'template';
			this.isShowReportModel = true;
		},
		openDrafts() {
			this.$router.push('/draft');
		},
	}
}
</script>
<style lang="less">
.home {
	height: 100%;
	.home-content {
		height: 90%;
		padding: 30px 30px;
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
}
.clearfix::after {
	content: '';
	height: 0;
	width: 0;
	display: inline-block;
	clear: both;
}
</style>
