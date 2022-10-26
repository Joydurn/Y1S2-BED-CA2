/*
p2112790 Jayden Yap DAAA/1B/FT/04
reviews.js
*/

var db = require('./databaseConfig.js');

reviewsDB = {
    //endpoint 10
    addReview: (productid,details,callback) => {
        const {userid,rating,review} = details;
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err,null);
            } else {
                var sql = `
                SELECT reviewid FROM reviews 
                WHERE userid = ? AND productid = ?`; //check if user reviewed product before
                conn.query(sql, [userid,productid], function (err,result) {
                    if (err){
                        return callback(err, null);
                    } else if (result.length > 0) {
                        return callback({reviewed:true}, null)
                    }
                    else {     
                        var insertsql = `INSERT INTO reviews (productid,userid,rating,review) VALUES (?,?,?,?)`;
                        conn.query(insertsql,[productid,userid,rating,review], function (err,result) {
                        if (err){
                            return callback(err, null);
                        } else {     
                            conn.query('SELECT reviewid FROM reviews WHERE userid = ? AND productid = ?',[userid,productid], function (err,result) { 
                                conn.end(); //return new review details
                                if (err){
                                    return callback(err, null);
                                } else {     
                                    return callback(null, result);
                                }
                            });
                        }
                    });
                    }
                });
            }
        })
    },
    //endpoint 11
    getReviews: function(productid,callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else {
                var joinedsql = `
                SELECT 
                    p.productid,
                    r.userid,
                    u.username,
                    r.rating,
                    r.review,
                    r.created_at
                FROM
                    product p,
                    users u,
                    reviews r
                WHERE
                    p.productid = ?
                    AND
                    p.productid = r.productid
                    AND
                    r.userid = u.userid
                    `;
                conn.query(joinedsql, [productid], function (err,result) {
                    conn.end();
                    if (err){
                        return callback(err, null);
                    } else if (result.length == 0) { //no result
                        return callback(null, null)
                    }
                    else {
                        return callback(null, result);
                    }
                });
            }
        })
    }
};
module.exports=reviewsDB;