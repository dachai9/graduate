let jwt = require("jsonwebtoken");
const secret = "dshaihcucnkjadhfudisahjdsk"; //给定密钥

module.exports = {
	getToken: (payload) => {
		// payload定义token的有限载荷
		//签发token
		const token = jwt.sign(payload, secret, {
			expiresIn: "5 days",
		}); // 设置过期时间
		return token;
	},
	verifyToken: (headers) => {
		const token = headers.authorization;
		// console.log('token', headers, token);
		let res;
		jwt.verify(token, secret, (err) => {
			if (err) {
				switch (err.name) {
					case "TokenExpiredError":
						res = { code: 401, status: 0, message: "登录过期" };
						break;
					case "JsonWebTokenError":
						res = { code: 403, status: 0, message: "身份验证失败" };
						break;
					default:
						res = { code: 500, status: 0, message: "服务器错误" };
				}
			}

		});
		return res || { code: 200, status: 1, message: "身份验证成功" };;
	},
};
