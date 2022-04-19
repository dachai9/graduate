let express = require('express')
let router = express.Router()
let db = require('../db/index')
let schedule = require("node-schedule");
let moment = require("moment");


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
            console.log('已提交名单置空', new moment().format('YYYY-MM-DD HH:mm:ss'));
        })
    });
}


module.exports = router
