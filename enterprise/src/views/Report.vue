<template>
	<div class="nReport">
		<Header></Header>
		<div class="nReport-content">
			<main class="nReport-main">
                <Nform v-if="path.type==='new'" :detailData="detailData" :formatData="formatData"></Nform>
				<TempForm v-if="path.type==='template'" :range="path.range"></TempForm>
			</main>
            <footer class="nReport-footer">
                <a-button v-if="path.type === 'new'" type="default" @click="saveToDraft">保存到草稿箱</a-button>
                <a-button v-if="path.type === 'new'" type="primary" @click="saveToSubmit">保存并提交</a-button>
                <a-button v-if="path.type === 'detail'" type="default" @click="returnHome">返回首页</a-button>
            </footer>
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
			path[item.split('=')[0]] = item.split('=')[1]
		})
		console.log('path', path);
		return {
			path: path
		}
	},
	methods: {
        saveToDraft() {
            console.log('点击保存进草稿箱');
        },
        saveToSubmit() {
            console.log('点击保存并提交');
        },
		returnHome() {
			this.$router.push('/home')
		}
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
