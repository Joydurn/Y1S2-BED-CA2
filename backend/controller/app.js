/*
p2112790 Jayden Yap DAAA/1B/FT/04
app.js
*/

//************DEPENDENCIES*************** 
//Express
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));  //static files for images
//JWT for verification
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");
//cors dependency
var cors = require('cors');
app.options('*', cors());
app.use(cors());

//****************IMPORT MODELS*******************
//basic endpoints
var users = require('../model/users');
var category = require('../model/category');
var product = require('../model/product');
var reviews = require('../model/reviews');
var interest = require('../model/interest');
//advanced
var discounts = require('../model/discounts.js');

//********************ENDPOINTS**********************

//login endpoint
app.post("/login/", (req, res) => {
    users.verifyUser(req.body.username, req.body.password, (error, user) => {
        if (error) {
            res.status(500).send();
            return;
        } else if (user === null || user === undefined) {
            res.status(401).send({ message: 'Invalid username or password' });
        } else {
            console.log(user)
            const payload = { userid: user.userid, type: user.type, username: user.username };
            jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: 900 }, (error, token) => { //expire in 15 mins
                if (error) {
                    res.status(401).send("Error in creating token");
                    return;
                } else {
                    console.log("login success")
                    res.status(200).send({
                        token: token,
                        userid: user.userid,
                        type: user.type,
                        username: user.username
                    });
                }
            });
        }
    });
});
//checking token endpoint
app.get("/check", isLoggedInMiddleware, (req, res) => {
    res.sendStatus(200);
});
//search endpoint
app.post('/product/search', function (req, res) {
    console.log(req.body)
    product.searchProduct(req.body.search, req.body.min, req.body.max, (err, result) => {
        if (err) {
            console.log(err)
            res.sendStatus(500); //other errors
        } else if (result === null) {
            res.status(404).send({ 'message': `No search results` }) //extra validation
        }
        else {
            res.status(200).send(result); //success
        };
    });
});
//endpoint 1 admins only
app.post('/users/', isLoggedInMiddleware, function (req, res) {
    if (req.decodedType == 'Admin') {
        //if any request body fields are empty replace with undefined
        if (req.body.username == "") req.body.username = undefined;
        if (req.body.email == "") req.body.email = undefined;
        if (req.body.contact == "") req.body.contact = undefined;
        if (req.body.password == "") req.body.password = undefined;
        if (req.body.type == "") req.body.type = undefined;
        if (req.body.profile_pic_url == "") req.body.profile_pic_url = undefined;
        users.addUser(req.body, (err, result) => {
            if (err) {
                if (err.errno === 1048) {//sql not null error
                    res.status(411).send({ 'message': err.sqlMessage.slice(7,) });
                } else if (err.sqlMessage.slice(-18, -1) === 'user.email_UNIQUE' && err.errno === 1062) { //if duplicate email
                    res.status(422).send({ 'message': `Duplicate email of <${req.body.email}>!` });
                } else if (err.sqlMessage.slice(-21, -1) === 'user.username_UNIQUE' && err.errno === 1062) { //if duplicate username
                    res.status(422).send({ 'message': `Duplicate username of <${req.body.username}>!` });
                } else if (err.errno === 1062) {
                    res.status(422).send({ 'message': `Duplicate contact number of <${req.body.contact}>!` }); //if duplicate contact number
                } else {
                    console.log(err)
                    res.sendStatus(500); //other errors
                };
            } else {
                res.status(201).json(result[0]); //send results 
            };
        });
    } else {
        res.status(403).send({ 'message': 'Only admins allowed to add users' })
    }
});

//endpoint 2 only admins
app.get('/users/', isLoggedInMiddleware, function (req, res) {
    const actualType = req.decodedType;
    if (actualType == 'Admin') {
        users.getAllUsers((err, result) => {
            if (err) {
                res.sendStatus(500); //other errors
            }
            else {
                res.status(200).send(result); //send users
            };
        });
    } else {
        res.status(403).json({ message: `Only admins are allowed to see all users` })
    }
});

//endpoint 3 admin can see anyone, customer only see themselves
app.get('/users/:userid/', isLoggedInMiddleware, function (req, res) {
    const userid = parseInt(req.params.userid);
    const actualID = req.decodedUserID;
    const actualType = req.decodedType;
    if (isNaN(userid)) { //userid not number
        res.status(406).json({ message: `userid submitted is invalid` });
    } else if (actualID !== userid && actualType == 'Customer') {
        res.status(403).json({ message: `You're only allowed to see your own details` })
    } else {
        users.getUser(userid, (err, result) => {
            if (err) {
                res.sendStatus(500);
            } else if (result === null) { //user does not exist
                res.status(404).json({ message: `User with id<${userid}> not found` })
            }
            else {
                res.status(200).json(result[0]);
            }
        });
    }
});

