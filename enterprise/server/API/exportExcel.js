//生成Excel依赖包
const xlsx = require("node-xlsx");
//写入文件依赖包
var fs = require("fs");
let express = require("express")
let router = express.Router()
let db = require('../db/index')
let moment = require("moment")
let { verifyToken } = require("./util");

function exportExcel(data, res) {
    var list = [
        ["导出时间: " + moment().format('YYYY-MM-DD HH:mm:ss')],
        ["标题", "内容", "类型", "作者", "提交时间"],
    ];
    for (let i = 0; i < data.length; i++) {
        list.push([data[i].title, data[i].shortCut, data[i].rangeType, data[i].author, data[i].submitTime]);
    }
    // console.log('list', list);
    // 设置excel宽度
    const sheetOptions = { '!cols': [{ wch: 25 }, { wch: 100 }, { wch: 10 }, { wch: 10 }, { wch: 25 }] };
    var buffer = xlsx.build([{ name: 'sheet', data: list }], { sheetOptions });

    fs.writeFile(`../../export_${new Date().getTime()}.xlsx`, buffer, function (err) {
        if (err) {
            console.log(err, "保存excel出错");
            res.status(500).send({ err, status: 0, message: "导出失败，请重试！" });
        } else {
            // console.log("写入excel成功!!!");
            res.status(200).send("success");
        }
    });
}

// 导出
router.post('/exportExcel', (req, res) => {
    const { status, code, message } = verifyToken(req.headers);
    if (status) {
        // req.body.first_name
        // console.log('req', req);
        if (req.body.isAll) {
            // 先请求所有数据
            var sql = `select * from reports where submitTime <> ''${req.body.isBoss ? "" : " and author = '" + req.body.user + "'"} order by submitTime desc`;
            console.log('exportExcel', sql);
            db.query(sql, (err, data) => {
                if (err) {
                    return res.status(500).send({ err, status: 0, message: "获取全部报告信息失败，请重试！" });
                }
                // res.send(data)
                exportExcel(data, res);
            })
        } else {
            // 当页数据
            exportExcel(req.body.data, res);
        }
    } else {
        return res.status(code).send({ status: 0, message });
    }

})

module.exports = router