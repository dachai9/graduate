<template>
	<div class="nform-main">
        <a-form-model :ref="nReportForm" :model="nReportForm" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="Activity name">
                <a-input v-model="nReportForm.name" />
            </a-form-model-item>
            <a-form-model-item label="Activity zone">
                <a-select v-model="nReportForm.region" placeholder="please select your zone">
                    <a-select-option value="shanghai">
                        Zone one
                    </a-select-option>
                    <a-select-option value="beijing">
                        Zone two
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="Activity time">
                <a-range-picker id="datePicker" :getCalendarContainer="popupPosition" :popupStyle="popupStyle" />
                <!-- <a-date-picker
                    id="datePicker"
                    v-model="nReportForm.date1"
                    show-time
                    type="date"
                    placeholder="Pick a date"
                    style="width: 100%;"
                    :getCalendarContainer="popupPosition"
                /> -->
            </a-form-model-item>
            <a-form-model-item label="Instant delivery">
                <a-switch v-model="nReportForm.delivery" />
            </a-form-model-item>
            <a-form-model-item label="Activity type">
                <a-checkbox-group v-model="nReportForm.type">
                    <a-checkbox value="1" name="type">
                        Online
                    </a-checkbox>
                    <a-checkbox value="2" name="type">
                        Promotion
                    </a-checkbox>
                    <a-checkbox value="3" name="type">
                        Offline
                    </a-checkbox>
                </a-checkbox-group>
            </a-form-model-item>
            <a-form-model-item label="Resources">
                <a-radio-group v-model="nReportForm.resource">
                    <a-radio value="1">
                        Sponsor
                    </a-radio>
                    <a-radio value="2">
                        Venue
                    </a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="Activity form">
                <a-input v-model="nReportForm.desc" type="textarea" />
            </a-form-model-item>
        </a-form-model>
	</div>
</template>

<script>
export default {
	name: 'nform',
	props: {
		mainData: Object,
        condition: Object
	},
    data() {
        return {
            nformBodyStyle: {
                "padding": "0"
            },
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
            nReportForm: {
                name: '',
                region: undefined,
                date1: undefined,
                delivery: false,
                type: [],
                resource: '',
                desc: '',
            },
            popupStyle: {
                "top": "0"
            }
        }
    },
    methods: {
        popupPosition(res) {
            console.log('getCalendarContainer', res);
            return document.getElementById('datePicker');
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.nform-main {
    #datePicker {
        position: relative;
    }
    // 时间下拉位置不对
}
</style>