//endpoint 4 own user only /admins
app.put('/users/:userid/', isLoggedInMiddleware, function (req, res) {
    const userid = parseInt(req.params.userid);
    const actualID = req.decodedUserid;
    const actualType = req.decodedType;
    //if any field is empty replace with undefined
    if (req.body.username == "") req.body.username = undefined;
    if (req.body.email == "") req.body.email = undefined;
    if (req.body.contact == "") req.body.contact = undefined;
    if (req.body.password == "") req.body.password = undefined;
    if (req.body.type == "") req.body.type = undefined;
    if (req.body.profile_pic_url == "") req.body.type = undefined;

    if (isNaN(userid)) { //userid invalid
        res.status(406).json({ message: `invalid userid submitted` });
    } else if (actualID !== userid && actualType == 'Customer') { //verification
        res.status(403).json({ message: `You're only allowed to update your own account` })
    } else {
        users.updateUser(userid, req.body, (err, result) => {
            if (err) {
                if (err.usernameExist) { //duplicate username
                    res.status(422).send({ 'message': `the username <${req.body.username}> already exist!` }) //basic requirement - existing username
                } else if (err.emailExist) { //duplicate email
                    res.status(422).send({ 'message': `the email <${req.body.email}> already exist!` }) //basic requirement - existing email
                } else {
                    res.sendStatus(500); //other errors
                }
            } else if (result === null) { //no result= no user
                res.status(404).json({ message: `user <${userid}> not found` })
            }
            else {
                res.sendStatus(204); //success
            }
        });
    }
});

//endpoint 5 only admins
app.post('/category', isLoggedInMiddleware, function (req, res) {
    const actualID = req.decodedUserid;
    const actualType = req.decodedType;
    //if empty replace with undefined
    if (req.body.category == "") req.body.category = undefined;
    if (req.body.description == "") req.body.description = undefined;
    if (actualType == 'Admin') {
        category.addCategory(req.body, (err, result) => {
            if (err) {
                //sql not null error
                if (err.errno === 1048) {
                    res.status(411).send({ 'message': err.sqlMessage.slice(7,) });
                }
                else if (err.errno === 1062) {
                    res.status(422).send({ 'message': `duplicate category name<${req.body.category}>` });
                } else {
                    res.sendStatus(500); //unknown errors
                };
            } else {
                res.status(201).send(result.toString());
            };
        });
    } else {
        res.status(403).send("Only admins allowed to add categories")
    }
});

//endpoint 6 anyone
app.get('/category', function (req, res) {
    category.getAllCategories((err, result) => {
        if (err) {
            res.sendStatus(500); //send error code 500 if error unknown
        }
        else {
            res.status(200).send(result); //basic requirement
        };
    });
});

//endpoint 7 admins only
app.post('/product/', isLoggedInMiddleware, function (req, res) {
    const actualID = req.decodedUserid;
    const actualType = req.decodedType;
    //if empty replace with undefined
    if (req.body.name == "") req.body.name = undefined;
    if (req.body.description == "") req.body.description = undefined;
    if (req.body.categoryid == "") req.body.categoryid = undefined;
    if (req.body.brand == "") req.body.brand = undefined;
    if (req.body.price == "") req.body.price = undefined;
    if (actualType !== 'Admin') {
        res.status(403).json({ message: `Only admins allowed to post products` })
    } else if (isNaN(req.body.categoryid) || isNaN(req.body.price)) {
        res.status(406).json({ message: `categoryid or price given are invalid` });
    } else {
        product.addProduct(req.body, (err, result) => {
            if (err) {
                if (err.errno === 1048) {//sql not null error
                    res.status(411).send({ 'message': err.sqlMessage.slice(7,) });
                } else if (err.errno === 1054 || err.errno === 1452) { //invalid category
                    res.status(404).send({ 'message': `category <${req.body.categoryid}> does not exist` })
                } else if (err.errno === 1062) { //duplicate 
                    res.status(422).send({ 'message': `<${req.body.name}> product already exists` });
                } else {
                    res.sendStatus(500);
                };
            } else {
                res.status(201).json(result[0]);
            };
        });
    }
});

