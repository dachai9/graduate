import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';
import qs from "qs";

Vue.config.productionTip = false
Vue.use(Antd);
axios.defaults.baseURL = 'http://localhost:88'

// 请求拦截器
axios.interceptors.request.use(
	(config) => {
		const uid = store.state.uid;
		// const uname = store.state.uname;
		if (config.method === "get") {
			// 加上uname
			config.params = {
				// uname,
				...config.params,
			};
		}
		if (config.method === "post") {
			// 加上uname
			const data = qs.parse(config.data);
			// const newData = {
			// 	...data
			// };
			// if (data.uname) {
			// 	newData.uname = uname;
			// }
			config.data = qs.stringify({
				...data,
			});
		}
		// 在请求头添加token
		uid && (config.headers.Authorization = uid);
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
// 响应拦截器
axios.interceptors.response.use(
	(response) => {
		if (response.status === 200) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(response);
		}
	},
	(error) => {
		if (error.response.status) {
			//401: 未登录  403 token过期
			switch (error.response.status) {
				case 401:
					this.$route.replace("/");
					this.$message.error('请先登录');
					break;
				case 403:
					this.$route.replace("/");
					this.$message.error('登录已过期，请重新登录');
					break;
				default:
					this.$message.error(error.response.data.message);
			}
			return Promise.reject(error.response);
		}
	}
);

Vue.prototype.$axios = axios;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')