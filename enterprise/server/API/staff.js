let express = require('express')
let router = express.Router()
let db = require('../db/index')
let { verifyToken } = require("./util");

// 搜索员工  模糊名字和精确工号
router.post('/searchStaff', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        var sql = `select * from allstaff where staffName like '%${req.body.staffName}%' or staffId = '${req.body.staffName}'`
        // console.log('sql', sql);
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "搜索员工失败，请重试！" });
            }
            res.status(200).send(data)
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 部门增删员工
router.post('/updateStaff', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        var sql = `update allstaff set department = '${req.body.department}' where staffId = ${req.body.staffId}`
        db.query(sql, (err) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "更新员工信息失败，请重试！" });
            }
            res.status(200).send('success')
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

module.exports = router