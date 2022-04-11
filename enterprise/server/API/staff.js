let express = require('express')
let router = express.Router()
let db = require('../db/index')

// 搜索员工  模糊名字和精确工号
router.post('/searchStaff', (req, res) => {
    // req.body.first_name
    var sql = `select * from allstaff where staffName like '%${req.body.staffName}%' or staffId = '${req.body.staffName}'`
    console.log('sql', sql);
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
})

// 部门增删员工
router.post('/updateStaff', (req, res) => {
    // req.body.first_name
    var sql = `update allstaff set department = '${req.body.department}' where staffId = ${req.body.staffId}`
    db.query(sql, (err) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send('success')
    })
})

module.exports = router