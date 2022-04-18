let express = require('express')
let router = express.Router()
let db = require('../db/index')
let { verifyToken } = require("./util");
let { getToken } = require("./util");
// 登录
router.post('/login', (req, res) => {
    // req.body.first_name
    var sql = `SELECT * from allstaff where staffId = ${req.body.number} and psw = ${req.body.password}`
    db.query(sql, (err, data) => {
        if (err) {
            return res.send({ status: 0, message: "登录失败，请重试！" });
        }
        // if (data.length) {
        // 	return res.send({
        // 		status: 1,
        // 		message: "登录成功！",
        // 		uid: getToken({ userStatus: 1, account }),
        // 	});
        // } else {
        // 	return res.send({
        // 		status: 0,
        // 		message: "账号或密码错误！",
        // 	});
        // }
        if (data.length) {
            // console.log('data', data);
            data[0].uid = getToken({ userStatus: 1 });
            return res.status(200).send(data);
        } else {
            return res.status(200).send({ status: 0, message: "账号或密码错误！" });
        }
        // data[0].uid = getToken({ userStatus: 1, account });
        // console.log('data', data);
        // res.send(data)
    })
})

// 修改密码
router.post('/changepsw', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        // var sql = `update allstaff set psw = ${req.body.nPassword} where staffId = ${req.body.number} and psw = ${req.body.oPassword};`
        var sql = `SELECT * from allstaff where staffId = ${req.body.number} and psw = ${req.body.oPassword}`;
        var updateSql = `update allstaff set psw = ${req.body.nPassword} where staffId = ${req.body.number}`;
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "获取旧密码失败，请重试！" })
            }
            if (data.length) {
                db.query(updateSql, (err) => {
                    if (err) {
                        return res.status(500).send({ err, status: 0, message: "修改密码失败，请重试！" });
                    }
                    res.status(200).send('success')
                })
            } else {
                res.status(200).send('工号或密码输入错误 ！')
            }
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

module.exports = router