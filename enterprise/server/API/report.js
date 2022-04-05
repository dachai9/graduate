let express = require('express')
let router = express.Router()
let db = require('../db/index')

// 插入报告数据
router.post('/updateReportData', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    if (req.body.change) {
        var sql = `update reports set title = '${req.body.title}', content = '${req.body.content}', rangeType = '${req.body.range}', saveTime = '${req.body.saveTime}', submitTime = '${req.body.submitTime}', author = '${req.body.author}', tempId = ${req.body.tempId}, shortCut = '${req.body.shortCut}' where reportId = '${req.body.id}'`;
    } else {
        var sql = `insert into reports (title, content, rangeType, ${req.body.saveTime === '' ? 'submitTime' : 'saveTime'}, author, tempId, shortCut) values ('${req.body.title}', '${req.body.content}', '${req.body.range}', '${req.body.saveTime === '' ? req.body.submitTime : req.body.saveTime}', '${req.body.author}', ${req.body.tempId}, '${req.body.shortCut}');`;
    }
    var selectSql = `select max(reportId) as id from reports`;
    console.log('sql', sql);
    console.log('selectSql', selectSql);
    db.query(sql, (err) => {
        if (err) {
            return res.send('insert错误：' + err.message)
        }
        if (req.body.change) {
            res.send({ id: req.body.id });
        } else {
            db.query(selectSql, (err, data) => {
                if (err) {
                    return res.send('获取最大id错误：' + err.message)
                }
                res.send(data)
            })
        }
    })
})

// COUNT(*) as total
// Boss获取所有
router.post('/getReportSum', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    var body = req.body;
    // var isScreenedStr = body.isScreenedArr.join(',');
    var sql = `select COUNT(*) as total from reports where${body.user ? " author = " + body.user + " and" : ""}${body.screenName ? " author like '%" + body.screenName + "%' and " : ""} submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc`;

    console.log('getReportSum: sql', sql);
    db.query(sql, (err, data) => {
        if (err) {
            return res.send('错误：' + err.message)
        }
        res.send(data)
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
    var sql = `select * from reports where${body.user ? " author = '" + body.user + "' and" : ""}${body.screenName ? " author like '%" + body.screenName + "%' and " : ""} submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc${body.page ? " limit " + (body.page - 1) * 10 + ",10" : ""}`;

    var sumSql = `select COUNT(*) as total from reports where${body.user ? " author = '" + body.user + "' and" : ""}${body.screenName ? " author like '%" + body.screenName + "%' and " : ""} submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc`;

    console.log('getSomeReportData: sql', sql);
    console.log('getSomeReportData: sum', sumSql);
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
            // res.send(sum)
            allData.total = total[0].total;
            console.log('allData', allData);
            res.send(allData);
        })
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

// 获取草稿箱数据
router.post('/getSumDraft', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    var sql = `select count(*) as total from reports where saveTime <> '' and author = '${req.body.authorName}'`;
    console.log('getSumSql', sql);
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
    var sql = `select * from reports where saveTime <> '' and author = '${req.body.authorName}' order by saveTime desc${req.body.page ? " limit " + (req.body.page - 1) * 10 + ", 10" : ""}`;

    var sumSql = `select count(*) as total from reports where saveTime <> '' and author = '${req.body.authorName}' order by saveTime desc`;
    console.log('getDraftData: sql', sql);
    console.log('getDraftData: sumSql', sumSql);

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

module.exports = router