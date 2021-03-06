let express = require('express')
let app = express()
let cors = require('cors')
let bodyParser = require('body-parser')
let index = require('./API/index')
let login = require('./API/login')
let temp = require('./API/temp')
let report = require('./API/report')
let staff = require('./API/staff')
let exportExcel = require('./API/exportExcel')

app.use(bodyParser.json());  //配置解析，用于解析json和urlencoded格式的数据
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())              //配置跨域，必须在路由之前
app.use(index)
app.use(login)
app.use(temp)
app.use(report)
app.use(staff)
app.use(exportExcel)


app.listen(88, () => {
    console.log('服务器启动成功');
})
