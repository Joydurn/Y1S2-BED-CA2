/*
p2112790 Jayden Yap DAAA/1B/FT/04
databaseConfig.js
*/

var mysql=require('mysql');

var dbConnect={
    getConnection:function(){
        var conn=mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"Superman123.",
            database:"sp_it",
            dateStrings:true
        });
        return conn;
    }
}
module.exports=dbConnect;