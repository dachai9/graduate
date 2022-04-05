<template>
	<div class="draft-main">
		<Header></Header>
		<div class="draft-content">
			<a-spin :spinning="isSearchSpinShow">
				<main>
					<FormatShort :mainData="mainData" @getDraftData="getDraftData" @toggleSpin="toggleSpin"></FormatShort>
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
export default {
	name: 'Draft',
	components: {
        Header,
		FormatShort,
	},
	data() {
		return {
			mainData: [],
			isBoss: sessionStorage.getItem('isBoss') == '1' ? true : false,
			authorName: sessionStorage.getItem('user'),
			isSearchSpinShow: false,
			curPage: 1,
			totalNum: 50
		}
	},
	mounted() {
		this.getDraftData();
	},
	methods: {
		getDraftData(page) {
			this.isSearchSpinShow = true;
			var searchObj = {
				authorName: this.authorName,
				page: page || 1
			}
			this.$axios.post('http://127.0.0.1:88/getDraftData', searchObj).then((res) => {
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
			this.getDraftData(page);
		}
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
		.ant-spin-nested-loading {
			height: 100%;
		}
		.ant-spin-container {
			height: 100%;
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
		.home-pagination {
			text-align: center;
		}
		::-webkit-scrollbar {
			display: none;
		}
	}
}
</style>
 