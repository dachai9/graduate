<template>
	<div class="nform-main">
        <main>
            <a-form-model :ref="insertReportData" :model="insertReportData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="标题" required>
                    <a-input :size="size" v-model="insertReportData.title" :disabled="type.type === 'detail'" />
                </a-form-model-item>
                <a-form-model-item :model="allFormData" v-for="(domain, index) in dynamicForm" :key="index" :label="domain.title" :required="domain.require">
                    <a-input v-if="domain.name === 'singleLine'" :size="size" v-model="allFormData['singleLine'+index]" :title="allFormData['singleLine'+index]" :disabled="type.type === 'detail'" />
                    <a-input v-if="domain.name === 'multiLine'" type="textarea" :size="size" v-model="allFormData['multiLine'+index]" :title="allFormData['multiLine'+index]" :disabled="type.type === 'detail'" />
                    <a-select v-if="domain.name === 'dropBox'" :size="size" v-model="allFormData['dropBox'+index]" :disabled="type.type === 'detail'">
                        <a-select-option :value="option" v-for="(option, i) in domain.option.split(',')" :key="i">
                            {{option}}
                        </a-select-option>
                    </a-select>
                    <a-radio-group v-if="domain.name === 'radioBox'" :size="size" v-model="allFormData['radioBox'+index]" :disabled="type.type === 'detail'">
                        <a-radio :value="option" v-for="(option, i) in domain.option.split(',')" :key="i">
                            {{option}}
                        </a-radio>
                    </a-radio-group>
                    <a-checkbox-group v-if="domain.name === 'checkBox'" v-model="allFormData['checkBox'+index]" :disabled="type.type === 'detail'">
                        <a-checkbox :value="option" v-for="(option, i) in domain.option.split(',')" :key="i">
                            {{option}}
                        </a-checkbox>
                    </a-checkbox-group>
                    <a-switch v-if="domain.name === 'switchBox'" :size="size" v-model="allFormData['switchBox'+index]" :disabled="type.type === 'detail'" />
                    <a-date-picker :locale="locale" v-if="domain.name === 'datePickerBox'" show-time type="date" :size="size" valueFormat="YYYY-MM-DD HH:mm:ss" v-model="allFormData['datePickerBox'+index]" :disabled="type.type === 'detail'" />
                    <a-range-picker :locale="locale" v-if="domain.name === 'rangeBox'" show-time type="date" :size="size" valueFormat="YYYY-MM-DD HH:mm:ss" v-model="allFormData['rangeBox'+index]" :disabled="type.type === 'detail'" />
                </a-form-model-item>
            </a-form-model>
        </main>
        <footer v-if="type.type === 'new' || type.type === 'draft'">
            <a-button type="default" @click="saveToDraft">保存到草稿箱</a-button>
			<a-button type="primary" @click="saveToSubmit">保存并提交</a-button>
            <a-popconfirm title="确定删掉该报告？" ok-text="是的" cancel-text="不了吧" @confirm="deleteReport">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a-button v-if="type.type === 'draft'" type="danger">删除</a-button> 
            </a-popconfirm>
        </footer>
        <footer v-if="type.type === 'detail'">
            <a-button type="default" @click="returnHome">返回首页</a-button>
        </footer>
	</div>
</template>

