let express = require('express')
let router = express.Router()
let db = require('../db/index')

// 登录后获取上司已创建的模板
router.post('/getTemp', (req, res) => {
    // req.body.first_name
    var sql = `select * from departments where departName = '${req.body.depart}'`
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
})

// 创建模板并记录到部门模板表中
router.post('/insertTemp', (req, res) => {
    // req.body.first_name
    var sql = `insert into templates (temp) values ('${req.body.temp}')`;
    var updateSql = `update enterprise.departments a, enterprise.templates b set a.${req.body.range} = (select max(tempId) from templates) where a.departName = '${req.body.department}';`
    // console.log('sql', sql);
    // console.log('updateSql', updateSql);
    db.query(sql, (err) => {
        if (err) {
            return res.send('插入错误：' + err.message)
        }
        db.query(updateSql, (err) => {
            if (err) {
                return res.send('更新错误：' + err.message)
            }
            res.send('success')
        })
    })
})

// 根据模板 id 获取模板
router.get('/getTemp', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    var sql = `select temp from templates where tempId = ${req.query.id}`;
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
})

module.exports = router