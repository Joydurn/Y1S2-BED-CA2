/*
p2112790 Jayden Yap DAAA/1B/FT/04
category.js
*/
var db = require('./databaseConfig.js');

categoryDB = {
    //endpoint 5
    addCategory: function(newCategoryDetails,callback) {
        const {category, description} = newCategoryDetails
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else {
                var sql = `INSERT INTO category (category,description) VALUES (?, ?)`;
                conn.query(sql,[category,description], function (err,result) {
                    conn.end();
                    if (err){
                        return callback(err, null);
                    } else {     
                        return callback(null, result.insertId);
                    }
                });
            }
        })
    },
    //endpoint 6
    getAllCategories: function(callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else {
                var sql = `SELECT * FROM category`;
                conn.query(sql, function (err,result) {
                    conn.end();
                    if (err){
                        return callback(err, null);
                    } 
                    else {     
                        return callback(null, result);
                    }
                });
            }
        })
    }
}

module.exports=categoryDB;