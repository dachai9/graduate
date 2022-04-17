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
                    <div v-if="path.hash == 1">
                        <a-icon type="up-square-o" @click="moveUp(index)" :style="{'fontSize': '20px', 'right': '-50px', 'color': '#999'}"/>
                        <a-icon type="down-square" @click="moveDown(index)" :style="{'fontSize': '20px', 'right': '-90px', 'color': '#999'}" />
                        <a-icon type="minus-square" @click="removeDomain(index)" :style="{'fontSize': '20px', 'right': '-130px', 'color': '#999'}" />
                    </div>
                </a-form-model-item>
            </a-form-model>
            
            <div class="btn-group" v-if="path.hash == 1">
                <!-- <a-button ref="changeSize" @click="changeSize">大小</a-button> -->
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

            <a-modal v-model="isShowTempTime" title="提醒" @ok="tempTimeConfirm" cancelText="取消">
                <div class="time-model">
                    <a-form-model v-if="range === 'weekly'" :label-col="{span: 4}" :wrapper-col="{span: 18}">
                        <a-form-model-item label="更新时间" required>
                            <!-- <a-input type="text" v-model="tempTitle" @change="change"></a-input> -->
                            <a-select :default-value="'monday'" style="width: 120px" v-model="updateTime.day" >
                                <a-select-option value="monday">
                                    星期一
                                </a-select-option>
                                <a-select-option value="tuesday">
                                    星期二
                                </a-select-option>
                                <a-select-option value="wednesday">
                                    星期三
                                </a-select-option>
                                <a-select-option value="thursday">
                                    星期四
                                </a-select-option>
                                <a-select-option value="friday">
                                    星期五
                                </a-select-option>
                                <a-select-option value="saturday">
                                    星期六
                                </a-select-option>
                                <a-select-option value="sunday">
                                    星期日
                                </a-select-option>
                            </a-select>
                            <a-time-picker :locale="localeTime" v-model="updateTime.time" />
                        </a-form-model-item>
                    </a-form-model>
                    <a-form-model v-if="range === 'monthly'" :label-col="{span: 4}" :wrapper-col="{span: 18}">
                        <a-form-model-item label="更新时间" required>
                            <!-- <a-input type="text" v-model="tempTitle" @change="change"></a-input> -->
                            <a-select style="width: 120px" v-model="updateTime.monthDay" >
                                <a-select-option v-for="n in 28" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-time-picker :locale="localeTime" v-model="updateTime.time" />
                        </a-form-model-item>
                    </a-form-model>
                    <a-form-model v-if="range === 'seasonal'" :label-col="{span: 4}" :wrapper-col="{span: 18}">
                        更新时间：
                        <a-form-model-item label="第一季度" required>
                            <!-- <a-input type="text" v-model="tempTitle" @change="change"></a-input> -->
                            <!-- <a-date-picker style="width: 150px" v-model="updateTime.seasonDay.first" :default-value="moment().format('')" /> -->
                            <a-select style="width: 70px" v-model="updateTime.seasonDay.firstMonth" >
                                <a-select-option v-for="n in 12" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-select style="width: 70px" v-model="updateTime.seasonDay.firstDay" >
                                <a-select-option v-for="n in (updateTime.seasonDay.firstMonth ? moment(`2022-${updateTime.seasonDay.firstMonth}`).daysInMonth() : 28)" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-time-picker :locale="localeTime" v-model="updateTime.seasonDay.firstTime" />
                        </a-form-model-item>
                        <a-form-model-item label="第二季度" required>
                            <!-- <a-input type="text" v-model="tempTitle" @change="change"></a-input> -->
                            <!-- <a-date-picker style="width: 150px" v-model="updateTime.seasonDay.second" :default-value="moment()" /> -->
                            <a-select style="width: 70px" v-model="updateTime.seasonDay.secondMonth" >
                                <a-select-option v-for="n in 12" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-select style="width: 70px" v-model="updateTime.seasonDay.secondDay" >
                                <a-select-option v-for="n in (updateTime.seasonDay.secondMonth ? moment(`2022-${updateTime.seasonDay.secondMonth}`).daysInMonth() : 28)" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-time-picker :locale="localeTime" v-model="updateTime.seasonDay.secondTime" />
                        </a-form-model-item>
                        <a-form-model-item label="第三季度" required>
                            <!-- <a-input type="text" v-model="tempTitle" @change="change"></a-input> -->
                            <!-- <a-date-picker style="width: 150px" v-model="updateTime.seasonDay.third" :default-value="moment()" /> -->
                            <a-select style="width: 70px" v-model="updateTime.seasonDay.thirdMonth" >
                                <a-select-option v-for="n in 12" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-select style="width: 70px" v-model="updateTime.seasonDay.thirdDay" >
                                <a-select-option v-for="n in (updateTime.seasonDay.thirdMonth ? moment(`2022-${updateTime.seasonDay.thirdMonth}`).daysInMonth() : 28)" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-time-picker :locale="localeTime" v-model="updateTime.seasonDay.thirdTime" />
                        </a-form-model-item>
                        <a-form-model-item label="第四季度" required>
                            <!-- <a-input type="text" v-model="tempTitle" @change="change"></a-input> -->
                            <!-- <a-date-picker style="width: 150px" v-model="updateTime.seasonDay.fourth" :default-value="moment()" /> -->
                            <a-select style="width: 70px" v-model="updateTime.seasonDay.fourthMonth" >
                                <a-select-option v-for="n in 12" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-select style="width: 70px" v-model="updateTime.seasonDay.fourthDay" >
                                <a-select-option v-for="n in (updateTime.seasonDay.fourthMonth ? moment(`2022-${updateTime.seasonDay.fourthMonth}`).daysInMonth() : 28)" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-time-picker :locale="localeTime" v-model="updateTime.seasonDay.fourthTime" />
                        </a-form-model-item>
                    </a-form-model>
                    <a-form-model v-if="range === 'yearly'" :label-col="{span: 4}" :wrapper-col="{span: 18}">
                        <a-form-model-item label="更新时间" required>
                            <!-- <a-input type="text" v-model="tempTitle" @change="change"></a-input> -->
                            <!-- <a-date-picker v-model="updateTime.yearDay" :default-value="moment()" /> -->
                            <a-select style="width: 70px" v-model="updateTime.yearDay.mouth" >
                                <a-select-option v-for="n in 12" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-select style="width: 70px" v-model="updateTime.yearDay.day" >
                                <a-select-option v-for="n in (updateTime.yearDay.mouth ? moment(`2022-${updateTime.yearDay.mouth}`).daysInMonth() : 28)" :key="n" :value="n">
                                    {{n > 9 ? n : '0' + n}}
                                </a-select-option>
                            </a-select>
                            <a-time-picker :locale="localeTime" v-model="updateTime.time" />
                        </a-form-model-item>
                    </a-form-model>
                    <div class="tips">* 更新时间：指系统中提交名单的重置时间，当该时间到达，提交名单将置为空</div>
                </div>
            </a-modal>

            <a-modal v-model="isShowTempTitle" title="提示" @ok="creatTempConfirm" cancelText="取消">
                <div>
                    <a-form-model :label-col="{span: 4}" :wrapper-col="{span: 14}">
                        <a-form-model-item label="模板名称" required>
                            <!-- <a-input type="text" v-model="tempTitle" @change="change"></a-input> -->
                            <a-input type="text" v-model="tempTitle"></a-input>
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </a-modal>
        </main>
        <footer v-if="path.hash == 1">
            <a-button type="default" @click="saveTemplateToDraft" style="margin-right: 10px">保存到草稿箱</a-button>
            <a-button type="primary" @click="saveTemplateToSubmit" style="margin-right: 10px">保存并发布</a-button>
            <a-button v-if="path.temp" type="danger" @click="deleteATemp">删除</a-button>
        </footer>
        <footer v-if="path.hash != 1">
            <a-button type="default" @click="goBack">返回首页</a-button>
        </footer>
	</div>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import localeTime from 'ant-design-vue/es/time-picker/locale/zh_CN';
