let express = require('express')
let router = express.Router()
let db = require('../db/index')

// router.get('/index', (req, res) => {
//     var sql = 'SELECT * FROM enterprise.`table_index`;'
//     db.query(sql, (err, data) => {
//         if (err) {
//             return res.send('错误：' + err.message)
//         }
//         res.send(data)
//     })
// })
// 登录
router.post('/login', (req, res) => {
    // req.body.first_name
    var sql = `SELECT * from allstaff where staffId = ${req.body.number} and psw = ${req.body.password}`
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
})

// 修改密码
router.post('/changepsw', (req, res) => {
    // req.body.first_name
    // var sql = `update allstaff set psw = ${req.body.nPassword} where staffId = ${req.body.number} and psw = ${req.body.oPassword};`
    var sql = `SELECT * from allstaff where staffId = ${req.body.number} and psw = ${req.body.oPassword}`;
    var updateSql = `update allstaff set psw = ${req.body.nPassword} where staffId = ${req.body.number}`;
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        if (data.length) {
            db.query(updateSql, (err) => {
                if (err) {
                    return res.send('错误：' + err.message)
                }
                res.send('success')
            })
        } else {
            res.send('工号或密码输入错误 ！')
        }
    })
})

module.exports = router
