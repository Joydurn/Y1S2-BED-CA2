/*
p2112790 Jayden Yap DAAA/1B/FT/04
server.js
*/

var app = require('./controller/app.js');
const serveStatic=require('serve-static');

var port = 8081;

app.use(serveStatic(__dirname+"/public"));

var server=app.listen(port,function(){
    console.log("Backend at localhost:"+port);
});