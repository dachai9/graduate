let mysql = require('mysql')

let db = mysql.createPool({
    host: '127.0.0.1',     //数据库IP地址
    user: 'root',          //数据库登录账号
    password: '123456',      //数据库登录密码
    database: 'enterprise'       //要操作的数据库
})

// const config = {
//     user: 'sa',
//     password: '123456',
//     server: 'localhost',
//     database: 'enterprise',
// options: {
//     encrypt: true //使用windows azure，需要设置次配置。
// }
// }

// const sql = require('mssql') //声明插件
// sql.connect(config)
// .catch(err => {
//     //err 处理
// })
// sql.on('error', err => {
//     //error 处理
// })

module.exports = db
// module.exports = sql