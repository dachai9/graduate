<template>
	<div class="nform-main">
        <main>
            <a-form-model :ref="insertReportData" :model="insertReportData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="标题" required>
                    <a-input :size="size" v-model="insertReportData.title" />
                </a-form-model-item>
                <a-form-model-item :model="allFormData" v-for="(domain, index) in dynamicForm" :key="index" :label="domain.title" :required="domain.require">
                    <a-input v-if="domain.name === 'singleLine'" :size="size" v-model="allFormData['singleLine'+index]" />
                    <a-input v-if="domain.name === 'multiLine'" type="textarea" :size="size" v-model="allFormData['multiLine'+index]" />
                    <a-select v-if="domain.name === 'dropBox'" :size="size" v-model="allFormData['dropBox'+index]">
                        <a-select-option :value="option" v-for="(option, i) in domain.option.split(',')" :key="i">
                            {{option}}
                        </a-select-option>
                    </a-select>
                    <a-radio-group v-if="domain.name === 'radioBox'" :size="size" v-model="allFormData['radioBox'+index]">
                        <a-radio :value="option" v-for="(option, i) in domain.option.split(',')" :key="i">
                            {{option}}
                        </a-radio>
                    </a-radio-group>
                    <a-checkbox-group v-if="domain.name === 'checkBox'" v-model="allFormData['checkBox'+index]">
                        <a-checkbox :value="option" v-for="(option, i) in domain.option.split(',')" :key="i">
                            {{option}}
                        </a-checkbox>
                    </a-checkbox-group>
                    <a-switch v-if="domain.name === 'switchBox'" :size="size" v-model="allFormData['switchBox'+index]" />
                    <a-date-picker :locale="locale" v-if="domain.name === 'datePickerBox'" show-time type="date" :size="size" v-model="allFormData['datePickerBox'+index]" />
                    <a-range-picker :locale="locale" v-if="domain.name === 'rangeBox'" show-time type="date" :size="size" v-model="allFormData['rangeBox'+index]" />
                </a-form-model-item>
            </a-form-model>
        </main>
        <footer>
            <a-button type="default" @click="saveToDraft">保存到草稿箱</a-button>
			<a-button type="primary" @click="saveToSubmit">保存并提交</a-button>
        </footer>
	</div>
</template>

<script>
import moment from 'moment'
export default {
	name: 'nform',
	props: {
		dynamicForm: Array,
        formatElseData: Object
	},
    data() {
        return {
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
            }
        }
    },
    beforeMount() {
        this.size = this.formatElseData.size;
    },
    methods: {
        changeDataFormat() {
            // 传入数据
            this.insertReportData.range = this.formatElseData.range;
            this.insertReportData.tempId = sessionStorage.getItem(this.formatElseData.range);
            // 修改数据
            var changedData = {};
            for(const [key, value] of Object.entries(this.allFormData)) {
                var type = key.replace(/[0-9]+/g, '');
                if(!changedData[this.formDatabase[type]]) {
                    changedData[this.formDatabase[type]] = [];
                }
                changedData[this.formDatabase[type]].push(value);
            }
            this.insertReportData.content = JSON.stringify(changedData);
            // console.log('this.insertReportData', JSON.stringify(changedData));
        },
        saveToDraft() {
            this.changeDataFormat();
            // 保存 saveTime
            this.insertReportData.submitTime = '';
            this.insertReportData.saveTime = new moment().format('YYYY-MM-DD HH:mm:ss');
            console.log('点击保存进草稿箱', this.insertReportData);
        },
        saveToSubmit() {
            // 保存提交时间
            this.insertReportData.saveTime = '';
            this.insertReportData.submitTime = new moment().format('YYYY-MM-DD HH:mm:ss');
            console.log('点击提交', this.insertReportData);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.nform-main {
    footer {
        text-align: center;
        button {
            margin: 0 10px;
        }
    }
}
</style>