<script>
import moment from 'moment'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
export default {
	name: 'nform',
	props: {
		dynamicForm: Array,
        formatElseData: Object,
        type: Object
	},
    data() {
        return {
            locale,
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
            insertReportData: {
                title: '',
                author: sessionStorage.getItem('user'),
                range: ''
            },
            size: 'default',
            allFormData: {},
            // 对照表
            formDatabase: {
                'singleLine': 's',
                'multiLine': 'm',
                'dropBox': 'd',
                'radioBox': 'r',
                'checkBox': 'c',
                'switchBox': 'j',
                'datePickerBox': 't',
                'rangeBox': 'mt'
            },
			// 对照表
            revertFormDatabase: {
                's': 'singleLine',
                'm': 'multiLine',
                'd': 'dropBox',
                'r': 'radioBox',
                'c': 'checkBox',
                'j': 'switchBox',
                't': 'datePickerBox',
                'mt': 'rangeBox'
            },
            path: {},
            detailData: {},
        }
    },
    beforeMount() {
        this.size = this.formatElseData.size;
        // console.log('detailData', this.detailData, this.size);
        // console.log('formatElseData', this.formatElseData);
        // this.insertReportData.title = this.formatElseData.title;
        // this.insertReportData.title = '1';
    },
    mounted() {
        if(this.type.type === 'detail' || this.type.type === 'draft'){
            location.search.slice(1, location.search.length).split('&').forEach((item) => {
                this.path[item.split('=')[0]] = item.split('=')[1];
            })
            // console.log('formatElseData', this.formatElseData, this.formatElseData.title, this.formatElseData.size);
            // this.insertReportData.title = this.formatElseData.title;
            this.$emit('toggleSpin', true);
			this.$axios.get(`/getReportData?id=${this.path.id}`).then((res) => {
				console.log('获取到的数据', res);
				this.detailData = res.data[0];
				this.insertReportData.title = this.detailData.title;
				// 取消加载
				this.changeFormData();
                this.$emit('toggleSpin', false);
			})
        }
        
    },
    methods: {
        // 修改传入的表单具体数据
        changeFormData() {
            var content = JSON.parse(this.detailData.content.replace(/\r/g,"\\r").replace(/\n/g,"\\n"));
            console.log('改之前获取到的content', content);
            var allFormData = {};
            for(let i=0; i<this.dynamicForm.length; i++) {
                // this.allFormData.dropBox0 = data.d[0]
                // this.allFormData[this.dynamicForm[i].name + i] = content[this.formDatabase[this.dynamicForm[i].name]][0];
                allFormData[this.dynamicForm[i].name + i] = content[this.formDatabase[this.dynamicForm[i].name]][0];
                content[this.formDatabase[this.dynamicForm[i].name]].splice(0, 1);
                // 删去之后
                // console.log('content[this.formDatabase[this.dynamicForm[i].name]]', content[this.formDatabase[this.dynamicForm[i].name]]);
            }
            this.allFormData = JSON.parse(JSON.stringify(allFormData));
            console.log('this.allFormData', this.allFormData);
        },
        // 新增页面的修改数据类型
        changeDataFormat() {
            this.$emit('toggleSpin', true);
            // 传入数据
            // 如果是草稿箱修改，则修改数据，而不是新增
            if(this.type.type === 'draft') {
                this.insertReportData.change = true;
                this.insertReportData.id = this.type.id;
            }
            this.insertReportData.range = this.formatElseData.range;
            this.insertReportData.tempId = sessionStorage.getItem(this.formatElseData.range);
            // 修改数据
            var changedData = {};
            console.log('所有的this.allFormData', this.dynamicForm, this.allFormData);
            var shortReport = '';
            for(let i=0; i<this.dynamicForm.length; i++) {
                shortReport += this.dynamicForm[i].title + '：' + this.allFormData[this.dynamicForm[i].name + '' + i] + '     ';
            }
            console.log('处理后的shortReport', shortReport);
            // debugger;
            this.insertReportData.shortCut = shortReport;
            for(const [key, value] of Object.entries(this.allFormData)) {
                var type = key.replace(/[0-9]+/g, '');
                if(!changedData[this.formDatabase[type]]) {
                    changedData[this.formDatabase[type]] = [];
                }
                changedData[this.formDatabase[type]].push(value);
            }
            this.insertReportData.content = JSON.stringify(changedData);
            // console.log('this.insertReportData', JSON.stringify(changedData));
            // 提交数据
            this.$axios.post('/updateReportData', this.insertReportData).then(() => {
                // console.log('res', res.data[0].id);
                // 跳转到详情
                this.$router.push('/draft?type=reports');
                // if(this.type.type === 'draft') {
                // } else {
                //     this.$router.push(`/report?type=detail&range=${this.insertReportData.range}&id=${res.data[0].id}&temp=${this.insertReportData.tempId}`);
                //     this.$router.go(0);
                // }
                this.$emit('toggleSpin', false);
            })
        },
        saveToDraft() {
            this.insertReportData.submitTime = '';
            this.insertReportData.saveTime = new moment().format('YYYY-MM-DD HH:mm:ss');
            this.changeDataFormat();
            // 保存 saveTime
            console.log('点击保存进草稿箱', this.insertReportData);
        },
        saveToSubmit() {
            this.insertReportData.saveTime = '';
            this.insertReportData.submitTime = new moment().format('YYYY-MM-DD HH:mm:ss');
            this.changeDataFormat();
            // 保存提交时间
            console.log('点击提交', this.insertReportData);
        },
        deleteReport() {
            // console.log('确定');
            this.$emit('toggleSpin', true);
            this.$axios.post('/deleteAReport', {id: this.type.id}).then(() => {
                // console.log('res', res.data);
                this.$router.push('/draft');
                this.$emit('toggleSpin', false);
            })
        },
		returnHome() {
			this.$router.push('/home')
		}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.nform-main {
    /deep/ .ant-input-disabled, /deep/ .ant-select-disabled .ant-select-selection {
        background-color: #fff;
        color: #666;
    }
    footer {
        text-align: center;
        button {
            margin: 0 10px;
        }
    }
}
</style>
