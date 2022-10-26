/*
p2112790 Jayden Yap DAAA/1B/FT/04
interest.js
*/


var db = require('./databaseConfig.js');

interestDB = {
    //endpoint 12
    addInterests: function(categoryArr,userid,callback) {
        categoryArr = categoryArr.split(','); //get each categoryid into an array
        categoryArr = [...new Set(categoryArr)]; //make set so that duplicates are removed
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else if (categoryArr.length == 0) {
                return callback({empty:true},null)
            } else {
                //check if user already interested
                var selectChecksql = `SELECT * FROM interest WHERE userid = ${userid} AND (`;
                for (let i = 0;i < categoryArr.length - 1;i++) {
                    selectChecksql += ` categoryid = ${categoryArr[i]} OR`
                };
                selectChecksql += ` categoryid = ${categoryArr[categoryArr.length - 1]});`;
                conn.query(selectChecksql, function (err,result) {
                    if (err){
                        return callback(err, null);
                    } else {
                        //if duplicates, remove them from array
                        if (result.length > 0) {
                            if(result.length==categoryArr.length){
                                return callback({existingCategory:true},null); //if same number of results as category array, all are duplicates
                            }
                            //remove duplicates
                            for(i=0;i<result.length;i++){
                                delIndex=categoryArr.indexOf(`${result[i].categoryid}`)
                                categoryArr.splice(delIndex,1)
                            }
                        }
                        //insert multiple values
                        var insertsql = `INSERT INTO interest (userid, categoryid) VALUES`;
                        sqlvalue = [];
                        for (let i = 0;i < categoryArr.length - 1;i++) {
                            sqlvalue.push(userid,categoryArr[i]);
                            insertsql += ` (${userid}, ${categoryArr[i]}),`
                        };
                        insertsql += ` (${userid}, ${categoryArr[categoryArr.length - 1]});`
                        conn.query(insertsql,sqlvalue, function (err,result) {
                            conn.end();
                            if (err){
                                return callback(err, null);
                            } else {     
                                return callback(null, result.affectedRows);
                            }
                        });
                    }
                });
            }
        })
    },
    //Endpoint 12.5
    getInterests: function(userid,callback){
        var conn=db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else {
                var sql = `
                SELECT 
                    i.intid,
                    c.category,
                    c.description
                FROM
                    interest i,
                    users u,
                    category c
                WHERE
                    i.userid= ?
                    AND
                    u.userid= ?
                    AND
                    i.categoryid = c.categoryid
                    `;
                conn.query(sql, [userid,userid], function (err,result) {
                    conn.end();
                    if (err){
                        return callback(err, null);
                    } else if (result.length == 0) {
                        return callback(null, null)
                    }
                    else {
                        return callback(null, result);
                    }
                });
            }
        })
    },
    //Endpoint 12.55
    deleteInterest: function(intid,callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err,null);
            } else {
                var sql = `DELETE FROM interest WHERE intid = ?`;
                conn.query(sql,[intid], function (err,result) {
                    conn.end();
                    if (err){
                        return callback(err, null);
                    } else {     
                        return callback(null, result.affectedRows);
                    }
                });
            }
        })
    }
};
module.exports=interestDB;