let express = require('express')
let router = express.Router()
let db = require('../db/index')
let moment = require('moment');

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
// 搜索员工  模糊名字和精确工号
router.post('/searchStaff', (req, res) => {
    // req.body.first_name
    var sql = `select * from allstaff where staffName like '%${req.body.staffName}%' or staffId = '${req.body.staffName}'`
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
// 插入报告数据
router.post('/updateReportData', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    if (req.body.change) {
        var sql = `update reports set title = '${req.body.title}', content = '${req.body.content}', rangeType = '${req.body.range}', saveTime = '${req.body.saveTime}', submitTime = '${req.body.submitTime}', author = '${req.body.author}', tempId = ${req.body.tempId} where reportId = '${req.body.id}'`;
    } else {
        var sql = `insert into reports (title, content, rangeType, ${req.body.saveTime === '' ? 'submitTime' : 'saveTime'}, author, tempId) values ('${req.body.title}', '${req.body.content}', '${req.body.range}', '${req.body.saveTime === '' ? req.body.submitTime : req.body.saveTime}', '${req.body.author}', ${req.body.tempId});`;
    }
    var selectSql = `select max(reportId) as id from reports`;
    db.query(sql, (err) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        if (req.body.change) {
            res.send({ id: req.body.id });
        } else {
            db.query(selectSql, (err, data) => {
                if (err) {
                    return res.send('错误：' + err.message)
                }
                res.send(data)
            })
        }
    })
})
// 获取报告数据
router.get('/getReportData', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    var sql = `select * from reports where reportId = ${req.query.id}`;
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
})
// Boss获取符合条件的报告数据
router.post('/getSomeReportData', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    var body = req.body;
    // var isScreenedStr = body.isScreenedArr.join(',');
    var sql = `select * from reports where${body.screenName ? " author like '%" + body.screenName + "%' and " : ""} submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc`;

    // console.log('sql', sql);
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
})
// 员工获取符合条件的报告数据
router.post('/getMyReportData', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    var sql = `select * from reports${req.body.condition ? ' where reportId = ${req.query.id}' : ''} order by submitTime desc`;
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
})
// 获取草稿箱数据
router.post('/getDraftData', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    var sql = `select * from reports where saveTime <> '' and author = '${req.body.authorName}' order by saveTime desc`;
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
})
// 删除某条数据
router.post('/deleteAReport', (req, res) => {
    // req.body.first_name
    var sql = `delete from reports where reportId = ${req.body.id}`;
    console.log('sql', sql);
    db.query(sql, (err) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send('success')
    })
})

module.exports = router
