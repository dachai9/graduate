<template>
	<div class="nReport">
		<Header></Header>
		<div class="nReport-content">
			<main class="nReport-main">
				<Nform v-if="path.type==='new'" :type="path.type" :dynamicForm="formatData" :formatElseData="formatElseData"></Nform>
				<Nform v-if="path.type==='detail'" :type="path.type" :detailData="allFormData" :dynamicForm="formatData" :formatElseData="formatElseData"></Nform>
				<TempForm v-if="path.type==='template'" :range="path.range"></TempForm>
				<!-- <footer class="nReport-footer">
					<a-button v-if="path.type === 'detail'" type="default" @click="returnHome">返回首页</a-button>
				</footer> -->
			</main>
		</div>
	</div>
</template>

<script>
import Header from '../components/Header.vue'
import Nform from '../components/Nform.vue'
import TempForm from '../components/TempForm'
export default {
	name: 'nReport',
	components: {
		Header,
        Nform,
		TempForm
	},
	data() {
		var path = {};
		location.search.slice(1, location.search.length).split('&').forEach((item) => {
			path[item.split('=')[0]] = item.split('=')[1];
		})
		console.log('path', path);
		return {
			path,
			formatData: [],
			// 对照表
            formDatabase: {
                's': 'singleLine',
                'm': 'multiLine',
                'd': 'dropBox',
                'r': 'radioBox',
                'c': 'checkBox',
                'j': 'switchBox',
                't': 'datePickerBox',
                'mt': 'rangeBox'
            },
			// 其他信息，如size
			formatElseData: {},
			detailData: {},
			allFormData: {}
		}
	},
	// mounted:{},
	beforeMount() {
		var rangeId = sessionStorage.getItem(this.path.range);
		// console.log('weekly', rangeId);
		// 加载
		this.$axios.get(`http://127.0.0.1:88/getTemp?id=${rangeId}`).then((res) => {
			// console.log('res', res.data[0]);
			for(const [key, value] of Object.entries(JSON.parse(res.data[0].temp))) {
				if(key === 'size') {
					this.formatElseData.size = value;
					continue;
				}
				if(key === 'range') {
					this.formatElseData.range = value;
					continue;
				}
				for(let i=0; i < value.length; i++) {
					let valueArr = value[i].split('&@#');
					if(valueArr[1] > this.formatData.length) {
						this.formatData.push({
							name: this.formDatabase[key],
							require: JSON.parse(valueArr[0]),
							title: valueArr[2],
							option: valueArr[3] || ''
						})
					} else {
						this.formatData.splice(valueArr[1], 0, {
							name: this.formDatabase[key],
							require: JSON.parse(valueArr[0]),
							title: valueArr[2],
							option: valueArr[3] || ''
						})
					}
				}
			}
			// "{"range":"weekly","size":"default","m":["true&@#k"]}"
			// 取消加载
		})
	},
	methods: {
        saveToDraft() {
            console.log('点击保存进草稿箱');
        },
        saveToSubmit() {
            console.log('点击保存并提交');
        },
	}
}
</script>
<style lang="less">
.nReport {
	height: 100%;
	.nReport-content {
		height: 90%;
		padding: 30px 60px;
        .nReport-main {
            height: 100%;
            padding: 30px;
            border: 1px solid #57a6ec;
			border-radius: 10px;
			overflow-y: auto;
		}
        .nReport-footer {
            text-align: center;
            button {
                margin: 0 10px;
            }
        }
		::-webkit-scrollbar {
			display: none;
        }
	}
}
</style>
