let express = require('express')
let router = express.Router()
let db = require('../db/index')
let { verifyToken } = require("./util");

// 插入报告数据
router.post('/updateReportData', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        // console.log('req', req);
        if (req.body.change) {
            var sql = `update reports set title = '${req.body.title}', content = '${req.body.content}', rangeType = '${req.body.range}', saveTime = '${req.body.saveTime}', submitTime = '${req.body.submitTime}', author = '${req.body.author}', tempId = ${req.body.tempId}, shortCut = '${req.body.shortCut}' where reportId = '${req.body.id}'`;
        } else {
            var sql = `insert into reports (title, content, rangeType, ${req.body.saveTime === '' ? 'submitTime' : 'saveTime'}, author, tempId, shortCut) values ('${req.body.title}', '${req.body.content}', '${req.body.range}', '${req.body.saveTime === '' ? req.body.submitTime : req.body.saveTime}', '${req.body.author}', ${req.body.tempId}, '${req.body.shortCut}');`;
        }
        var selectSql = `select max(reportId) as id from reports`;
        // console.log('sql', sql);
        // console.log('selectSql', selectSql);
        db.query(sql, (err) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "更新报告失败，请重试！" });
            }
            if (req.body.change) {
                res.status(200).send({ id: req.body.id });
            } else {
                db.query(selectSql, (err, data) => {
                    if (err) {
                        return res.status(500).send({ err, status: 0, message: "更新报告失败，请重试！" });
                    }
                    res.status(200).send(data)
                })
            }
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// COUNT(*) as total
// Boss获取所有
router.post('/getReportSum', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        // console.log('req', req);
        var body = req.body;
        // var isScreenedStr = body.isScreenedArr.join(',');
        var sql = `select COUNT(*) as total from reports where${body.user ? " author = " + body.user + " and" : ""}${body.screenName ? " author like '%" + body.screenName + "%' and " : ""} submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc`;

        // console.log('getReportSum: sql', sql);
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "获取报告总数失败，请重试！" });
            }
            res.status(200).send(data)
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 获取报告数据
router.get('/getReportData', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        // console.log('req', req);
        var sql = `select * from reports where reportId = ${req.query.id}`;
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "获取当前报告失败，请重试！" });
            }
            res.status(200).send(data)
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// Boss获取符合条件的报告数据
router.post('/getSomeReportData', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        // console.log('req', req);
        var body = req.body;
        // var isScreenedStr = body.isScreenedArr.join(',');
        var sql = '';
        var sumSql = '';
        if (body.user) {
            sql = `select * from reports where author = '${body.user}' and submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc${body.page ? " limit " + (body.page - 1) * 10 + ",10" : ""}`;

            sumSql = `select COUNT(*) as total from reports where author = '${body.user}' and submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc`;

        } else {
            sql = `select * from reports where${body.screenName ? " author like '%" + body.screenName + "%' and " : " author in (select staffName from allStaff where department = '" + body.department + "') and"} submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc${body.page ? " limit " + (body.page - 1) * 10 + ",10" : ""}`;

            sumSql = `select COUNT(*) as total from reports where${body.screenName ? " author like '%" + body.screenName + "%' and " : " author in (select staffName from allStaff where department = '" + body.department + "') and"} submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc`;

            // author in (select staffName from allstaff where department = '${req.body.department}')
        }
        // var sql = `select * from reports where${body.user ? " author = '" + body.user + "' and" : ""}${body.screenName ? " author like '%" + body.screenName + "%' and " : ""} submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc${body.page ? " limit " + (body.page - 1) * 10 + ",10" : ""}`;

        // var sumSql = `select COUNT(*) as total from reports where${body.user ? " author = '" + body.user + "' and" : ""}${body.screenName ? " author like '%" + body.screenName + "%' and " : ""} submitTime <> ''${body.isScreenedArr ? " and rangeType in ('" + body.isScreenedArr.join('\',\'') + "')" : ""}${(body.dateString && body.dateString[0] != '') ? " and submitTime between '" + body.dateString[0] + " 00:00:00' and '" + body.dateString[1] + " 23:59:59'" : ""} order by submitTime desc`;

        // console.log('getSomeReportData: sql', sql);
        // console.log('getSomeReportData: sum', sumSql);
        var allData = {};
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "获取报告失败，请重试！" });
            }
            // res.send(data)
            allData.data = data;

            db.query(sumSql, (err, total) => {
                if (err) {
                    return res.status(500).send({ err, status: 0, message: "获取报告总数失败，请重试！" });
                }
                // res.send(sum)
                allData.total = total[0].total;
                // console.log('allData', allData);
                res.status(200).send(allData);
            })
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 删除某条数据
router.post('/deleteAReport', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        var sql = `delete from reports where reportId = ${req.body.id}`;
        // console.log('sql', sql);
        db.query(sql, (err) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "删除报告失败，请重试！" });
            }
            res.status(200).send('success')
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 获取草稿箱数据
router.post('/getSumDraft', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        // console.log('req', req);
        var sql = `select count(*) as total from reports where saveTime <> '' and author = '${req.body.authorName}'`;
        // console.log('getSumSql', sql);
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "获取报告总数失败，请重试！" });
            }
            res.status(200).send(data)
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 获取草稿箱数据
router.post('/getDraftData', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        // console.log('req', req);
        var sql = `select * from reports where saveTime <> '' and author = '${req.body.authorName}' order by saveTime desc${req.body.page ? " limit " + (req.body.page - 1) * 10 + ", 10" : ""}`;

        var sumSql = `select count(*) as total from reports where saveTime <> '' and author = '${req.body.authorName}' order by saveTime desc`;
        // console.log('getDraftData: sql', sql);
        // console.log('getDraftData: sumSql', sumSql);

        var allData = {};
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "获取报告失败，请重试！" });
            }
            // res.send(data)
            allData.data = data;
            db.query(sumSql, (err, total) => {
                if (err) {
                    return res.status(500).send({ err, status: 0, message: "获取报告总数失败，请重试！" });
                }
                allData.total = total[0].total;
                res.status(200).send(allData);
            })
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 获取已读
router.get('/getIsRead', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // console.log('req', req, req.query.name);
        var sql = `select isRead from allStaff where staffName = '${req.query.name}'`;
        // console.log('sql', sql);
        db.query(sql, (err, data) => {
            if (err) {
                res.status(500).send({ err, status: 0, message: "获取已读列表失败，请重试！" });
            }
            res.status(200).send(data)
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 更新已读
router.post('/updateIsRead', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // console.log('req', req, req.body.user);
        var sql = `update allStaff set isRead = '${req.body.isRead}' where staffName = '${req.body.user}'`;
        // console.log('sql', sql);
        db.query(sql, (err) => {
            if (err) {
                res.status(500).send({ err, status: 0, message: "更新已读列表失败，请重试！" });
            }
            res.status(200).send('success')
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 全部设为已读
router.post('/setAllRead', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        var sql = `select reportId from reports where author <> '${req.body.user}' and submitTime <> ''`;
        // console.log('setAllRead: sql', sql);
        db.query(sql, (err, data) => {
            if (err) {
                res.status(500).send({ err, status: 0, message: "获取报告失败，请重试！" });
            }
            var dataArr = [];
            data.forEach(item => {
                dataArr.push(item.reportId);
            })
            // console.log('data', data, dataArr);

            var isReadSql = `update allStaff set isRead = '${JSON.stringify(dataArr)}' where staffName = '${req.body.user}'`;
            // console.log('setAllRead: isReadSql', isReadSql);
            db.query(isReadSql, (err) => {
                if (err) {
                    res.status(500).send({ err, status: 0, message: "更新已读列表失败，请重试！" });
                }
                res.status(200).send(JSON.stringify(dataArr))
            })
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

module.exports = router