//endpoint 8 anyone
app.get('/product/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(406).json({ message: `invalid productid` })
    } else {
        product.getProduct(id, (err, result) => {
            if (err) {
                res.sendStatus(500); //other errors
            } else if (result === null) {
                res.status(404).send({ 'message': `product<${id}> doesnt exist` }) //extra validation
            }
            else {
                result.price = result.price.toFixed(2).toString(); //change price to 2d.p
                res.status(200).send(result); //success
            };
        });
    };
});
//endpoint 8.5 get all products
app.get('/product', function (req, res) {
    product.getAllProducts((err, result) => {
        if (err) {
            res.sendStatus(500); //other errors
        } else if (result === null) {
            res.status(404).send({ 'message': `No products found` }) //extra validation
        }
        else {
            res.status(200).send(result); //success
        };
    });
});
//endpoint 9.5 EDIT PRODUCTS ADMIN ONLY for advanced feature
app.put('/product/:productid/', isLoggedInMiddleware, function (req, res) {
    const productid = parseInt(req.params.productid);
    const actualType = req.decodedType;
    //if any field is empty replace with undefined
    if (req.body.name == "") req.body.name = undefined;
    if (req.body.description == "") req.body.description = undefined;
    if (req.body.categoryid == "") req.body.categoryid = undefined;
    if (req.body.brand == "") req.body.brand = undefined;
    if (req.body.price == "") req.body.price = undefined;
    if (isNaN(productid)) { //productid invalid
        res.status(406).json({ message: `invalid productid submitted` });
    } else if (actualType == 'Customer') { //verification
        res.status(403).json({ message: `Only admins are allowed to update products!` })
    } else {
        product.updateProduct(productid, req.body, (err, result) => {
            if (err) {
                if (err.nameExist) { //duplicate product name
                    res.status(422).send({ 'message': `the product <${req.body.name}> already exists!` }) //existing product
                } else {
                    res.sendStatus(500); //other errors
                }
            } else if (result === null) { //no result= no user
                res.status(404).json({ message: `Product <${productid}> not found` })
            }
            else {
                res.sendStatus(204); //success
            }
        });
    }
});
//endpoint 9 admins only
app.delete('/product/:id', isLoggedInMiddleware, function (req, res) {
    const actualID = req.decodedUserid;
    const actualType = req.decodedType;
    if (actualType !== 'Admin') {
        res.status(403).json({ message: `Only admins allowed to delete products` })
    } else if (isNaN(req.params.id)) {
        res.status(406).json({ message: `Invalid productid` })
    }
    else {
        product.deleteProduct(req.params.id, (err, affectedRows) => {
            if (err) {
                res.sendStatus(500); //other errors
            } else if (affectedRows === 0) {
                res.status(404).send({ message: `productid <${req.params.id}> doesnt exist` })
            } else {
                res.sendStatus(204); //success
            }
        });
    }
});

//endpoint 10 login required
app.post('/product/:id/review/', isLoggedInMiddleware, function (req, res) {
    const productid = req.params.id;
    //if fields are empty replace them
    if (req.body.userid == "") req.body.userid = undefined;
    if (req.body.rating == "") req.body.rating = undefined;
    if (req.body.review == "") req.body.review = undefined;
    if (isNaN(req.body.userid) || isNaN(req.body.rating)) {
        res.status(406).json({ message: `unacceptable userid or rating submitted` });
    } else {
        reviews.addReview(productid, req.body, (err, result) => {
            if (err) {
                if (err.errno === 1048) { //NN error
                    res.status(411).send({ 'message': err.sqlMessage.slice(7,) });
                } else if (err.errno === 1452) { //product or user does not exist
                    res.status(404).send({ 'message': `product or user does not exist!` })
                } else if (err.reviewed) { //user already has reviewed product
                    res.status(401).send({ 'message': `sorry but you had already reviewed for this product` })
                } else {
                    res.sendStatus(500); //other errors
                };
            } else {
                res.status(201).json(result[0]); //success
            };
        });
    }
});

//endpoint 11 anyone
app.get('/product/:id/reviews', function (req, res) {
    const productid = parseInt(req.params.id);
    if (isNaN(productid)) {
        res.status(406).json({ message: `invalid productid given` })
    } else {
        reviews.getReviews(productid, (err, result) => {
            if (err) {
                res.sendStatus(500); //errors
            } else if (result === null) {
                res.status(404).send({ 'message': `no reviews for product <${productid}>` }) //extra validation
            }
            else {
                res.status(200).send(result); //basic requirement - success response
            };
        });
    };
});

//endpoint 12 login required, change so that no need to pass in userid
app.post('/interest/:userid', isLoggedInMiddleware, function (req, res) {
    const userid = req.params.userid;
    const actualUserID = req.params.decodedUserID;
    const actualType = req.params.decodedType;
    if (isNaN(userid)) {
        res.status(406).json({ message: `invalid userid submitted` });
    } else if (actualUserID !== userid && actualType == 'Customer') {
        res.status(403).send({ message: `You can only post interests for your own account` })
    } else if (req.body.categoryids == '' || req.body.categoryids == undefined) {
        res.status(411).json({ message: `categoryids is empty` });
    } else {
        interest.addInterests(req.body.categoryids, userid, (err, result) => {
            if (err) {
                if (err.errno === 1452) { //no user or category found
                    res.status(404).send({ message: `no user or category found` })
                } else if (err.empty) { //no categoryids given
                    res.status(411).send({ message: `categoryids submitted is empty!` })
                } else if (err.errno === 1054 || err.errno === 1064) { //
                    res.status(406).send({ message: 'categoryids invalid input' }); //extra validation
                } else if (err.existingCategory) {
                    res.status(422).send({ message: 'already interested in a category' }); //extra validation
                } else {
                    res.sendStatus(500); //basic requirement - send status 500 when error unknown
                };
            } else {
                res.sendStatus(201); //basic requirement
            };
        });
    }
});

