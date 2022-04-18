let express = require('express')
let router = express.Router()
let db = require('../db/index')
let { verifyToken } = require("./util");

// 登录后获取上司已创建的模板
router.post('/getTemp', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        var sql = `select * from departments where departName = '${req.body.depart}'`
        // console.log('sql', sql);
        db.query(sql, (err, data) => {
            if (err) {
                // return res.send('错误：' + err.message)
                return res.status(500).send({ err, status: 0, message: "获取模板失败，请重试！" });
            }
            // res.send(data)
            res.status(200).send(data);
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 创建模板并记录到部门模板表中
router.post('/insertTemp', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        var sql = `insert into templates (temp, author, title${req.body.saveTime ? ", saveTime" : ""}${req.body.submitTime ? ", submitTime" : ""}, updateTime) values ('${req.body.temp}', '${req.body.author}', '${req.body.title}'${req.body.saveTime ? ", '" + req.body.saveTime + "'" : ""}${req.body.submitTime ? ", '" + req.body.submitTime + "'" : ""}, '${req.body.updateTime}')`;
        if (req.body.submitTime) {
            var updateSql = `update enterprise.departments a, enterprise.templates b set a.${req.body.range} = (select max(tempId) from templates) where a.departName = '${req.body.department}';`
        }
        // console.log('sql', sql);
        // console.log('updateSql', updateSql);
        db.query(sql, (err) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "新建模板失败，请重试！" });
            }
            if (req.body.submitTime) {
                db.query(updateSql, (err) => {
                    if (err) {
                        return res.status(500).send({ err, status: 0, message: "发布模板失败，请重试！" });
                    }
                    res.status(200).send('success')
                })
            } else {
                res.status(200).send('success')
            }
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 根据模板 id 获取模板
router.get('/getTempById', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        // console.log('req', req);
        var sql = `select * from templates where tempId = ${req.query.id}`;
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "获取当前模板失败，请重试！" });
            }
            res.status(200).send(data)
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 获取草稿箱中所有的模板信息
router.post('/getAllTempData', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        var sql = `select * from templates where saveTime <> '' and author = '${req.body.authorName}' order by saveTime desc${req.body.page ? " limit " + (req.body.page - 1) * 10 + ", 10" : ""}`;

        var sumSql = `select count(*) as total from templates where saveTime <> '' and author = '${req.body.authorName}' order by saveTime desc`;
        // console.log('getAllTempData: sql', sql);
        // console.log('getAllTempData: sumSql', sumSql);

        var allData = {};
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "获取模板信息失败，请重试！" });
            }
            // res.send(data)
            allData.data = data;
            db.query(sumSql, (err, total) => {
                if (err) {
                    return res.status(500).send({ err, status: 0, message: "获取模板总数失败，请重试！" });
                }
                allData.total = total[0].total;
                res.status(200).send(allData);
            })
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 删除模板
router.post('/deleteATemp', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        var sql = `delete from templates where tempId = ${req.body.id}`;
        db.query(sql, (err) => {
            if (err) {
                return res.status(500).send({ err, status: 0, message: "删除模板失败，请重试！" })
            }
            res.status(200).send('success')
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

// 更新模板
router.post('/updateTemp', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        var sql = `update templates set temp = '${req.body.temp}', title = '${req.body.title}', saveTime = ${req.body.saveTime ? "'" + req.body.saveTime + "'" : 'NULL'}, submitTime = ${req.body.submitTime ? "'" + req.body.submitTime + "'" : 'NULL'}, author = '${req.body.author}' where tempId = '${req.body.tempId}'`;
        // console.log('sql', sql);
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
                return res.status(500).send({ err, status: 0, message: "更新模板失败，请重试！" })
            }
            if (req.body.submitTime) {
                db.query(updateSql, (err) => {
                    if (err) {
                        return res.status(500).send({ err, status: 0, message: "更新当前模板失败，请重试！" })
                    }
                    res.status(200).send('success')
                })
            } else {
                res.status(200).send('success')
            }
        })
    } else {
        return res.status(code).send({ status: 0, message });
    }
})

module.exports = router