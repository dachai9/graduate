<template>
	<div class="tempform-main">
        <main>
            <a-form-model :ref="nReportForm" :model="nReportForm" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="标题" required>
                    <a-input :size="size" />
                </a-form-model-item>
                <a-form-model-item v-for="(domain, index) in dynamicForm" :key="index" :label="domain.title" :required="domain.require">
                    <a-input v-if="domain.name === 'singleLine'" :size="size" />
                    <a-input v-if="domain.name === 'multiLine'" type="textarea" :size="size" />
                    <a-select v-if="domain.name === 'dropBox'" :size="size">
                        <a-select-option :value="option" v-for="(option, i) in domain.option.split(',')" :key="i">
                            {{option}}
                        </a-select-option>
                    </a-select>
                    <a-radio-group v-if="domain.name === 'radioBox'" :size="size">
                        <a-radio :value="option" v-for="(option, i) in domain.option.split(',')" :key="i">
                            {{option}}
                        </a-radio>
                    </a-radio-group>
                    <a-checkbox-group v-if="domain.name === 'checkBox'">
                        <a-checkbox :value="option" v-for="(option, i) in domain.option.split(',')" :key="i">
                            {{option}}
                        </a-checkbox>
                    </a-checkbox-group>
                    <a-switch v-if="domain.name === 'switchBox'" :size="size" />
                    <a-date-picker :locale="locale" v-if="domain.name === 'datePickerBox'" show-time type="date" :size="size" />
                    <a-range-picker :locale="locale" v-if="domain.name === 'rangeBox'" show-time type="date" :size="size" />
                    <a-icon type="minus-circle-o" @click="removeDomain(index)" :size="size" />
                </a-form-model-item>

            </a-form-model>
            <div class="btn-group">
                <a-button ref="changeSize" @click="changeSize">字体大小</a-button>
                <a-button ref="singleLine" @click="newFormItemPopup('singleLine')">单行输入框</a-button>
                <a-button ref="multiLine" @click="newFormItemPopup('multiLine')">多行输入框</a-button>
                <a-button ref="dropBox" @click="newFormItemPopup('dropBox')">下拉框</a-button>
                <a-button ref="radioBox" @click="newFormItemPopup('radioBox')">单选框</a-button>
                <a-button ref="checkBox" @click="newFormItemPopup('checkBox')">多选框</a-button>
                <a-button ref="switchBox" @click="newFormItemPopup('switchBox')">开关</a-button>
                <a-button ref="datePickerBox" @click="newFormItemPopup('datePickerBox')">日期时间选择框</a-button>
                <a-button ref="rangeBox" @click="newFormItemPopup('rangeBox')">时段选择框</a-button>
            </div>
            <a-modal v-model="isShowNewFormItemPopup" title="请输入相关信息" @ok="newFormConfirm" cancelText="取消">
                <div>
                    <a-form-model :label-col="{span: 4}" :wrapper-col="{span: 14}">
                        <a-form-model-item label="是否必填" required>
                            <a-switch default-checked @change="()=>{formInfo.require = !formInfo.require}" />
                        </a-form-model-item>
                        <a-form-model-item label="标题" required>
                            <a-input type="text" v-model="formInfo.title"></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="选项" required v-if="formInfo.name === 'dropBox' || formInfo.name === 'radioBox' || formInfo.name === 'checkBox'">
                            <a-input type="text" v-model="formInfo.option" placeholder="多个选项用逗号隔开，相同选项将合并"></a-input>
                        </a-form-model-item>
                    </a-form-model>
                    <!-- <div style="margin: 15px 0;">
                        是否必填：<a-switch default-checked @change="()=>{formInfo.require = !formInfo.require}" />
                    </div>
                    <div style="margin: 15px 0;">
                        标题：<a-input type="text" v-model="formInfo.title" style="width: 80%"></a-input>
                    </div>
                    <div v-if="formInfo.name === 'dropBox' || formInfo.name === 'radioBox' || formInfo.name === 'checkBox'">
                        选项：<a-input type="text" v-model="formInfo.option" style="width: 80%" placeholder="多个选项用逗号隔开，相同选项将合并"></a-input>
                    </div> -->
                </div>
            </a-modal>
        </main>
        <footer>
            <a-button type="primary" @click="saveTemplateToSubmit">保存并发布</a-button>
        </footer>
	</div>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
