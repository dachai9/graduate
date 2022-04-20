import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd, { message } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';
// import qs from "qs";

Vue.config.productionTip = false
Vue.use(Antd);
axios.defaults.baseURL = 'http://localhost:88'

// 请求拦截器
axios.interceptors.request.use(
	(config) => {
		const uid = store.state.uid || sessionStorage.getItem('uid');
		// if (config.method === "get") {
		// 	config.params = {
		// 		...config.params,
		// 	};
		// }
		// if (config.method === "post") {
		// 	const data = qs.parse(config.data);
		// 	config.data = qs.stringify({
		// 		...data,
		// 	});
		// }
		// 在请求头添加token
		uid && (config.headers.authorization = uid);
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
			console.log('response', response);
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
					router.replace("/");
					message.error('请先登录');
					break;
				case 403:
					router.replace("/");
					message.error('登录已过期，请重新登录');
					break;
				default:
					message.error(error.response.data.message);
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