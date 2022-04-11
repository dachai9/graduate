<template>
	<div class="draft-main">
		<Header></Header>
		<div class="draft-content">
			<a-button type="dashed" size="small" class="go-back" @click="goBack">返回</a-button>
			<a-spin :spinning="isSearchSpinShow">
				<main v-if="path.type==='reports'">
					<FormatShort :mainData="mainData" @getDraftData="getDraftData" @toggleSpin="toggleSpin"></FormatShort>
					<!-- 点击加载更多 -->
					<div class="home-pagination"><a-pagination :current="curPage" :total="totalNum" size="small" @change="onPageChange" /></div>
				</main>
				<main v-if="path.type==='templates'">
					<TempShort :mainData="mainData" @getAllTempData="getAllTempData" @toggleSpin="toggleSpin"></TempShort>
					<!-- 点击加载更多 -->
					<div class="home-pagination"><a-pagination :current="curPage" :total="totalNum" size="small" @change="onPageChange" /></div>
				</main>
			</a-spin>
		</div>
	</div>
</template>

<script>
import Header from '../components/Header.vue'
// import mainData from '../assets/data.json'
import FormatShort from '../components/FormatShort.vue'
import TempShort from '../components/TempShort.vue'
export default {
	name: 'Draft',
	components: {
        Header,
		FormatShort,
		TempShort
	},
	data() {
		var path = {};
		location.search.slice(1, location.search.length).split('&').forEach((item) => {
			path[item.split('=')[0]] = item.split('=')[1];
		})
		return {
			path,
			mainData: [],
			isBoss: sessionStorage.getItem('isBoss') == '1' ? true : false,
			authorName: sessionStorage.getItem('user'),
			isSearchSpinShow: false,
			curPage: 1,
			totalNum: 50
		}
	},
	mounted() {
		console.log('path', this.path);
		if(this.path.type === 'reports') {
			this.getDraftData();
		} else {
			this.getAllTempData();
		}
	},
	methods: {
		getDraftData(page) {
			this.isSearchSpinShow = true;
			var searchObj = {
				authorName: this.authorName,
				page: page || 1
			}
			this.$axios.post('/getDraftData', searchObj).then((res) => {
				console.log('searchres', res.data);
				this.mainData = res.data.data;
				this.totalNum = res.data.total;
				this.isSearchSpinShow = false;
			})
		},
		getAllTempData(page) {
			this.isSearchSpinShow = true;
			var searchObj = {
				authorName: this.authorName,
				page: page || 1
			}
			this.$axios.post('/getAllTempData', searchObj).then((res) => {
				console.log('searchres', res.data);
				this.mainData = res.data.data;
				this.totalNum = res.data.total;
				this.isSearchSpinShow = false;
			})
		},
		toggleSpin(state) {
			this.isSearchSpinShow = state;
		},
		onPageChange(page) {
			this.curPage = page;
			if(this.path.type === 'reports') {
				this.getDraftData(page);
			} else {
				this.getAllTempData(page);
			}
		},
		goBack() {
			this.$router.push('/home');
			// history.back()
		}
	}
}
</script>
<style lang="less">
.draft-main {
	height: 100%;
	.draft-content {
		width: 90%;
		height: 90%;
		margin: 0 auto;
		padding: 30px 30px;
		p {
			margin: 0;
		}
		.ant-card {
			margin-bottom: 20px;
		}
		.ant-spin-nested-loading {
			height: 100%;
		}
		.ant-spin-container {
			height: 100%;
		}
		main {
			width: 100%;
			height: 100%;
			padding: 20px 150px;
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
		.go-back {
			// border: none;
			// font-size: 25px;
			// color: #57a6ec;
			position: absolute;
			left: 150px;
			top: 100px;
			z-index: 10;
		}
		.home-pagination {
			text-align: center;
		}
		::-webkit-scrollbar {
			display: none;
		}
	}
}
</style>
 