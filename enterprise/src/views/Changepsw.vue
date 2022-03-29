<template>
    <div class="change-main">
        <div class="change-box">
            <h3 class="change-font">企业工作报告智慧平台</h3>
            <a-form-model ref="changepswForm" :model="pswForm" :rules="changeRules" :labelCol="{span: 4}" :wrapperCol="{span: 19}">
                <a-form-model-item label="工号：" required prop="number">
                    <a-input v-model="pswForm.number" placeholder="请输入工号" @pressEnter="changepsw()" />
                </a-form-model-item>
                <a-form-model-item label="旧密码：" required prop="oPassword">
                    <a-input-password v-model="pswForm.oPassword" placeholder="请输入当前账户密码" @pressEnter="changepsw()" />
                </a-form-model-item>
                <a-form-model-item label="新密码：" required prop="nPassword">
                    <a-input-password v-model="pswForm.nPassword" placeholder="请输入新密码" @pressEnter="changepsw()" />
                </a-form-model-item>
                <a-form-model-item label="确认新密码：" required prop="cnPassword">
                    <a-input-password v-model="pswForm.cnPassword" placeholder="请再次输入新密码" @pressEnter="changepsw()" />
                </a-form-model-item>
                <a-form-model-item :wrapperCol="{span: 24, offset: 10}">
                    <a-button type="primary" @click="changepsw()">
                        修改密码
                    </a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
    </div>
</template>

<script>
export default {   
    data() {
        let checkoPsw = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else if (value == this.pswForm.oPassword) {
                callback(new Error("新密码不能与旧密码一致"));
            } else {
                callback();
            }
        };
        let checkPsw = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.pswForm.nPassword) {
                callback(new Error("确认新密码与新密码输入不一致"));
            } else {
                callback();
            }
        };
        return {
            pswForm: {
                number: '',
                oPassword: '',
                nPassword: '',
                cnPassword: '',
            },
            changeRules: {
                number: [{ required: true, message: '请输入工号', trigger: 'blur'}],
                oPassword: [{ required: true, message: '请输入当前账户密码', trigger: 'blur'}],
                nPassword: [{ validator: checkoPsw, trigger: 'blur'}],
                // nPassword: [{ required: true, message: '请输入新密码', trigger: 'blur'}],
                cnPassword: [{ validator: checkPsw, trigger: 'blur'}],
            }
        };
    },
    computed: {
    },
    methods: {
        changepsw() {
            this.$refs.changepswForm.validate(valid => {
                if(valid) {
                    console.log('验证成功', valid);
                    // 添加数据库判断
                    // 跳转
                    this.$axios.post('http://127.0.0.1:88/changepsw', this.pswForm).then((response) => {
                        console.log('response', response.data);
                        if(response.data === 'success') {
                            this.$router.push('/home');
                        } else {
                            this.$message.error(response.data);
                        }
                    })
                } else {
                    console.log('验证不成功');
                    return false;
                }
            })
        }
    }
}
</script>

<style lang="less">
.change-main {
    width: 100%;
    // margin: 0 auto;
    .change-font {
        color: #57a6ec;
        font-weight: 800;
        font-size: 26px;
        margin-bottom: 20px;
    }
    .change-box {    
        width: 40%;
        margin: 80px auto;
        padding: 30px 40px 20px;
        border: 1px solid #57a6ec;
        border-radius: 10px;
        box-shadow: inset 0px 0px 15px 2px #57a6ec;
    }
}
</style>