/*
p2112790 Jayden Yap DAAA/1B/FT/04
isLoggedInMIddleware.js
*/
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");

var check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
    res.status(401).send({message:"No token (not logged in)"}); //unauthorised
    return;
  }else{
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedToken) => {
      if (error) { //token invalid or expired
        res.status(403).send({message:"Error in verifying your token! Try logging out and logging in again (expired token)"});
        return;
      }else{
        //success
        req.decodedToken= decodedToken;
        req.decodedUserID=decodedToken.userid;
        req.decodedType=decodedToken.type;
        next();
      }
    });
  }
};
module.exports=check;
