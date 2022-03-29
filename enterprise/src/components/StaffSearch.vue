<template>
	<div class="staffSearch-main">
        <a-auto-complete v-model="staffName" :data-source="staffArr" :style="`width: ${width}`" placeholder="请输入员工工号或姓名" @change="mStaffGetName(staffName)" />
        <a-button type="primary" icon="search" @click="mStaffSearch" v-if="ishomeStaff"></a-button>
	</div>
</template>

<script>
// import staffData from '../assets/staffData.json'
export default {
	name: 'staffSearch',
	props: {
		ishomeStaff: {
			type: Boolean,
			default: true
		},
		width: {
			type: String,
			default: '400px'
		},
		screenName: String
	},
    data() {
        return {
			staffName: this.screenName,
			staffArr: [],
			staffData: []
        }
    },
    methods: {
		mStaffGetName(val) {
			// this.staffArr = !val ? [] : [val + 'a', val + 'b'];
			this.$axios.post('http://127.0.0.1:88/searchStaff', {staffName: val}).then((res) => {
				// console.log('res', res.data);
				var arr = [];
				res.data.forEach(item => {
					arr.push(item.staffName)
				})
				// arr.push()
				this.staffArr = !val ? [] : arr;
				this.staffData = res.data;
				// console.log(this.staffData);
			})
		},
		mStaffSearch() {
			// console.log('val', this.staffName);
            // 返回搜索结果数据集
            this.$emit('getSearchData', this.staffData);
		},
    },
	computed: {
		// staffName: {
		// 	get() {
		// 		return this.screenName;
		// 	},
		// 	set(newValue) {
		// 		return newValue;
		// 	},
		// }
	},
	watch: {
		staffName(val) {
			// console.log('val', val);
			this.$emit('searchName', val);
		},
		screenName(val) {
			this.staffName = val
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.staffSearch-main {
    margin-bottom: 10px;
}
</style>
