/*
p2112790 Jayden Yap DAAA/1B/FT/04
FEserver.js
*/
const express=require('express');
const serveStatic=require('serve-static');
const path = require('path');
var hostname="localhost";
var port=3001;

var app=express();

app.use(function(req,res,next){
    console.log(req.method,req.url)
    if(req.method!="GET"){
        res.type('.html');
        var msg="<html><body>This server only serves web pages with GET!</body></html>";
        res.end(msg);
    }else{
        next();
    }
});

app.get('/product/:id', function(req,res){ //for getting product details, otherwise just use servestatic
    res.sendFile(path.join(__dirname, '/public/product.html'))
})

app.use(serveStatic(__dirname+"/public"));

app.get('/*', function(req,res){ //for getting product details, otherwise just use servestatic
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.listen(port,hostname,function(){
    console.log(`Frontend server hosted at http://${hostname}:${port}`);
});