export default {
	name: 'tempform',
	props: {
        range: String
	},
    data() {
        let range = this.range;
        return {
            locale,
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
            size: 'default',
            nReportForm: {
                range: range,
                size: 'default'
            },
            popupStyle: {
                "top": "0"
            },
            isShowNewFormItemPopup: false,
            dynamicForm: [],
            formInfo: {
                name: '',
                require: true,
                title: '',
                option: ''
            },
            formItemsArr: ['singleLine', 'multiLine', 'dropBox', 'radioBox', 'checkBox', 'switchBox', 'datePickerBox', 'rangeBox'],
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
    methods: {
        popupPosition(res) {
            console.log('getCalendarContainer', res);
            return document.getElementById('datePicker');
        },
        changeSize() {
            // console.log('this.size', this.size);
            this.size = this.size === 'small' ? 'default' : (this.size === 'default' ? 'large' : 'small');
            this.nReportForm.size = this.size;
        },
        newFormItemPopup (type) {
            this.isShowNewFormItemPopup = true;
            this.formInfo.name = type;
            this.formInfo.title = '';
            this.formInfo.require = true;
            this.formInfo.option = '';
        },
        newFormConfirm() {
            // console.log('插入', this.formInfo);
            // 弹窗中所有输入项必填
            if(this.formInfo.title === '' || (this.formInfo.name === 'dropBox' || this.formInfo.name === 'radioBox' || this.formInfo.name === 'checkBox') && this.formInfo.option === '') {
                this.$message.error('请完善相关信息！');
            } else {
                // 处理插入 dynamicForm 表单的数据 比如有选项的时候，逗号怎么处理
                this.formInfo.option = this.formInfo.option.replace(/，/ig,',');
                this.formInfo.option = [...new Set(this.formInfo.option.split(','))].join(',')
                // console.log('this.formInfo.option', this.formInfo.option, [...new Set(this.formInfo.option.split(','))]);

                // 深拷贝进渲染的表单数组
                this.dynamicForm.push(JSON.parse(JSON.stringify(this.formInfo)));
                this.isShowNewFormItemPopup = false;
            }
        },
        // 移除节点
        removeDomain(index) {
            this.dynamicForm.splice(index, 1);
        },
		saveTemplateToSubmit() {
            // 重置
            this.nReportForm = JSON.parse(JSON.stringify({
                range: this.range,
                size: this.size
            }));
            this.dynamicForm.forEach((item) => {
                // 如果传入数据库的 nReportForm 没有该字段，则创建为数组
                if(!this.nReportForm[this.formDatabase[item.name]]) {
                    this.nReportForm[this.formDatabase[item.name]] = [];
                }

                // 插入传入数据库的 nReportForm 字段数据 以&@#为间隔 首为是否必填 二为标题 后面则是选项
                if(item.option === '') {
                    this.nReportForm[this.formDatabase[item.name]].push(`${item.require}&@#${item.title}`);
                } else {
                    this.nReportForm[this.formDatabase[item.name]].push(`${item.require}&@#${item.title}&@#${item.option}`);
                }
            })
			console.log('点击保存并发布', this.dynamicForm, JSON.stringify(this.nReportForm));
            this.$axios.post('http://127.0.0.1:88/insertTemp', {temp: JSON.stringify(this.nReportForm), range: this.range, department: sessionStorage.getItem('department')}).then(() => {
                // 更新缓存
                this.$axios.post(`http://127.0.0.1:88/getTemp`, {depart: sessionStorage.getItem('department')}).then((res) => {
                    if(sessionStorage.getItem(this.range)) {
                        sessionStorage.removeItem(this.range);
                    }
                    sessionStorage.setItem(this.range, res.data[0][this.range]);
                })
            })
		},
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.tempform-main {
    // height: 100%;
    #datePicker {
        position: relative;
    }
    // 时间下拉位置不对
    .btn-group {
        margin: 20px auto;
        width: 1000px;
        display: flex;
        justify-content: space-between;
    }
    .anticon {
        position: absolute;
        right: -50px;
        top: 2px;
    }
    footer {
        text-align: center;
    }
}
</style>
