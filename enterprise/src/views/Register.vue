<template>
    <div class="register-main">
        <!-- <div class="register-box">
            <h3 class="register-font">企业工作报告智慧平台</h3>
            <a-form-model ref="registerForm" :model="registerForm" :rules="registerRules" :labelCol="{span: 4}" :wrapperCol="{span: 19}">
                <a-form-model-item label="我是：" required>
                    <a-radio-group v-model="registerForm.job">
                        <a-radio-button value="worker">
                            职员
                        </a-radio-button>
                        <a-radio-button value="boss">
                            上司
                        </a-radio-button>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="工号：" required prop="number">
                    <a-input v-model="registerForm.number" placeholder="请输入工号" />
                </a-form-model-item>
                <a-form-model-item label="密码：" required prop="password">
                    <a-input-password v-model="registerForm.password" placeholder="请输入密码" />
                </a-form-model-item>
                <a-form-model-item :wrapperCol="{span: 24, offset: 10}">
                    <a-button type="primary" @click="register()">
                        注册
                    </a-button>
                </a-form-model-item>
            </a-form-model>
        </div> -->
    </div>
</template>

<script>
// export default {   
//     data() {
//         return {
//             registerForm: {
//                 job: 'worker',
//                 number: '',
//                 password: '',
//             },
//             registerRules: {
//                 job: [{ required: true, message: '请选择您的身份'}],
//                 number: [{ required: true, message: '工号不能为空', trigger: 'blur'}],
//                 password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
//             }
//         };
//     },
//     computed: {
//     },
//     methods: {
//         register() {
//             this.$refs.registerForm.validate(valid => {
//                 if(valid) {
//                     console.log('注册成功', valid);
//                     // 添加数据库
//                     // 跳转
//                     if(this.registerForm.job === 'worker') {
//                         this.$router.push('/home')
//                     } else {
//                         this.$router.push('/manage')
//                     }
//                 } else {
//                     console.log('验证不成功');
//                     return false;
//                 }
//             })
//         }
//     }
// }
</script>

<style lang="less">
// .register-main {
//     width: 100%;
//     height: 100%;
//     position: relative;
//     // margin: 0 auto;
//     .register-font {
//         color: #57a6ec;
//         font-weight: 800;
//         font-size: 26px;
//         margin-bottom: 20px;
//     }
//     .register-box {
//         position: absolute;
//         left: 50%;
//         top: 50%;
//         transform: translate(-50%, -50%);
//         width: 40%;
//         padding: 30px 40px 20px;
//         border: 1px solid #57a6ec;
//         border-radius: 10px;
//         box-shadow: inset 0px 0px 15px 2px #57a6ec;
//     }
// }
</style>