//endpoint 12.5 get interest for specific user 
app.get(`/interest/:userid`, function (req, res) {
    const userid = req.params.userid;
    if (isNaN(userid)) {
        res.status(406).json({ message: `invalid userid submitted` });
    } else {
        interest.getInterests(userid, (err, result) => {
            if (err) {
                res.sendStatus(500); //other errors
            } else if (result === null) {
                res.status(404).send({ message: `No interests found!` }) //extra validation
            }
            else {
                res.status(200).send(result); //success
            };
        })
    }
})
//12.55 delete interest by intid
app.delete('/interest/:intid', function (req, res) {
    const intid = req.params.intid;
    if (isNaN(intid)) {
        res.status(406).json({ message: `invalid intid submitted` });
    } else {
        interest.deleteInterest(intid, (err, result) => {
            if (err) {
                res.sendStatus(500); //other errors
            } else if (result === null) {
                res.status(404).send({ message: `No interest found!` }) //extra validation
            }
            else {
                res.sendStatus(204); //success
            };
        })
    }
})

//DISCOUNTS ADVANCED FEATURE
//search endpoint
app.post('/discounts/search', function (req, res) {
    discounts.searchDiscounts(req.body.search, (err, result) => {
        if (err) {
            console.log(err)
            res.sendStatus(500); //other errors
        } else if (result === null) {
            res.status(404).send({ 'message': `No search results` }) //extra validation
        }
        else {
            res.status(200).send(result); //success
        };
    });
});
//Endpoint 13 Get all discounts information
app.get('/discounts', function (req, res) {
    discounts.getAllDiscounts(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 14 Get discounts for a product
app.get('/discounts/product/:productid', function (req, res) {
    const productid = parseInt(req.params.productid); //get productid from url parameter
    discounts.getDiscountByProduct(productid, function (err, result) {
        if (!err) {
            if (result.length == 0) { //no result means that no discounts exist for that product or product doesn't exist
                res.status(404).send("Discounts not found")
            } else {
                res.status(200).send(result);
            }
        }
        else {
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 15 Get discounts by ID
app.get('/discounts/:discountsid', function (req, res) {
    const discountsid = parseInt(req.params.discountsid); //get discountsid from url parameter
    discounts.getDiscountByID(discountsid, function (err, result) {
        if (!err) {
            if (result.length == 0) { //no result means discount does not exist
                res.status(404).send("Discount not found")
            } else {
                res.status(200).send(result);
            }
        }
        else {
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 16 Add a discount admins only
app.post('/discounts/:productid/', isLoggedInMiddleware, function (req, res) {
    if (req.decodedType == 'Admin') {
        var productid = parseInt(req.params.productid); //get productid from url parameter
        discounts.addDiscount(productid, req.body, function (err, result) {
            if (!err) {
                res.sendStatus(201);
            }
            else if (err.errno == 1452) { //product does not exist
                res.status(404).send("404 Product not found");
            }
            else if (err.errno == 1292) { //datetime format invalid
                res.status(400).send("Invalid value given. Ensure starttime and endtime are in 'YYYY-MM-DD Hour:Min:Sec' format")
            }
            else if (err.errno == 1062) {
                res.status(422).send("Duplicate discount code")
            }
            else {
                res.status(500).send("500 Internal Server Error")
            }
        });
    } else {
        res.status(403).send('Only admins allowed')
    }
});
//Endpoint 17 Delete discount admin only
app.delete('/discounts/:discountid/', isLoggedInMiddleware, function (req, res) {
    if (req.decodedType == 'Admin') {
        var discountid = parseInt(req.params.discountid); //get discountid from url parameter
        discounts.deleteDiscount(discountid, function (err, result) {
            if (!err) {
                if (result[0].length == 0) {//if SELECT query return nothing, discount does not exist
                    res.status(404).send("Discount not found");
                } else {
                    res.sendStatus(204);
                }
            } else {
                res.status(500).send("500 Internal Server Error");
            }
        });
    } else {
        res.status(403).send({ 'message': "Only admins allowed to delete discounts" })
    }
});


module.exports = app;