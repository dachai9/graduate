<template>
    <div class="login-main">
        <div class="login-box">
            <a-spin :spinning="isSearchSpinShow">
                <h3 class="login-font">企业工作报告智慧平台</h3>
                <a-form-model ref="loginForm" :model="form" :rules="loginRules" :labelCol="{span: 4}" :wrapperCol="{span: 19}">
                    <a-form-model-item label="工号：" required prop="number">
                        <a-input v-model="form.number" placeholder="请输入工号" @pressEnter="login()" />
                    </a-form-model-item>
                    <a-form-model-item label="密码：" required prop="password">
                        <a-input-password v-model="form.password" placeholder="请输入密码" @pressEnter="login()" />
                    </a-form-model-item>
                    <a-form-model-item :wrapperCol="{span: 24, offset: 11}">
                        <a-button type="primary" :style="{'margin-right': '20px'}" @click="login()">
                            登录
                        </a-button>
                        <!-- <a-button type="default" @click="toRegister()">
                            点击注册
                        </a-button> -->
                    </a-form-model-item>
                </a-form-model>
            </a-spin>
        </div>
    </div>
</template>

<script>
export default {   
    data() {
        return {
            form: {
                number: '',
                password: '',
            },
            loginRules: {
                number: [{ required: true, message: '工号不能为空', trigger: 'blur'}],
                password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
            },
            department: '',
            isSearchSpinShow: false
        };
    },
    computed: {
    },
    methods: {
        login() {
            this.isSearchSpinShow = true;
            this.$refs.loginForm.validate(valid => {
                if(valid) {
                    // console.log('验证成功', valid);
                    // 添加数据库判断
                    this.$axios.post('/login', this.form).then((response) => {
                        console.log('response', response);
                        if(response.data.length) {
                            // 保存 uid
                            sessionStorage.setItem('uid', response.data[0].uid)
                            this.$store.state.uid = response.data[0].uid
                            // 保存其他信息
                            sessionStorage.setItem('user', response.data[0].staffName)
                            sessionStorage.setItem('isBoss', response.data[0].isBoss)
                            sessionStorage.setItem('department', response.data[0].department)
                            this.department = response.data[0].department;
                            this.$axios.post(`/getTemp`, {depart: this.department}).then((res) => {
                                // console.log('获取到已创建的模板类型', res);
                                res.data[0].weekly ? sessionStorage.setItem('weekly', res.data[0].weekly) : '';
                                res.data[0].monthly ? sessionStorage.setItem('monthly', res.data[0].monthly) : '';
                                res.data[0].seasonal ? sessionStorage.setItem('seasonal', res.data[0].seasonal) : '';
                                res.data[0].yearly ? sessionStorage.setItem('yearly', res.data[0].yearly) : '';
                                this.isSearchSpinShow = false;
                            })
                            // 如果是 boss，则有已未读信息
                            if(response.data[0].isBoss) {
                                this.$axios.get(`/getIsRead?name=${response.data[0].staffName}`).then((res) => {
                                    console.log('获取是否已读', res.data[0].isRead);
                                    sessionStorage.setItem('isRead', res.data[0].isRead ? res.data[0].isRead : JSON.stringify([]));
                                    
                                    if(response.data[0].psw === '123') {
                                        this.$message.info('请先修改密码');
                                        this.$router.push('/changepsw');
                                    }else {
                                        this.$router.push('/home');
                                        // this.$router.push(0);
                                    }
                                    this.isSearchSpinShow = false;
                                })
                            } else {
                                if(response.data[0].psw === '123') {
                                    this.$message.info('请先修改密码');
                                    this.$router.push('/changepsw');
                                }else {
                                    this.$router.push('/home');
                                    // this.$router.push(0);
                                }
                                this.isSearchSpinShow = false;
                            }
                        } else {
                            this.$message.error('工号或密码输入错误！');
                            this.isSearchSpinShow = false;
                        }
                    })
                } else {
                    console.log('验证不成功');
                    this.isSearchSpinShow = false;
                    return false;
                }
            })
        },
        toRegister() {
            this.$router.push('/register');
        }
    }
}
</script>

<style lang="less">
.login-main {
    width: 100%;
    height: 100%;
    position: relative;
    // margin: 0 auto;
    .login-font {
        color: #57a6ec;
        font-weight: 800;
        font-size: 26px;
        margin-bottom: 20px;
    }
    .login-box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 40%;
        padding: 30px 40px 20px;
        border: 1px solid #57a6ec;
        border-radius: 10px;
        box-shadow: inset 0px 0px 15px 2px #57a6ec;
    }
}
</style>