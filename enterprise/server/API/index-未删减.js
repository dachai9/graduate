let express = require('express')
let router = express.Router()
let db = require('../db/index')
let schedule = require("node-schedule");
let moment = require("moment");

// router.get('/index', (req, res) => {
//     var sql = 'SELECT * FROM enterprise.`table_index`;'
//     db.query(sql, (err, data) => {
//         if (err) {
//             return res.send('错误：' + err.message)
//         }
//         res.send(data)
//     })
// })

// var tempArr = [];
// sessionStorage.getItem('weekly') ? tempArr.weekly = sessionStorage.getItem('weekly') : '';
// sessionStorage.getItem('monthly') ? tempArr.monthly = sessionStorage.getItem('monthly') : '';
// sessionStorage.getItem('seasonal') ? tempArr.seasonal = sessionStorage.getItem('seasonal') : '';
// sessionStorage.getItem('yearly') ? tempArr.yearly = sessionStorage.getItem('yearly') : '';
// var updateTime = [];
// console.log('map', scheduleArr);
// new Promise((resolve) => {
//     var departmentsql = 'SELECT * FROM departments';
//     db.query(departmentsql, (err, departmentData) => {
//         if (err) {
//             return false;
//         }
//         // console.log('department', departmentData);
//         departmentData.forEach(item => {
//             item.weekly && tempArr.push({ range: 'weekly', tempId: item.weekly });
//             item.monthly && tempArr.push({ range: 'monthly', tempId: item.monthly });
//             item.seasonal && tempArr.push({ range: 'seasonal', tempId: item.seasonal });
//             item.yearly && tempArr.push({ range: 'yearly', tempId: item.yearly });
//         });
//         // console.log('tempArr', tempArr);
//         resolve(resolve)
//     })
// }).then(() => {
//     for (let i = 0; i < tempArr.length; i++) {
//         // console.log('tempArr[' + i + '].range', tempArr[i].range === 'weekly');
//         switch (tempArr[i].range) {
//             case 'weekly':
//                 var updateSql = `update templates set submitList = null where tempId = ${tempArr[i].tempId} and JSON_UNQUOTE(JSON_EXTRACT(cast(temp as json), '$."range"')) = 'weekly' and JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[0]."day"')) = DATE_FORMAT(now(), '%W')`;
//                 scheduleArr.set(tempArr[i].tempId, schedule);
//                 break;

//             case 'monthly':
//                 var updateSql = `update templates set submitList = null where tempId = ${tempArr[i].tempId} and JSON_UNQUOTE(JSON_EXTRACT(cast(temp as json), '$."range"')) = 'monthly' and JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[0]."day"')) = DATE_FORMAT(now(), '%m')`;
//                 break;

//             case 'seasonal':
//                 var updateSql = `update templates set submitList = null 
//                 where tempId = ${tempArr[i].tempId} 
//                 and JSON_UNQUOTE(JSON_EXTRACT(cast(temp as json), '$."range"')) = 'seasonal' 
//                 and (
//                     (JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[0]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d'))) 
//                     or (JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[1]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d'))) 
//                     or (JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[2]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d'))) 
//                     or (JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[3]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d')))
//                 )`;
//                 break;

//             case 'yearly':
//                 var updateSql = `update templates set submitList = null where tempId = ${tempArr[i].tempId} and JSON_UNQUOTE(JSON_EXTRACT(cast(temp as json), '$."range"')) = 'yearly' and JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[0]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d'))`;
//                 break;
//             default:
//                 var updateSql = '';
//                 break;
//         }
//         // console.log('updateSql', updateSql);
//         // db.query(updateSql, (error) => {
//         //     if (error) {
//         //         return false;
//         //     }
//         //     // console.log('update', data);
//         // })
//         setSchedule(updateSql, '1 * * * * *');
//     }
// })

var sql = `update templates set submitList = null where submitTime <> '' and (
	(JSON_UNQUOTE(JSON_EXTRACT(cast(temp as json), '$."range"')) = 'weekly' 
		and JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[0]."day"')) = DATE_FORMAT(now(), '%W')
	) or 
	(JSON_UNQUOTE(JSON_EXTRACT(cast(temp as json), '$."range"')) = 'monthly' 
		and JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[0]."day"')) = DATE_FORMAT(now(), '%d')
	) or
	(JSON_UNQUOTE(JSON_EXTRACT(cast(temp as json), '$."range"')) = 'seasonal' 
		and (
    (JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[0]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d'))) 
    or (JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[1]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d'))) 
    or (JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[2]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d'))) 
    or (JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[3]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d')))
		)
	) or 
	(JSON_UNQUOTE(JSON_EXTRACT(cast(temp as json), '$."range"')) = 'yearly' 
		and JSON_UNQUOTE(JSON_EXTRACT(cast(updateTime as json), '$[0]."day"')) = CONCAT_WS('.', DATE_FORMAT(now(), '%m'), DATE_FORMAT(now(), '%d'))
	)
)`
setSchedule(sql);
function setSchedule(sql) {
    schedule.scheduleJob('0 0 0 * * *', () => {
        // console.log('已读名单置空', new moment().format('YYYY-MM-DD HH:mm:ss'), count);
        db.query(sql, (error) => {
            if (error) {
                return false;
            }
            console.log('已读名单置空', moment('YYYY-MM-DD HH:mm:ss'));
        })
    });
}


module.exports = router
// module.exports = logout
