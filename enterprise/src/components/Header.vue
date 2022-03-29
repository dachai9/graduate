<template>
	<div class="header-main">
		<h1 class="header-h1" @click="toHome">企业工作报告智慧平台</h1>
		<div class="header-user">
			<a-dropdown placement="bottomCenter">
				<a class="ant-dropdown-link" @click="e => e.preventDefault()">
					{{user}} <a-icon type="down" />
				</a>
				<a-menu slot="overlay">
					<a-menu-item v-if="isBoss">
						<a href="/manageStaff">管理员工</a>
					</a-menu-item>
					<a-menu-item>
						<a href="/changepsw">修改密码</a>
					</a-menu-item>
					<a-menu-item @click="logout">
						<span>退出登录</span>
					</a-menu-item>
				</a-menu>
			</a-dropdown>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Header',
	props: {
	},
	data() {
		return {
			isBoss: sessionStorage.getItem('isBoss') == '1' ? true : false,
			user: sessionStorage.getItem('user'),
		}
	},
	methods: {
		toHome() {
			// 在原页，不返回
			if(location.pathname === '/home') {
				return false;
			}
			this.$router.push('/home');
		},
		logout() {
			this.$router.push('/');
			sessionStorage.removeItem('user');
			sessionStorage.removeItem('isBoss');
			sessionStorage.removeItem('department');
			sessionStorage.removeItem('weekly');
			sessionStorage.removeItem('monthly');
			sessionStorage.removeItem('seasonal');
			sessionStorage.removeItem('yearly');
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.header-main {
	position: relative;
	height: 60px;
	width: 100%;
	padding: 0 60px;
	// border-bottom: 1px solid #57a6ec;
	background-color: #57a6ec;
	// box-shadow: 0px 2px 20px 0px #57a6ec;
	// background-color: pink;
	.header-h1 {
		float: left;
		font-size: 23px;
		font-weight: 800;
		line-height: 60px;
		color: #fff;
		margin: 0;
		cursor: pointer;
	}
	.header-user {
		float: right;
		line-height: 60px;
		a {
			line-height: 60px;
			display: inline-block;
			color: #fff;
		}
	}
}
</style>
