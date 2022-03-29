<template>
	<div class="manageStaff">
		<Headers></Headers>
		<main>
			<a-tabs default-active-key="more" tabPosition="left" size="large">
				<a-tab-pane key="more" tab="添加新员工">
					<div class="new-staff-search">
						<StaffSearch @getSearchData="getSearchData"></StaffSearch>
					</div>
					<div class="new-staff-add">
						<a-card v-for="data in staffData" :key="data.staffId" style="width: 400px" hoverable @click="nStaffChoose(data)">
							<span>{{data.staffId}}</span>
							<span>{{data.staffName}}</span>
							<span class="staff-choose">{{data.department === department ? '已选' : '未选'}}</span>
						</a-card>
					</div>
					<div class="new-staff-confirm-model">
						<a-modal v-model="isShowNStaffModeln" title="确定添加该员工进入部门？" cancelText="取消" @ok="nStaffConfirm(nStaffInfo)">
							<p>工号：{{nStaffInfo.staffId}}</p>
							<p>姓名：{{nStaffInfo.staffName}}</p>
						</a-modal>
					</div>
				</a-tab-pane>
				<a-tab-pane key="less" tab="移除旧员工">
					<div class="less-staff-search">
						<StaffSearch @getSearchData="getSearchDatal"></StaffSearch>
					</div>
					<div class="less-staff-add">
						<a-card v-for="data in lStaffData" :key="data.staffId" style="width: 400px" hoverable @click="lStaffChoose(data)">
							<span>{{data.staffId}}</span>
							<span>{{data.staffName}}</span>
							<span class="staff-choose">{{data.department === department ? '已选' : '未选'}}</span>
						</a-card>
					</div>
					<div class="less-staff-confirm-model">
						<a-modal v-model="isShowNStaffModell" title="确定将该员工移出部门？" cancelText="取消" @ok="lStaffConfirm(lStaffInfo)">
							<p>工号：{{lStaffInfo.staffId}}</p>
							<p>姓名：{{lStaffInfo.staffName}}</p>
						</a-modal>
					</div>
				</a-tab-pane>
			</a-tabs>
		</main>
	</div>
</template>

<script>
import Headers from '../components/Header'
import StaffSearch from '../components/StaffSearch'
export default {
	name: 'ManageStaff',
	components: {
		Headers,
		StaffSearch
	},
	data() {
		return {
			staffData: [],
			lStaffData: [],
			nStaffInfo: {},
			lStaffInfo: {},
			isShowNStaffModeln: false,
			isShowNStaffModell: false,
			department: sessionStorage.getItem('department')
		}
	},
	methods: {
		// 从组件中获取到的搜索数据
		getSearchData(data) {
			// console.log('组件传出来的data', data);
			this.staffData = data;
		},
		nStaffChoose(val) {
			// console.log('val', val);
			this.nStaffInfo = val;
			if(val.department !== this.department) {
				this.isShowNStaffModeln = true;
			}
		},
		nStaffConfirm(val) {
			console.log('确定添加该员工', val);
			this.$axios.post('http://127.0.0.1:88/updateStaff', {staffId: val.staffId, department: this.department}).then((res) => {
				console.log('res', res);
				this.$message.success('添加成功');
			})
			this.isShowNStaffModeln = false;
		},
		getSearchDatal(data) {
			// console.log('组件传出来的data', data);
			this.lStaffData = data;
		},
		lStaffChoose(val) {
			// console.log('val', val);
			this.lStaffInfo = val;
			if(val.department === this.department) {
				this.isShowNStaffModell = true;
			}
		},
		lStaffConfirm(val) {
			console.log('确定移出该员工', val);
			this.$axios.post('http://127.0.0.1:88/updateStaff', {staffId: val.staffId, department: null}).then((res) => {
				console.log('res', res);
				this.$message.success('移出成功');
			})
			this.isShowNStaffModell = false;
		}
	}
}
</script>
<style lang="less">
.manageStaff {
	main {
		padding: 10px;
		button {
			margin-left: 10px;
		}
		.ant-card {
			margin-bottom: 10px;
			.ant-card-body {
				display: flex;
				justify-content: space-between;
				span {
					// flex: 1;
					width: 33%;
					text-align: center;
				}
				.staff-choose {
					width: 50px;
					border: 1px solid #57a6ec;
					border-radius: 5px;
				}
			}
		}
	}
}
</style>
