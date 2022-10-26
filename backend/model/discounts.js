/*
p2112790 Jayden Yap DAAA/1B/FT/04
discounts.js
*/
var db = require('./databaseConfig.js');
var discountsDB = {
    //Search endpoint
    searchDiscounts: function (search, callback) {
        sqlValues = []
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = `
                SELECT  
                p.name,
                p.price,
                d.discountsid,
                d.code,
                d.productid,
                d.discountpercent,
                d.starttime,
                d.endtime
                FROM 
                discounts d,
                product p
                WHERE
                d.productid=p.productid
                `
                //IF EMPTY SEARCH QUERY, JUST FILTER BY PRICE
                if (search != '') {
                    //append sql string to search for names and brands
                    sql += `
                    AND
                    (p.name REGEXP ?
                        OR
                    d.code REGEXP ?)
                    ORDER BY
                        (d.code LIKE ?) +
                        (p.name LIKE ?)
                    DESC`
                    //append sql values passed
                    sqlValues.push(search)
                    sqlValues.push(search)
                    sqlValues.push(`%${search}%`)
                    sqlValues.push(`%${search}%`)
                    console.log(conn.format(sql, sqlValues)) //CHECK QUERY troubleshoot
                    conn.query(sql, sqlValues, function (err, result) {
                        conn.end();
                        if (err) {
                            return callback(err, null);
                        } else if (result.length == 0) {
                            return callback(null, null)
                        }
                        else {
                            //result = result[0];
                            //result.categoryname = result.category;
                            //result.category = undefined;
                            return callback(null, result);
                        }
                    });
                } else {
                    console.log(conn.format(sql, sqlValues)) //CHECK QUERY troubleshoot
                    conn.query(sql, function (err, result) {
                        conn.end();
                        if (err) {
                            return callback(err, null);
                        } else if (result.length == 0) {
                            return callback(null, null)
                        }
                        else {
                            //result = result[0];
                            //result.categoryname = result.category;
                            //result.category = undefined;
                            return callback(null, result);
                        }
                    });
                }
            }
        })
    },
    //Endpoint 13
    getAllDiscounts: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log(`Connected to MySQL server in discounts.js getAllDiscounts`);
                var sql = `
                SELECT  
                p.name,
                p.price,
                d.discountsid,
                d.code,
                d.productid,
                d.discountpercent,
                d.starttime,
                d.endtime
                FROM 
                discounts d,
                product p
                WHERE
                d.productid=p.productid
                `;
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },
    //Endpoint 14
    getDiscountByProduct: function (productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null); //callback is either an error or result, this line results in error
            } else {
                console.log(`Connected to MySQL server in discounts.js getDiscountByProduct ID<${productid}>`);
                var sql = `
                    SELECT 
                        discountsid,
                        discountpercent,
                        starttime,
                        endtime
                    FROM 
                        discounts
                    WHERE 
                        productid = ?`;  //don't need to select productid as it is given by user
                conn.query(sql, [productid], function (err, result) { //input product id into sql query
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null); //this callback is error
                    }
                    else {
                        return callback(null, result); //this callback is success
                    }
                });
            }
        });
    },
    //Endpoint 15
    getDiscountByID: function (discountsid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null); //callback is either an error or result, this line results in error
            } else {
                console.log(`Connected to MySQL server in discounts.js getDiscountByID ID<${discountsid}>`);
                var sql = `
                    SELECT 
                        productid,
                        discountpercent,
                        starttime,
                        endtime
                    FROM 
                        discounts
                    WHERE 
                        discountsid = ?`; //don't need to select discountsid column because it is given by user
                conn.query(sql, [discountsid], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null); //this callback is error
                    }
                    else {
                        return callback(null, result); //this callback is success
                    }
                });
            }
        });
    },
    //Endpoint 16
    addDiscount: function (productid, newDiscount, callback) {
        const { code, discountpercent, starttime, endtime } = newDiscount;
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log(`Connected to MySQL server in discounts.js addDiscount ID<${productid}>`);
                //starttime and endtime must be in format 'YYYY-MM-DD HOUR:MIN:SEC' in 24 hour clock
                var sql = 'INSERT INTO discounts (productid, code, discountpercent,starttime,endtime) VALUES (?,?,?,?,?)';
                conn.query(sql, [productid, code, discountpercent, starttime, endtime], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result.insertId);
                    }
                });
            }
        });
    },
    //Endpoint 17
    deleteDiscount: function (discountid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log(`Connected to MySQL server in discounts.js deleteDiscount ID<${discountid}>`);
                //query twice to determine if product exists
                var sql = `
                    SELECT * FROM discounts WHERE discountsid=?;
                    DELETE FROM discounts WHERE discountsid = ?`;
                conn.query(sql, [discountid, discountid], function (err, result) { //parse discountid twice for 2 statements
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },
}

module.exports = discountsDB;  //export functions to app.js


