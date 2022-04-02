<template>
	<div class="draft-main">
		<Header></Header>
		<div class="draft-content">
			<a-spin :spinning="isSearchSpinShow">
				<main>
					<FormatShort :mainData="mainData" @getDraftData="getDraftData" @toggleSpin="toggleSpin"></FormatShort>
					<!-- 点击加载更多 -->
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
			isSearchSpinShow: false
		}
	},
	mounted() {
		this.getDraftData();
	},
	methods: {
		getDraftData() {
			this.isSearchSpinShow = true;
			this.$axios.post('http://127.0.0.1:88/getDraftData', {authorName: this.authorName}).then((res) => {
				// console.log('res', res);
				this.mainData = res.data;
				this.isSearchSpinShow = false;
			})
		},
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
		toggleSpin(state) {
			this.isSearchSpinShow = state;
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
 