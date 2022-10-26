/*
p2112790 Jayden Yap DAAA/1B/FT/04
product.js
*/

var db = require('./databaseConfig.js');

productDB = {
    //search endpoint
    searchProduct: function (search, min, max, callback) {
        console.log(min, max)
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                sqlValues = [parseFloat(min), parseFloat(max)]
                var sql = `
                    SELECT 
                        p.name,
                        p.description,
                        p.categoryid,
                        c.category,
                        p.brand,
                        p.price,
                        p.productid
                    FROM
                        product p,
                        category c
                    WHERE
                        p.price BETWEEN ? AND ?
                        AND
                        p.categoryid=c.categoryid
                `
                //IF EMPTY SEARCH QUERY, JUST FILTER BY PRICE
                if (search != '') {
                    //if only 1 letter search, do exact search
                    if(search.length==1){
                        //append sql string to search for names that start with letter only
                        sql+=`
                        AND
                        (p.name LIKE ?)
                        ORDER BY
                            (p.brand LIKE ?) +
                            (c.category LIKE ?)+
                            (p.name LIKE ?)
                        DESC`
                        //append sql values passed
                    sqlValues.push(`${search}%`)

                    sqlValues.push(`%${search}%`)
                    sqlValues.push(`%${search}%`)
                    sqlValues.push(`%${search}%`)
                       
                    }else{
                        //append sql string to search for names and brands
                        sql += `
                        AND
                        (p.name REGEXP ?
                        OR
                        p.brand REGEXP ?
                        OR
                        c.category REGEXP ?)
                        ORDER BY
                            (p.brand LIKE ?) +
                            (c.category LIKE ?)+
                            (p.name LIKE ?)
                        DESC`
                        //append sql values passed
                    sqlValues.push(search)
                    sqlValues.push(search)
                    sqlValues.push(search)

                    sqlValues.push(`%${search}%`)
                    sqlValues.push(`%${search}%`)
                    sqlValues.push(`%${search}%`)
                    }
                    
                }
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
            }
        })
    },
    //update product
    updateProduct: function (id, productNewDetails, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = `SELECT productid FROM product WHERE name = ?;`;
                conn.query(sql, [productNewDetails.username], function (err, result) {
                    if (err) { //other errors
                        return callback(err, null);
                    } else if (result.length > 0) { //duplicate user exists
                        return callback({ nameExist: true }, null)
                    } else {
                        var sql = `
                        SELECT name,description,categoryid,brand,price 
                        FROM product WHERE productid = ?;`; //get current user details
                        conn.query(sql, [id], function (err, result) {
                            if (err) {
                                return callback(err, null);
                            } else if (result.length == 0) {
                                return callback(null, null);
                            } else {
                                currentDetails = result[0]
                                //if properties of productNewDetails are empty then use back currentDetails
                                if (productNewDetails.name === undefined) productNewDetails.name = currentDetails.name;
                                if (productNewDetails.description === undefined) productNewDetails.description = currentDetails.description;
                                if (productNewDetails.categoryid === undefined) productNewDetails.categoryid = currentDetails.categoryid;
                                if (productNewDetails.brand === undefined) productNewDetails.brand = currentDetails.brand;
                                if (productNewDetails.price === undefined) productNewDetails.price = currentDetails.price;
                                var updatesql = `
                                    UPDATE 
                                        product
                                    SET 
                                        name = ?,
                                        description = ?,
                                        categoryid = ?,
                                        brand = ?, 
                                        price = ?
                                    WHERE 
                                        productid = ?`;
                                conn.query(updatesql, [productNewDetails.name, productNewDetails.description, productNewDetails.categoryid, productNewDetails.brand, productNewDetails.price, id], function (err, result) {
                                    conn.end();
                                    if (err) {
                                        return callback(err, null);
                                    } else {
                                        return callback(null, result.affectedRows);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        })
    },
    //endpoint 7
    addProduct: function (details, callback) {
        const { name, description, categoryid, brand, price } = details;
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                var insertsql = `INSERT INTO product (name,description,categoryid,brand,price) VALUES (?, ?, ?, ?, ?)`;
                conn.query(insertsql, [name, description, categoryid, brand, price], function (err, result) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        var selectsql = `SELECT productid FROM product WHERE name = ?;`;
                        conn.query(selectsql, [name], function (err, result) { //show new product
                            conn.end();
                            if (err) {
                                return callback(err, null);
                            } else {
                                return callback(null, result);
                            }
                        });
                    }
                });
            }
        })
    },
    //endpoint 8
    getProduct: function (id, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = `
                SELECT 
                    p.productid,
                    p.name,
                    p.description,
                    p.categoryid,
                    c.category,
                    p.brand,
                    p.price,
                    p.created_at
                FROM
                    product p,
                    category c
                WHERE
                    p.productid = ?
                    AND
                    p.categoryid = c.categoryid
                    `;
                conn.query(sql, [id], function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else if (result.length == 0) {
                        return callback(null, null)
                    }
                    else {
                        result = result[0];
                        result.categoryname = result.category;
                        result.category = undefined;
                        return callback(null, result);
                    }
                });
            }
        })
    },
    //endpoint 8.5 
    getAllProducts: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = `
                SELECT 
                p.productid,
                p.name,
                p.description,
                p.categoryid,
                c.category,
                p.brand,
                p.price,
                p.created_at
                FROM 
                product p,
                category c
                WHERE
                p.categoryid=c.categoryid`;
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        return callback(null, result);
                    }
                });
            }
        })
    },
    //endpoint 9
    deleteProduct: function (id, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = `DELETE FROM product WHERE productid = ?`;
                conn.query(sql, [id], function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result.affectedRows);
                    }
                });
            }
        })
    }

};

module.exports = productDB;