//生成Excel依赖包
const xlsx = require("node-xlsx");
//写入文件依赖包
var fs = require("fs");
let express = require('express')
let router = express.Router()
let db = require('../db/index')

function exportExcel(data) {
    console.log('data', data);

    // const list = [
    //     {
    //         name: "sheet",
    //         data: [
    //             ["data1", "data2", "data3"],
    //             ["data1", "data2", "data3"],
    //             ["data1", "data2", "data3"],
    //         ],
    //     },
    // ];

    // const buffer = xlsx.build(list);
    // fs.writeFile("testFile.xlsx", buffer, function (err) {
    //     if (err) {
    //         console.log(err, "保存excel出错");
    //     } else {
    //         console.log("写入excel成功!!!");
    //     }
    // });
}


// 导出
router.post('/exportExcel', (req, res) => {
    // req.body.first_name
    // console.log('req', req);
    if (req.body.isAll) {
        // 先请求所有数据
        var sql = `select * from reports where submitTime <> ''${req.body.isBoss ? "" : " and author = '" + req.body.user + "'"}`;
        console.log('exportExcel', sql);
        db.query(sql, (err, data) => {
            if (err) {
                return res.send('错误：' + err.message)
            }
            // res.send(data)
            exportExcel(data);
        })
    } else {
        exportExcel(req.body.data);
    }

})

module.exports = router