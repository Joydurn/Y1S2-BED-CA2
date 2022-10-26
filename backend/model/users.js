/*
p2112790 Jayden Yap DAAA/1B/FT/04
users.js
*/

var db = require('./databaseConfig.js');

userDB = {
    //login and verify user
    verifyUser: function (username, password, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
          if (err) {
            return callback(err, null);
          } else {
            const sql = "SELECT userid,type,username FROM users WHERE username=? AND password=?";
            dbConn.query(sql, [username, password], (error, results) => {
              dbConn.end();
              if (error) {
                return callback(error, null);
            /*
              }else if (results.length !== 1) { //invalid username or password

                //find out if user exists
                var getSQL="SELECT userid,type FROM users WHERE username=?"
                dbConn.query(getSQL, [username], (error, results) => {
                    if(error){
                        return callback(error,null);
                    }else if(results.length===0){ //user doesnt exist
                        return callback({noUser:true}, null);
                    }else{ //username/password is wrong
                        return callback(null,null);
                    }
                });
                */
              } else {
                return callback(null, results[0]);
              }
            });
          }
        });
      },
    //endpoint 1
    addUser: function(details,callback) {
        const {username,email,contact,password,type,profile_pic_url} = details;
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else {
                var sql = `
                INSERT INTO users 
                (username,email,contact,password,type,profile_pic_url) 
                VALUES (?, ?, ?, ?, ?, ?)`;
                conn.query(sql, [username,email,contact,password,type,profile_pic_url], function (err,result) {
                    if (err){
                        return callback(err, null);
                    } else {
                        var selectsql = `
                        SELECT userid FROM users WHERE username = ?;
                        `; //query again to find user details
                        conn.query(selectsql,[username], function (err,result) {
                            conn.end();
                            if (err){
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
    //endpoint 2
    getAllUsers: function(callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else {
                var sql = `SELECT userid,username,email,contact,type,profile_pic_url,created_at FROM users`;
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
    },
    //endpoint 3
    getUser: (userid, callback) => { 
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else {
                var sql = `SELECT userid,username,email,contact,type,profile_pic_url,created_at FROM users WHERE userid = ?`;
                conn.query(sql, [userid], function (err,result) {
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
    //endpoint 4
    updateUser: function(id,userNewDetails,callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else {
                var sql = `SELECT userid FROM users WHERE username = ? OR email = ?;`;
                conn.query(sql, [userNewDetails.username, userNewDetails.email], function (err,result) {
                    if (err){ //other errors
                        return callback(err, null);
                    } else if (result.length > 0) { //duplicate user exists
                        conn.query('SELECT userid FROM users WHERE username = ?',[userNewDetails.username], function (err,result) {
                            conn.end();
                            if (err){
                                return callback(err, null);
                            } else if (result.length === 1) { //username already exists
                                return callback({usernameExist:true},null)
                            } else { //emaill already exists
                                return callback({emailExist:true},null)
                            }
                        });
                    } else {
                        var sql = `
                        SELECT username,email,contact,password,type,profile_pic_url 
                        FROM users WHERE userid = ?;`; //get current user details
                        conn.query(sql,[id], function (err,result) {
                            if (err){
                                return callback(err, null);
                            } else if (result.length == 0) {
                                return callback(null,null);
                            } else {
                                currentDetails = result[0]
                                //if properties of userNewDetails are empty then use back currentDetails
                                if (userNewDetails.username === undefined) userNewDetails.username = currentDetails.username;
                                if (userNewDetails.email === undefined) userNewDetails.email = currentDetails.email;
                                if (userNewDetails.contact === undefined) userNewDetails.contact = currentDetails.contact;
                                if (userNewDetails.password === undefined) userNewDetails.password = currentDetails.password;
                                if (userNewDetails.type === undefined) userNewDetails.type = currentDetails.type;
                                if (userNewDetails.profile_pic_url === undefined) userNewDetails.profile_pic_url = currentDetails.profile_pic_url;
                                var updatesql = `
                                    UPDATE 
                                        users
                                    SET 
                                        username = ?,
                                        email = ?,
                                        contact = ?,
                                        password = ?, 
                                        type = ?,
                                        profile_pic_url = ? 
                                    WHERE 
                                        userid = ?`;
                            conn.query(updatesql,[userNewDetails.username, userNewDetails.email, userNewDetails.contact,userNewDetails.password, userNewDetails.type,userNewDetails.profile_pic_url,id], function (err,result) {
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
                });
            }
        })
    }
}
module.exports=userDB;