import moment from 'moment'
export default {
	name: 'tempform',
	props: {
        range: String,
        dynamicForm: Array,
        formatElseData: Object,
        // edit: String,
        title: String
	},
    data() {
		var path = {};
		location.search.slice(1, location.search.length).split('&').forEach((item) => {
			path[item.split('=')[0]] = item.split('=')[1];
		})
		path.hash = location.hash ? location.hash.replace('#', '') : '';
		// console.log('path', path);
        // let range = this.formatElseData.range;
        return {
            moment,
            locale,
            localeTime,
            path,
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
            size: this.formatElseData.size || 'default',
            nReportForm: {
                range: this.formatElseData.range,
                size: this.formatElseData.size || 'default'
            },
            popupStyle: {
                "top": "0"
            },
            isShowNewFormItemPopup: false,
            // dynamicForm: [],
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
            },
            isShowTempTitle: false,
            isDraft: false,
            tempTitle: this.title,
            isShowTempTime: false,
            updateTime: {
                day: '',
                monthDay: '',
                seasonDay: {},
                yearDay: {}
                // time: '00:00:00'
            },
            updateData: ''
        }
    },
    watch: {
        title: function(val) {
            this.tempTitle = val;
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
        // 往上移
        moveUp(index) {
            if(index === 0) {
                this.$message.error('已经是第一个！');
            } else {
                var item = this.dynamicForm.slice(index, index+1);
                this.dynamicForm.splice(index, 1);
                this.dynamicForm.splice(index-1, 0, ...item);
            }
        },
        // 往上移
        moveDown(index) {
            if(index === this.dynamicForm.length - 1) {
                this.$message.error('已经是最后一个！');
            } else {
                var item = this.dynamicForm.slice(index, index + 1);
                this.dynamicForm.splice(index, 1);
                this.dynamicForm.splice(index + 1, 0, ...item);
            }
        },
        // 移除节点
        removeDomain(index) {
            this.dynamicForm.splice(index, 1);
        },
        handleData() {
            // 重置
            this.nReportForm = JSON.parse(JSON.stringify({
                range: this.range,
                size: this.size
            }));
            var i=0;
            this.dynamicForm.forEach((item) => {
                // 如果传入数据库的 nReportForm 没有该字段，则创建为数组
                if(!this.nReportForm[this.formDatabase[item.name]]) {
                    this.nReportForm[this.formDatabase[item.name]] = [];
                }

                // 插入传入数据库的 nReportForm 字段数据 以&@#为间隔 首为是否必填 二为标题 后面则是选项
                
                if(item.option === '') {
                    this.nReportForm[this.formDatabase[item.name]].push(`${item.require}&@#${i++}&@#${item.title}`);
                } else {
                    this.nReportForm[this.formDatabase[item.name]].push(`${item.require}&@#${i++}&@#${item.title}&@#${item.option}`);
                }
            })
			console.log('处理数据后', this.dynamicForm, JSON.stringify(this.nReportForm));
            // console.log('this.tempTitle', this.tempTitle);
            // console.log('this.title', this.title);
        },
		saveTemplateToSubmit() {
            this.isDraft = false;
            this.$emit('toggleSpin', true);
            this.handleData();
            if(this.tempTitle) {
                var insertObj = {
                    tempId: this.formatElseData.tempId,
                    temp: JSON.stringify(this.nReportForm),
                    author: sessionStorage.getItem('user'),
                    submitTime: new moment().format('YYYY-MM-DD HH:mm:ss'),
                    title: this.tempTitle,
                    range: this.range,
                    department: sessionStorage.getItem('department')
                }
                this.$axios.post('/updateTemp', insertObj).then((response) => {
                    console.log('保存并发布之后的执行结果', response);
                    // 更新缓存
                    this.$axios.post(`/getTemp`, {depart: sessionStorage.getItem('department')}).then((res) => {
                        console.log('查询该部门的报告类型对应模板', res);
                        if(sessionStorage.getItem(this.range)) {
                            sessionStorage.removeItem(this.range);
                        }
                        sessionStorage.setItem(this.range, res.data[0][this.range]);
                        this.$router.push(`/home`);
                        this.$emit('toggleSpin', false);
                    })
                })
            } else {
                // this.isShowTempTitle = true;
                this.isShowTempTime = true;
                this.updateTime = JSON.parse(JSON.stringify({
                    day: '',
                    monthDay: '',
                    seasonDay: {},
                    yearDay: {}
                }))
                this.$emit('toggleSpin', false);
            }
		},
        // 保存到草稿箱
        saveTemplateToDraft() {
            this.isDraft = true;
            this.$emit('toggleSpin', true);
            this.handleData();
            if(this.tempTitle) {
                var updateObj = {
                    tempId: this.formatElseData.tempId,
                    temp: JSON.stringify(this.nReportForm),
                    author: sessionStorage.getItem('user'),
                    saveTime: new moment().format('YYYY-MM-DD HH:mm:ss'),
                    title: this.tempTitle,
                    range: this.range,
                    department: sessionStorage.getItem('department')
                }
                this.$axios.post('/updateTemp', updateObj).then((response) => {
                    console.log('保存到草稿箱之后的执行结果', response);
                    this.$router.push(`/draft?type=templates`);
                    // this.$router.push
                    this.$emit('toggleSpin', false);
                })
            } else {
                // this.isShowTempTitle = true;
                this.isShowTempTime = true;
                this.updateTime = JSON.parse(JSON.stringify({
                    day: '',
                    monthDay: '',
                    seasonDay: {},
                    yearDay: {}
                }))
                this.$emit('toggleSpin', false);
            }
        },
        tempTimeConfirm() {
            // console.log('this.updateTime', this.updateTime);
            try {
                switch (this.range) {
                    case 'weekly':
                        if(!this.updateTime.day || !this.updateTime.time) {
                            this.$message.info('请填写完整时间！')
                            return false;
                        }
                        this.updateData = [{day: this.updateTime.day > 9 ? this.updateTime.day : '0' + this.updateTime.day, time: this.updateTime.time.format('HH:mm:ss')}];
                        break;
                    case 'monthly':
                        if(!this.updateTime.monthDay || !this.updateTime.time) {
                            this.$message.info('请填写完整时间！')
                            return false;
                        }
                        this.updateData = [{day: this.updateTime.monthDay > 9 ? this.updateTime.monthDay : '0' + this.updateTime.monthDay, time: this.updateTime.time.format('HH:mm:ss')}];
                        break;
                    case 'seasonal':
                        if(Object.entries(this.updateTime.seasonDay).length < 12) {
                            // console.log('数据还没够');
                            this.$message.info('请填写完整时间！')
                            return false;
                        }
                        this.updateData = [
                            {day: (this.updateTime.seasonDay.firstMonth > 9 ? this.updateTime.seasonDay.firstMonth : '0'+this.updateTime.seasonDay.firstMonth) + ':' + (this.updateTime.seasonDay.firstDay > 9 ? this.updateTime.seasonDay.firstDay : '0' + this.updateTime.seasonDay.firstDay), time: this.updateTime.seasonDay.firstTime.format('HH:mm:ss')}, 
                            {day: (this.updateTime.seasonDay.secondMonth > 9 ? this.updateTime.seasonDay.secondMonth : '0'+this.updateTime.seasonDay.secondMonth) + ':' + (this.updateTime.seasonDay.secondDay > 9 ? this.updateTime.seasonDay.secondDay : '0' + this.updateTime.seasonDay.secondDay), time: this.updateTime.seasonDay.secondTime.format('HH:mm:ss')}, 
                            {day: (this.updateTime.seasonDay.thirdMonth > 9 ? this.updateTime.seasonDay.thirdMonth : '0'+this.updateTime.seasonDay.thirdMonth) + ':' + (this.updateTime.seasonDay.thirdDay > 9 ? this.updateTime.seasonDay.thirdDay : '0' + this.updateTime.seasonDay.thirdDay), time: this.updateTime.seasonDay.thirdTime.format('HH:mm:ss')}, 
                            {day: (this.updateTime.seasonDay.fourthMonth > 9 ? this.updateTime.seasonDay.fourthMonth : '0'+this.updateTime.seasonDay.fourthMonth) + ':' + (this.updateTime.seasonDay.fourthDay > 9 ? this.updateTime.seasonDay.fourthDay : '0' + this.updateTime.seasonDay.fourthDay), time: this.updateTime.seasonDay.fourthTime.format('HH:mm:ss')}];
                        break;
                    case 'yearly':
                        if(!this.updateTime.yearDay.mouth || !this.updateTime.yearDay.day || !this.updateTime.time) {
                            this.$message.info('请填写完整时间！')
                            return false;
                        }
                        this.updateData = [{day: (this.updateTime.yearDay.mouth > 9 ? this.updateTime.yearDay.mouth : '0' + this.updateTime.yearDay.mouth) + ':' + (this.updateTime.yearDay.day > 9 ? this.updateTime.yearDay.day : '0' + this.updateTime.yearDay.day), time: this.updateTime.time.format('HH:mm:ss')}];
                        break;
                    default:
                        this.updateData = [];
                        break;
                }
            } catch (error) {
                // console.log('error', error);
                this.$message.info('请填写完整时间！')
                return false;
            }
            console.log('this.updateData', this.updateData);
            this.isShowTempTime = false;
            this.isShowTempTitle = true;
        },
        creatTempConfirm() {
            var insertObj = {
                temp: JSON.stringify(this.nReportForm),
                author: sessionStorage.getItem('user'),
                title: this.tempTitle,
                range: this.range,
                department: sessionStorage.getItem('department'),
                updateTime: JSON.stringify(this.updateData),
            }
            if(!this.isDraft) {
                insertObj.submitTime = new moment().format('YYYY-MM-DD HH:mm:ss');
            } else {
                insertObj.saveTime = new moment().format('YYYY-MM-DD HH:mm:ss');
            }
            console.log('插入新数据', insertObj);
            if(this.tempTitle) {
                this.$emit('toggleSpin', true);
                this.$axios.post('/insertTemp', insertObj).then((response) => {
                    console.log('保存并发布之后的执行结果', response);
                    this.isShowTempTitle = false;
                    // 更新缓存
                    if(!this.isDraft) {
                        var depart = sessionStorage.getItem('department');
                        this.$axios.post(`/getTemp`, {depart: depart}).then((res) => {
                            console.log('查询该部门的报告类型对应模板', res);
                            if(sessionStorage.getItem(this.range)) {
                                sessionStorage.removeItem(this.range);
                            }
                            sessionStorage.setItem(this.range, res.data[0][this.range]);
                        }).then(() => {
                            this.$router.push(`/home`);
                            this.$emit('toggleSpin', false);
                        })
                    } else {
                        this.$emit('toggleSpin', false);
                    }
                    this.$router.push('/draft?type=templates');
                    this.$emit('toggleSpin', false);
                })
            } else {
                this.$message.info('请先输入模板标题！');
            }
        },
        deleteATemp() {
            // this.$emit('deleteATemp', this.formatElseData.tempId);
            
            this.$axios.post('/deleteATemp', {id: this.formatElseData.tempId}).then((res) => {
                console.log('deleteATemp', res.data);
                // 重新请求数据，因为不是
                // this.$emit('getAllTempData');
                this.$router.push('/draft?type=templates');
                this.$emit('toggleSpin', false);
            })
        },
        goBack() {
            this.$router.push('/home');
        },
        // change(val) {
        //     console.log('val', val, this.tempTitle);
        // }
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
        top: 1px;
        svg {
            width: 20px!important;
            height: 20px!important;
        }
    }
    footer {
        text-align: center;
    }
}
.tips {
    color: #d72b2b;
    font-size: 12px;
}
.time-model {
    /deep/.ant-form-item {
        margin-bottom: 10px;
    }
    /deep/::-webkit-scrollbar {
		display: none;
	}
}
</style>
