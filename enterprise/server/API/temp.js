let express = require('express')
let router = express.Router()
let db = require('../db/index')

// 登录后获取上司已创建的模板
router.post('/getTemp', (req, res) => {
    // req.body.first_name
    var sql = `select * from departments where departName = '${req.body.depart}'`
    console.log('sql', sql);
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
    var sql = `insert into templates (temp, author, title${req.body.saveTime ? ", saveTime" : ""}${req.body.submitTime ? ", submitTime" : ""}) values ('${req.body.temp}', '${req.body.author}', '${req.body.title}'${req.body.saveTime ? ", '" + req.body.saveTime + "'" : ""}${req.body.submitTime ? ", '" + req.body.submitTime + "'" : ""})`;
    if (req.body.submitTime) {
        var updateSql = `update enterprise.departments a, enterprise.templates b set a.${req.body.range} = (select max(tempId) from templates) where a.departName = '${req.body.department}';`
    }
    // console.log('sql', sql);
    // console.log('updateSql', updateSql);
    db.query(sql, (err) => {
        if (err) {
            return res.send('插入错误：' + err.message)
        }
        if (req.body.submitTime) {
            db.query(updateSql, (err) => {
                if (err) {
                    return res.send('更新错误：' + err.message)
                }
                res.send('success')
            })
        } else {
            res.send('success')
        }
    })
})

// 根据模板 id 获取模板
router.get('/getTempById', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    var sql = `select * from templates where tempId = ${req.query.id}`;
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
})

// 获取所有的模板信息
router.post('/getAllTempData', (req, res) => {
    var sql = `select * from templates where saveTime <> '' and author = '${req.body.authorName}' order by saveTime desc${req.body.page ? " limit " + (req.body.page - 1) * 10 + ", 10" : ""}`;

    var sumSql = `select count(*) as total from templates where saveTime <> '' and author = '${req.body.authorName}' order by saveTime desc`;
    console.log('getAllTempData: sql', sql);
    console.log('getAllTempData: sumSql', sumSql);

    var allData = {};
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        // res.send(data)
        allData.data = data;
        db.query(sumSql, (err, total) => {
            if (err) {
                return res.send('错误：' + err.message)
            }
            allData.total = total[0].total;
            res.send(allData);
        })
    })
})

// 删除模板
router.post('/deleteATemp', (req, res) => {
    var sql = `delete from templates where tempId = ${req.body.id}`;
    db.query(sql, (err) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send('success')
    })
})

// 更新模板
router.post('/updateTemp', (req, res) => {
    var sql = `update templates set temp = '${req.body.temp}', title = '${req.body.title}', saveTime = ${req.body.saveTime ? "'" + req.body.saveTime + "'" : 'NULL'}, submitTime = ${req.body.submitTime ? "'" + req.body.submitTime + "'" : 'NULL'}, author = '${req.body.author}' where tempId = '${req.body.tempId}'`;
    console.log('sql', sql);
    // db.query(sql, (err) => {
    //     if (err) {
    //         return res.send('错误：' + err.message)
    //     }
    //     res.send('success')
    // })
    if (req.body.submitTime) {
        var updateSql = `update enterprise.departments a, enterprise.templates b set a.${req.body.range} = '${req.body.tempId}' where a.departName = '${req.body.department}';`
    }
    // console.log('sql', sql);
    // console.log('updateSql', updateSql);
    db.query(sql, (err) => {
        if (err) {
            return res.send('插入错误：' + err.message)
        }
        if (req.body.submitTime) {
            db.query(updateSql, (err) => {
                if (err) {
                    return res.send('更新错误：' + err.message)
                }
                res.send('success')
            })
        } else {
            res.send('success')
        }
    })
})

module.exports = router